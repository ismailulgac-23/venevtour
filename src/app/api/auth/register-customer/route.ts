import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, phone, password } = body;

        // Basit validation
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { success: false, message: "Eksik bilgi gönderildi." },
                { status: 400 }
            );
        }

        // Email kontrolü
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "Bu e-posta adresi zaten kullanılıyor." },
                { status: 409 }
            );
        }

        // Şifre hashleme
        const passwordHash = await hashPassword(password);

        // Transaction ile User ve Profile oluşturma
        // Transaction kullanarak ikisinin de oluştuğundan emin oluruz
        const newUser = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: "CUSTOMER",
                    status: "ACTIVE", // Müşteriler direkt aktif
                },
            });

            await tx.customerProfile.create({
                data: {
                    userId: user.id,
                    firstName,
                    lastName,
                    phone,
                },
            });

            return user;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Kayıt başarılı. Giriş yapabilirsiniz.",
                data: { userId: newUser.id },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register Customer Error:", error);
        return NextResponse.json(
            { success: false, message: "Bir sunucu hatası oluştu." },
            { status: 500 }
        );
    }
}
