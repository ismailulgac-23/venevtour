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
        const removeAvatar = formData.get("removeAvatar") === "true";

        let avatarUrl = undefined;

        // Mevcut kullanıcıyı çekip eski resmini silmeye hazırla
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true }
        });

        if (removeAvatar) {
            avatarUrl = "/uploads/users/default-avatar.jpg";
            
            // Eski resmi sil (default değilse)
            if (user?.avatarUrl && user.avatarUrl !== "/uploads/users/default-avatar.jpg" && user.avatarUrl.startsWith("/uploads/")) {
                try {
                    const oldPath = path.join(process.cwd(), "public", user.avatarUrl);
                    const fs = require('fs/promises');
                    await fs.unlink(oldPath);
                } catch (e) {
                    console.error("Old avatar delete error:", e);
                }
            }
        } else if (avatarFile && avatarFile.size > 0) {
            const ext = path.extname(avatarFile.name).toLowerCase();
            const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.heic'];

            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return NextResponse.json({
                    success: false,
                    message: `Geçersiz dosya formatı: ${ext}. Sadece webp, jpg, jpeg, png ve heic formatlarına izin verilir.`
                }, { status: 400 });
            }

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

            if (user.role === "CUSTOMER" || user.role === "ADMIN") {
                await tx.customerProfile.upsert({
                    where: { userId },
                    create: {
                        userId,
                        firstName: firstName || "",
                        lastName: lastName || "",
                        phone: phone || ""
                    },
                    update: {
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
                        ...(firstName && { contactName: firstName + (lastName ? " " + lastName : "") }),
                        ...(phone && { contactPhone: phone }),
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
