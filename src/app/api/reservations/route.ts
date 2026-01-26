import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Rezervasyon yapmak için giriş yapmalısınız." },
            { status: 401 }
        );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        return NextResponse.json(
            { success: false, message: "Geçersiz oturum." },
            { status: 401 }
        );
    }

    // Acentelerin rezervasyon yapmasını engelle
    if (payload.role === "AGENT") {
        return NextResponse.json(
            { success: false, message: "Acente hesapları rezervasyon yapamaz. Lütfen müşteri hesabı ile giriş yapın." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { tourId, passengers, selectedExtras, startDate, endDate } = body;

        if (!tourId || !passengers || passengers.length === 0) {
            return NextResponse.json(
                { success: false, message: "Eksik bilgi: Tur ve en az bir yolcu seçilmelidir." },
                { status: 400 }
            );
        }

        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
            include: { extras: true },
        });

        if (!tour) return NextResponse.json({ success: false, message: "Seçilen tur bulunamadı." }, { status: 404 });

        // Fiyat Hesaplama
        let totalPrice = Number(tour.priceFrom) * passengers.length;
        if (selectedExtras && Array.isArray(selectedExtras)) {
            const extras = tour.extras.filter((e: any) => selectedExtras.includes(e.id));
            for (const extra of extras) {
                if (extra.isPerPerson) {
                    totalPrice += Number(extra.price) * passengers.length;
                } else {
                    totalPrice += Number(extra.price);
                }
            }
        }

        // Rezervasyonu Oluştur
        const reservation = await prisma.reservation.create({
            data: {
                tourId,
                customerId: payload.userId as string,
                passengerCount: passengers.length,
                totalPrice: totalPrice,
                status: "PENDING",
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                passengers: {
                    create: passengers.map((p: any) => ({
                        fullName: p.fullName,
                        email: p.email,
                        phone: p.phone,
                        idNumber: p.idNumber,
                        gender: p.gender,
                        birthDate: p.birthDate ? new Date(p.birthDate) : undefined,
                    })),
                },
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Rezervasyon talebiniz alındı. Onay bekleniyor.",
                data: reservation,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Reservation Error:", error);
        return NextResponse.json(
            { success: false, message: "Rezervasyon oluşturulurken bir hata oluştu." },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: "Giriş yapmalısınız." }, { status: 401 });
    }
    const payload = await verifyJWT(token);
    if (!payload) {
        return NextResponse.json({ success: false, message: "Geçersiz oturum." }, { status: 401 });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                customerId: payload.userId as string,
            },
            include: {
                tour: {
                    select: {
                        title: true,
                        location: true,
                        images: true,
                        agent: {
                            include: { agentProfile: true }
                        }
                    },
                },
                customer: {
                    select: {
                        email: true,
                        customerProfile: {
                            select: {
                                phone: true
                            }
                        }
                    }
                },
                passengers: true
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: reservations });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Hata oluştu." }, { status: 500 });
    }
}
