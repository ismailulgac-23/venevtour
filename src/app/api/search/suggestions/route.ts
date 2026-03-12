import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || "";

    try {
        // Get unique locations from turs
        const tours = await prisma.tour.findMany({
            where: {
                isActive: true,
                OR: [
                    { location: { contains: query, mode: 'insensitive' } },
                    { title: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                location: true,
                title: true,
                id: true
            },
            take: 10
        });

        // Unique locations
        const locations = Array.from(new Set(tours.map(t => t.location))).map(loc => ({
            id: `loc-${loc}`,
            name: loc,
            type: 'location'
        }));

        // Matched titles
        const titles = tours.filter(t => t.title.toLowerCase().includes(query)).map(t => ({
            id: t.id,
            name: t.title,
            type: 'tour'
        }));

        return NextResponse.json({
            success: true,
            data: {
                locations: locations.slice(0, 5),
                tours: titles.slice(0, 5)
            }
        });
    } catch (error: any) {
        console.error("Search Suggestions API Error:", error);
        return NextResponse.json({
            success: false,
            message: "Öneriler yüklenemedi."
        }, { status: 500 });
    }
}
