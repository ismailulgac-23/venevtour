import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) return NextResponse.json({ success: false }, { status: 401 });

        const favorites = await prisma.favorite.findMany({
            where: { userId: payload.userId as string },
            include: {
                tour: {
                    include: {
                        images: true,
                        category: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: favorites
        });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
