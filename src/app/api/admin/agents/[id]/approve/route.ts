import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false }, { status: 403 });

    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        await prisma.user.update({
            where: { id },
            data: { status: "ACTIVE" },
        });

        return NextResponse.json({ success: true, message: "Acente onaylandı." });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
