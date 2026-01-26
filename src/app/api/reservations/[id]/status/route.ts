import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) return NextResponse.json({ success: false }, { status: 401 });

        const { status } = await request.json();

        // Reservasyonu bul ve kontrol et
        const reservation = await prisma.reservation.findUnique({
            where: { id },
            include: { tour: true }
        });

        if (!reservation) return NextResponse.json({ success: false, message: "Rezervasyon bulunamadı." }, { status: 404 });

        // Sadece admin veya tur sahibi acente değiştirebilir
        if (payload.role !== 'ADMIN' && reservation.tour.agentId !== payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        const updated = await prisma.reservation.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
