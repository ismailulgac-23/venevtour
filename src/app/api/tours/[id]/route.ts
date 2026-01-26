import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tour = await prisma.tour.findUnique({
            where: { id },
            include: {
                images: true,
                extras: true,
                roadmaps: true,
                agent: {
                    include: { agentProfile: true }
                }
            }
        });

        if (!tour) return NextResponse.json({ success: false }, { status: 404 });

        return NextResponse.json({ success: true, data: tour });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

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

        const { title, description, location, priceFrom, durationDays, maxCapacity, isActive, tourStartDate, tourEndDate } = body;

        const tour = await prisma.tour.findUnique({ where: { id } });
        if (!tour) return NextResponse.json({ success: false }, { status: 404 });

        // Yetki kontrolü: Sadece sahibi veya admin
        if (payload.role !== 'ADMIN' && tour.agentId !== payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        const updated = await prisma.tour.update({
            where: { id },
            data: {
                title,
                description,
                location,
                priceFrom,
                durationDays: durationDays ? Number(durationDays) : undefined,
                maxCapacity: maxCapacity ? Number(maxCapacity) : undefined,
                isActive,
                tourStartDate: tourStartDate ? new Date(tourStartDate) : undefined,
                tourEndDate: tourEndDate ? new Date(tourEndDate) : undefined,
            }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function DELETE(
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

        const tour = await prisma.tour.findUnique({ where: { id } });
        if (!tour) return NextResponse.json({ success: false }, { status: 404 });

        if (payload.role !== 'ADMIN' && tour.agentId !== payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        await prisma.tour.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Tur başarıyla silindi." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Silme işlemi başarısız. Bu turun rezervasyonları olabilir." }, { status: 500 });
    }
}
