import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return NextResponse.json({ success: false }, { status: 401 });
    const payload = await verifyJWT(token);
    if (!payload || payload.role !== "ADMIN") return NextResponse.json({ success: false }, { status: 403 });

    try {
        const pendingAgents = await prisma.user.findMany({
            where: {
                role: "AGENT",
                status: "PENDING",
            },
            include: {
                agentProfile: true,
            },
        });

        return NextResponse.json({ success: true, data: pendingAgents });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
