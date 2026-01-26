import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            companyName,
            contactName,
            contactPhone,
            email, // Yetkili Email (Login için)
            password,
            tursabNumber,
            taxOffice,
            taxNumber,
            companyType,
            address,
            documentUrl
        } = body;

        // Basit validation
        if (!companyName || !contactName || !email || !password || !tursabNumber) {
            return NextResponse.json(
                { success: false, message: "Lütfen zorunlu alanları doldurun." },
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
        // Acenteler PENDING statüsünde başlar
        await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    email,
                    passwordHash,
                    role: "AGENT",
                    status: "PENDING",
                },
            });

            await tx.agentProfile.create({
                data: {
                    userId: user.id,
                    companyName,
                    contactName,
                    contactPhone: contactPhone || "",
                    contactEmail: email, // Default olarak login email'i
                    tursabNumber,
                    taxOffice,
                    taxNumber,
                    companyType,
                    address,
                    documentUrl,
                },
            });
        });

        return NextResponse.json(
            {
                success: true,
                message: "Acente başvurunuz alınmıştır. Yönetici onayı sonrası hesabınız aktif edilecektir.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register Agent Error:", error);
        return NextResponse.json(
            { success: false, message: "Bir sunucu hatası oluştu." },
            { status: 500 }
        );
    }
}
