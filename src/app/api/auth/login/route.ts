import { prisma } from "@/lib/prisma";
import { comparePassword, signJWT } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "E-posta ve şifre zorunludur." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Hatalı e-posta veya şifre." },
                { status: 401 }
            );
        }

        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Hatalı e-posta veya şifre." },
                { status: 401 }
            );
        }

        if (user.status !== "ACTIVE") {
            return NextResponse.json(
                { success: false, message: "Hesabınız henüz aktif değil veya reddedildi." },
                { status: 403 }
            );
        }

        // JWT oluştur
        const token = await signJWT({
            userId: user.id,
            role: user.role,
            email: user.email,
        });

        const response = NextResponse.json(
            { success: true, message: "Giriş başarılı.", data: { role: user.role } },
            { status: 200 }
        );

        // Cookie set et
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 gün
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, message: "Bir sunucu hatası oluştu." },
            { status: 500 }
        );
    }
}
