import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || (payload.role !== "AGENT" && payload.role !== "ADMIN")) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const formData = await request.formData();

        // Verileri Al
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const priceFrom = formData.get("priceFrom") as string;
        const durationDays = formData.get("durationDays") as string;
        const maxCapacity = formData.get("maxCapacity") as string;
        const isActive = formData.get("isActive") === "true";
        const includes = JSON.parse(formData.get("includes") as string || "[]");
        const excludes = JSON.parse(formData.get("excludes") as string || "[]");
        const existingImages = JSON.parse(formData.get("existingImages") as string || "[]");

        // Turun sahibi mi kontrol et
        const tour = await prisma.tour.findUnique({
            where: { id },
            include: { images: true }
        });

        if (!tour) return NextResponse.json({ success: false, message: "Tur bulunamadı." }, { status: 404 });
        if (payload.role !== "ADMIN" && tour.agentId !== payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz işlem." }, { status: 403 });
        }

        // Yeni Dosyaları Kaydet
        const newFiles = formData.getAll("files") as File[];
        const newImageUrls: string[] = [];
        const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.heic'];

        for (const file of newFiles) {
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                return NextResponse.json({
                    success: false,
                    message: `Geçersiz dosya formatı: ${ext}. Sadece webp, jpg, jpeg, png ve heic formatlarına izin verilir.`
                }, { status: 400 });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${crypto.randomUUID()}${ext}`;
            const uploadDir = path.join(process.cwd(), "public", "uploads", "tours");
            const filePath = path.join(uploadDir, fileName);
            await writeFile(filePath, new Uint8Array(buffer));
            newImageUrls.push(`/uploads/tours/${fileName}`);
        }

        // Silinen resimleri diskten de silmek iyi olur (Opsiyonel ama önerilir)
        const existingImageIds = existingImages.map((img: any) => img.id);
        const imagesToDelete = tour.images.filter(img => !existingImageIds.includes(img.id));

        for (const img of imagesToDelete) {
            if (img.url.startsWith('/uploads/')) {
                const fullPath = path.join(process.cwd(), "public", img.url);
                try { await unlink(fullPath); } catch (e) { }
            }
        }

        // Veritabanı Güncelleme
        const updatedTour = await prisma.$transaction(async (tx) => {
            // 1. Temel verileri güncelle
            const updated = await tx.tour.update({
                where: { id },
                data: {
                    title,
                    description,
                    location,
                    priceFrom: Number(priceFrom),
                    durationDays: Number(durationDays),
                    maxCapacity: Number(maxCapacity),
                    isActive,
                    includes,
                    excludes,
                },
            });

            // 2. Resimleri güncelle
            // Önce mevcutlardan silinmesi gerekenleri sil
            await tx.tourImage.deleteMany({
                where: {
                    tourId: id,
                    id: { notIn: existingImageIds }
                }
            });

            // Yeni resimleri ekle
            if (newImageUrls.length > 0) {
                await tx.tourImage.createMany({
                    data: newImageUrls.map((url, index) => ({
                        tourId: id,
                        url,
                        isFeature: index === 0 && existingImages.length === 0, // Eğer hiç eski resim kalmadıysa ilki feature olsun
                    })),
                });
            }

            return updated;
        });

        return NextResponse.json({
            success: true,
            message: "Tur başarıyla güncellendi.",
            data: updatedTour
        });

    } catch (error: any) {
        console.error("Advanced Tour Update Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}
