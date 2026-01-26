import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Oturum bulunamadı." },
            { status: 401 }
        );
    }

    const payload = await verifyJWT(token);

    if (!payload || !payload.userId) {
        return NextResponse.json(
            { success: false, message: "Geçersiz oturum." },
            { status: 401 }
        );
    }

    // Kullanıcı detaylarını çek
    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            avatarUrl: true,
            customerProfile: true, // Eğer customer ise
            agentProfile: true, // Eğer agent ise
        },
    });

    if (!user) {
        return NextResponse.json(
            { success: false, message: "Kullanıcı bulunamadı." },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { success: true, data: user },
        { status: 200 }
    );
}
