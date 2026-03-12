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

        const [totalTours, totalAgents, totalReservations, pendingAgents, confirmedReservations] = await Promise.all([
            prisma.tour.count(),
            prisma.user.count({ where: { role: 'AGENT' } }),
            prisma.reservation.count(),
            prisma.user.count({ where: { role: 'AGENT', status: 'PENDING' } }),
            prisma.reservation.findMany({
                where: { status: 'CONFIRMED' },
                include: {
                    tour: {
                        include: {
                            agent: {
                                include: {
                                    agentProfile: true
                                }
                            }
                        }
                    }
                }
            })
        ]);

        let totalRevenue = 0;
        let adminEarnings = 0;

        confirmedReservations.forEach(res => {
            const price = Number(res.totalPrice);
            totalRevenue += price;

            const agentProfile = res.tour.agent.agentProfile;
            if (agentProfile) {
                const amount = Number(agentProfile.commissionAmount);
                if (agentProfile.commissionType === 'PERCENTAGE') {
                    adminEarnings += (price * amount) / 100;
                } else {
                    adminEarnings += amount;
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: { 
                totalTours, 
                totalAgents, 
                totalReservations, 
                pendingAgents,
                totalRevenue,
                adminEarnings
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
