import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "AGENT") return NextResponse.json({ success: false }, { status: 403 });

    try {
        // Acentenin kendi turlarına yapılan rezervasyonları bul
        const reservations = await prisma.reservation.findMany({
            where: {
                tour: {
                    agentId: payload.userId as string,
                },
            },
            include: {
                tour: {
                    select: { title: true },
                },
                customer: {
                    include: {
                        customerProfile: true
                    }
                },
                passengers: true,
                extras: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: reservations });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
