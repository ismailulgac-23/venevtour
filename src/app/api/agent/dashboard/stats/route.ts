import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== "AGENT") {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const agentId = payload.userId as string;

        // URL query parametrelerini al
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const dateFilter = startDate && endDate ? {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        } : {};

        // İstatistikleri çek
        const [totalTours, activeTours, totalReservations, revenueResult] = await Promise.all([
            prisma.tour.count({ where: { agentId } }),
            prisma.tour.count({ where: { agentId, isActive: true } }),
            prisma.reservation.count({
                where: {
                    tour: { agentId },
                    ...dateFilter
                }
            }),
            prisma.reservation.aggregate({
                where: {
                    tour: { agentId },
                    status: "CONFIRMED",
                    ...dateFilter
                },
                _sum: { totalPrice: true }
            })
        ]);

        // Aylık rezervasyon verileri (Son 6 ay)
        const labels = [];
        const data = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('tr-TR', { month: 'long' });
            labels.push(monthName);

            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthlyCount = await prisma.reservation.count({
                where: {
                    tour: { agentId },
                    createdAt: { gte: startOfMonth, lte: endOfMonth }
                }
            });
            data.push(monthlyCount);
        }

        return NextResponse.json({
            success: true,
            data: {
                totalTours,
                activeTours,
                totalReservations,
                totalRevenue: revenueResult._sum.totalPrice || 0,
                chartData: {
                    labels,
                    data
                }
            }
        });

    } catch (error: any) {
        console.error("Agent Dashboard API Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}
