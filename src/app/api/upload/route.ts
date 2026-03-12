import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const type = formData.get("type") as string || "general"; // folder name: blog, tours, etc.

        if (!file || file.size === 0) {
            return NextResponse.json({ success: false, message: "Dosya seçilmedi." }, { status: 400 });
        }

        const ext = path.extname(file.name).toLowerCase();
        const ALLOWED_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png', '.heic', '.pdf', '.docx'];

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({
                success: false,
                message: `Geçersiz dosya formatı: ${ext}.`
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const fileName = `${type}-${crypto.randomUUID()}${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", type);
        
        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, new Uint8Array(buffer));

        const fileUrl = `/uploads/${type}/${fileName}`;

        return NextResponse.json({
            success: true,
            url: fileUrl
        });

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}
