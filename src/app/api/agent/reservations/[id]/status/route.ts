import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { status } = await req.json();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'AGENT') {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        // Rezervasyonun bu acenteye ait bir tura yapılıp yapılmadığını kontrol et
        const reservation = await prisma.reservation.findFirst({
            where: {
                id,
                tour: {
                    agentId: payload.userId as string
                }
            }
        });

        if (!reservation) {
            return NextResponse.json({ success: false, message: "Rezervasyon bulunamadı veya yetkiniz yok." }, { status: 404 });
        }

        const updated = await prisma.reservation.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({
            success: true,
            data: updated
        });
    } catch (error) {
        console.error("Agent reservation status update error:", error);
        return NextResponse.json({ success: false, message: "Sunucu hatası." }, { status: 500 });
    }
}
