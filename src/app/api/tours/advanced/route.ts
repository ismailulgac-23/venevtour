import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || (payload.role !== "AGENT" && payload.role !== "ADMIN")) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const formData = await request.formData();

        // Temel Bilgiler
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const priceFrom = formData.get("priceFrom") as string;
        const durationDays = formData.get("durationDays") as string;
        const maxCapacity = formData.get("maxCapacity") as string;
        const includes = JSON.parse(formData.get("includes") as string || "[]");
        const excludes = JSON.parse(formData.get("excludes") as string || "[]");

        // Dosyaları Al
        const files = formData.getAll("files") as File[];
        const imageUrls: string[] = [];

        // Dosya Kaydetme İşlemleri
        const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.heic'];

        for (const file of files) {
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return NextResponse.json({
                    success: false,
                    message: `Geçersiz dosya formatı: ${ext}. Sadece webp, jpg, jpeg, png ve heic formatlarına izin verilir.`
                }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Benzersiz dosya adı oluştur
            const fileName = `${crypto.randomUUID()}${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "tours");
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, new Uint8Array(buffer));
            imageUrls.push(`/uploads/tours/${fileName}`);
        }

        // Veritabanına Kaydet
        const newTour = await prisma.$transaction(async (tx) => {
            const tour = await tx.tour.create({
                data: {
                    agentId: payload.userId as string,
                    title,
                    description,
                    location,
                    priceFrom: Number(priceFrom),
                    durationDays: Number(durationDays),
                    maxCapacity: Number(maxCapacity),
                    includes,
                    excludes,
                },
            });

            if (imageUrls.length > 0) {
                await tx.tourImage.createMany({
                    data: imageUrls.map((url, index) => ({
                        tourId: tour.id,
                        url,
                        isFeature: index === 0,
                    })),
                });
            }

            return tour;
        });

        return NextResponse.json({
            success: true,
            message: "Tur başarıyla oluşturuldu.",
            data: newTour
        });

    } catch (error: any) {
        console.error("Advanced Tour Create Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası oluştu: " + error.message
        }, { status: 500 });
    }
}
