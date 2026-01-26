import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const agentId = searchParams.get("agentId");

    const where: any = {
        isActive: true,
    };

    if (location) {
        where.location = { contains: location, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
        where.priceFrom = {};
        if (minPrice) where.priceFrom.gte = Number(minPrice);
        if (maxPrice) where.priceFrom.lte = Number(maxPrice);
    }

    if (agentId) {
        where.agentId = agentId;
    }

    try {
        const tours = await prisma.tour.findMany({
            where,
            include: {
                images: {
                    where: { isFeature: true },
                    take: 1,
                },
                agent: {
                    include: {
                        agentProfile: true, // Acente şirket ismi vb. için
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, data: tours });
    } catch (error) {
        console.error("Get Tours Error:", error);
        return NextResponse.json(
            { success: false, message: "Turlar getirilirken bir hata oluştu." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Oturum açmanız gerekiyor." },
            { status: 401 }
        );
    }

    const payload = await verifyJWT(token);
    if (!payload || (payload.role !== "AGENT" && payload.role !== "ADMIN")) {
        return NextResponse.json(
            { success: false, message: "Bunu yapmaya yetkiniz yok." },
            { status: 403 }
        );
    }

    // Acente aktiflik kontrolü
    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
    });

    if (user?.status !== "ACTIVE") {
        return NextResponse.json(
            { success: false, message: "Hesabınız henüz onaylanmamış." },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const {
            title,
            description,
            location,
            priceFrom,
            durationDays,
            maxCapacity,
            includes,
            excludes,
            images, // Array of URLs
            extras, // Array of { name, price, isPerPerson }
            tourStartDate,
            tourEndDate,
        } = body;

        // Transaction ile tur ve ilişkili verileri oluştur
        const newTour = await prisma.$transaction(async (tx: any) => {
            const tour = await tx.tour.create({
                data: {
                    agentId: user.id,
                    title,
                    description,
                    location,
                    priceFrom,
                    durationDays: Number(durationDays),
                    maxCapacity: Number(maxCapacity),
                    includes,
                    excludes,
                    tourStartDate: tourStartDate ? new Date(tourStartDate) : null,
                    tourEndDate: tourEndDate ? new Date(tourEndDate) : null,
                },
            });

            // Görselleri ekle
            if (images && images.length > 0) {
                await tx.tourImage.createMany({
                    data: images.map((url: string, index: number) => ({
                        tourId: tour.id,
                        url,
                        isFeature: index === 0, // İlki feature olsun
                    })),
                });
            }

            // Ekstraları ekle
            if (extras && extras.length > 0) {
                await tx.tourExtra.createMany({
                    data: extras.map((e: any) => ({
                        tourId: tour.id,
                        name: e.name,
                        price: e.price,
                        isPerPerson: e.isPerPerson ?? true
                    }))
                });
            }

            return tour;
        });

        return NextResponse.json(
            { success: true, message: "Tur başarıyla oluşturuldu.", data: newTour },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Tour Error:", error);
        return NextResponse.json(
            { success: false, message: "Tur oluşturulurken hata oluştu." },
            { status: 500 }
        );
    }
}
