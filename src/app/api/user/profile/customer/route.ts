import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ success: false, message: "Geçersiz oturum." }, { status: 401 });
        }

        const body = await request.json();
        const { firstName, lastName, phone } = body;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            include: { customerProfile: true }
        });

        if (!user || user.role !== 'CUSTOMER') {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        const updatedProfile = await prisma.customerProfile.update({
            where: { userId: user.id },
            data: {
                firstName,
                lastName,
                phone
            }
        });

        return NextResponse.json({ success: true, data: updatedProfile });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Bir sunucu hatası oluştu." }, { status: 500 });
    }
}
