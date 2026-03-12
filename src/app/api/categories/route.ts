import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({
            success: true,
            data: categories
        });
    } catch (error: any) {
        console.error("Categories API Error:", error);
        return NextResponse.json({
            success: false,
            message: "Kategoriler yüklenemedi."
        }, { status: 500 });
    }
}
