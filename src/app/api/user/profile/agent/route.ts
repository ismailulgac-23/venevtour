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
        const { companyName, contactName, contactPhone, contactEmail, taxOffice, taxNumber, tursabNumber, address, bio } = body;

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            include: { agentProfile: true }
        });

        if (!user || user.role !== 'AGENT') {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        const updatedProfile = await prisma.agentProfile.update({
            where: { userId: user.id },
            data: {
                companyName,
                contactName,
                contactPhone,
                contactEmail,
                taxOffice,
                taxNumber,
                tursabNumber,
                address,
                bio
            }
        });

        return NextResponse.json({ success: true, data: updatedProfile });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Bir sunucu hatası oluştu." }, { status: 500 });
    }
}
