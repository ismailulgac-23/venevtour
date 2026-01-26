import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ tourId: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    try {
        const resolvedParams = await params;
        const { tourId } = resolvedParams;

        await prisma.favorite.deleteMany({
            where: {
                userId: payload.userId as string,
                tourId: tourId,
            },
        });

        return NextResponse.json({ success: true, message: "Favorilerden kaldırıldı." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
