import { verifyJWT } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'AGENT') {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        const startDate = startDateParam ? new Date(startDateParam) : undefined;
        const endDate = endDateParam ? new Date(endDateParam) : undefined;

        if (endDate) {
            endDate.setHours(23, 59, 59, 999);
        }

        const agent = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            include: {
                agentProfile: true,
                tours: {
                    include: {
                        reservations: {
                            where: { 
                                status: 'CONFIRMED',
                                ...( (startDate || endDate) && {
                                    createdAt: {
                                        ...(startDate && { gte: startDate }),
                                        ...(endDate && { lte: endDate }),
                                    }
                                })
                            }
                        }
                    }
                }
            }
        });

        if (!agent) {
            return NextResponse.json({ success: false, message: "Acente bulunamadı." }, { status: 404 });
        }

        let totalSales = 0;
        let adminCommission = 0;
        let reservationCount = 0;
        const dailyData: { [key: string]: { sales: number; commission: number; net: number; count: number } } = {};

        agent.tours.forEach(tour => {
            tour.reservations.forEach(res => {
                const price = Number(res.totalPrice);
                totalSales += price;
                reservationCount++;

                let comm = 0;
                const profile = agent.agentProfile;
                if (profile) {
                    if (profile.commissionType === 'PERCENTAGE') {
                        comm = (price * Number(profile.commissionAmount)) / 100;
                    } else {
                        comm = Number(profile.commissionAmount);
                    }
                }
                adminCommission += comm;

                const dateKey = new Date(res.createdAt).toISOString().split('T')[0];
                if (!dailyData[dateKey]) {
                    dailyData[dateKey] = { sales: 0, commission: 0, net: 0, count: 0 };
                }
                dailyData[dateKey].sales += price;
                dailyData[dateKey].commission += comm;
                dailyData[dateKey].net += (price - comm);
                dailyData[dateKey].count += 1;
            });
        });

        const history = Object.keys(dailyData).sort().map(date => ({
            date,
            ...dailyData[date]
        }));

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalSales,
                    adminCommission,
                    agentNet: totalSales - adminCommission,
                    reservationCount
                },
                history
            }
        });

    } catch (error: any) {
        console.error("Agent revenue error:", error);
        return NextResponse.json({ success: false, message: "Sunucu hatası." }, { status: 500 });
    }
}
