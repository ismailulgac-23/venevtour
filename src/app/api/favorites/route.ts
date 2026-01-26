import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: payload.userId as string },
            include: {
                tour: {
                    include: {
                        images: { take: 1 },
                    },
                },
            },
        });

        return NextResponse.json({ success: true, data: favorites });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error fetching favorites" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: "Giriş yapmalısınız." }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ success: false, message: "Geçersiz oturum." }, { status: 401 });
    }

    try {
        const { tourId } = await request.json();
        if (!tourId) {
            return NextResponse.json({ success: false, message: "Tur ID gerekli." }, { status: 400 });
        }

        const favorite = await prisma.favorite.create({
            data: {
                userId: payload.userId as string,
                tourId: tourId,
            },
        });

        return NextResponse.json({ success: true, message: "Favorilere eklendi.", data: favorite });
    } catch (error) {
        // Unique constraint violation check could be good, but MVP.
        return NextResponse.json({ success: false, message: "Zaten favorilerde ekli veya hata oluştu." }, { status: 500 });
    }
}
