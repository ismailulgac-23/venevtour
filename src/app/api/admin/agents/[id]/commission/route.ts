import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // This is the userId of the agent
        const { commissionType, commissionAmount } = await req.json();
        
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ success: false }, { status: 403 });
        }

        const agentProfile = await prisma.agentProfile.update({
            where: { userId: id },
            data: { 
                commissionType, 
                commissionAmount: parseFloat(commissionAmount)
            }
        });

        return NextResponse.json({
            success: true,
            data: agentProfile
        });
    } catch (error) {
        console.error("Commission update error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
