import { verifyJWT, comparePassword, hashPassword } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) return NextResponse.json({ success: false, message: "Geçersiz oturum." }, { status: 401 });

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, message: "Tüm alanlar zorunludur." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string }
        });

        if (!user) return NextResponse.json({ success: false, message: "Kullanıcı bulunamadı." }, { status: 404 });

        const isCurrentValid = await comparePassword(currentPassword, user.passwordHash);
        if (!isCurrentValid) {
            return NextResponse.json({ success: false, message: "Mevcut şifreniz hatalı." }, { status: 400 });
        }

        const newHash = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash }
        });

        return NextResponse.json({ success: true, message: "Şifre başarıyla güncellendi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Bir sunucu hatası oluştu." }, { status: 500 });
    }
}
