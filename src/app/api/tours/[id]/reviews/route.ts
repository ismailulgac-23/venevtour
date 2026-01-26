import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: tourId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Yorum yapmak için giriş yapmalısınız." },
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

    try {
        const body = await request.json();
        const { rating, comment } = body;

        if (!rating || !comment) {
            return NextResponse.json(
                { success: false, message: "Puan ve yorum alanları zorunludur." },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                tourId,
                userId: payload.userId as string,
                rating: Number(rating),
                comment,
            },
        });

        return NextResponse.json(
            { success: true, message: "Yorumunuz başarıyla eklendi.", data: review },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Review Error:", error);
        return NextResponse.json(
            { success: false, message: "Yorum eklenirken bir hata oluştu." },
            { status: 500 }
        );
    }
}
