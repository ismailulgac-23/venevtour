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

        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ success: false }, { status: 403 });
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
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
