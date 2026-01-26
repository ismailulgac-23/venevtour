import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const userId = payload.userId as string;
        const formData = await request.formData();
        const avatarFile = formData.get("avatar") as File | null;

        let avatarUrl = undefined;

        if (avatarFile && avatarFile.size > 0) {
            const ext = path.extname(avatarFile.name).toLowerCase();
            const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.heic'];

            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return NextResponse.json({
                    success: false,
                    message: `Geçersiz dosya formatı: ${ext}. Sadece webp, jpg, jpeg, png ve heic formatlarına izin verilir.`
                }, { status: 400 });
            }

            // Mevcut kullanıcıyı çekip eski resmini silmeye hazırla
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { avatarUrl: true }
            });

            const bytes = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `avatar-${userId}-${crypto.randomUUID()}${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "users");
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, new Uint8Array(buffer));
            avatarUrl = `/uploads/users/${fileName}`;

            // Eski resmi sil (default değilse)
            if (user?.avatarUrl && user.avatarUrl !== "/uploads/users/default-avatar.jpg" && user.avatarUrl.startsWith("/uploads/")) {
                try {
                    const oldPath = path.join(process.cwd(), "public", user.avatarUrl);
                    await unlink(oldPath);
                } catch (e) {
                    console.error("Old avatar delete error:", e);
                }
            }
        }

        // Diğer profil verileri de güncellenebilir (firstName, lastName vb.)
        const firstName = formData.get("firstName") as string | null;
        const lastName = formData.get("lastName") as string | null;
        const phone = formData.get("phone") as string | null;
        const companyName = formData.get("companyName") as string | null;

        const updatedUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    ...(avatarUrl && { avatarUrl }),
                }
            });

            if (user.role === "CUSTOMER") {
                await tx.customerProfile.update({
                    where: { userId },
                    data: {
                        ...(firstName && { firstName }),
                        ...(lastName && { lastName }),
                        ...(phone && { phone }),
                    }
                });
            } else if (user.role === "AGENT") {
                await tx.agentProfile.update({
                    where: { userId },
                    data: {
                        ...(companyName && { companyName }),
                        ...(phone && { contactPhone: phone }), // Agent için phone contactPhone olarak saklanıyor olabilir
                    }
                });
            }

            return user;
        });

        return NextResponse.json({
            success: true,
            message: "Profil başarıyla güncellendi.",
            data: updatedUser
        });

    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}
