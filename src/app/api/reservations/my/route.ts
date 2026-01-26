import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "CUSTOMER") return NextResponse.json({ success: false }, { status: 403 });

    try {
        const reservations = await prisma.reservation.findMany({
            where: { customerId: payload.userId as string },
            include: {
                tour: {
                    select: { title: true, images: { take: 1 } },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: reservations });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
