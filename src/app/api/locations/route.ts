import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const tours = await prisma.tour.findMany({
            where: { isActive: true },
            select: { location: true },
            distinct: ['location']
        });

        const locations = tours.map(t => t.location);

        return NextResponse.json({ success: true, data: locations });
    } catch (error) {
        return NextResponse.json({ success: false, data: ["İstanbul", "Antalya", "Kapadokya", "İzmir", "Bursa"] });
    }
}
