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
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ success: false }, { status: 403 });
        }

        const agents = await prisma.user.findMany({
            where: { role: 'AGENT' },
            include: {
                agentProfile: true,
                tours: {
                    include: {
                        reservations: {
                            where: { status: 'CONFIRMED' }
                        }
                    }
                }
            }
        });

        const agentEarnings = agents.map(agent => {
            let totalSales = 0;
            let adminCommission = 0;

            agent.tours.forEach(tour => {
                tour.reservations.forEach(res => {
                    const price = Number(res.totalPrice);
                    totalSales += price;

                    const profile = agent.agentProfile;
                    if (profile) {
                        if (profile.commissionType === 'PERCENTAGE') {
                            adminCommission += (price * Number(profile.commissionAmount)) / 100;
                        } else {
                            adminCommission += Number(profile.commissionAmount);
                        }
                    }
                });
            });

            return {
                id: agent.id,
                companyName: agent.agentProfile?.companyName,
                contactName: agent.agentProfile?.contactName,
                totalSales,
                adminCommission,
                agentNet: totalSales - adminCommission,
                reservationCount: agent.tours.reduce((acc, tour) => acc + tour.reservations.length, 0)
            };
        });

        return NextResponse.json({
            success: true,
            data: agentEarnings
        });
    } catch (error) {
        console.error("Admin revenue error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
