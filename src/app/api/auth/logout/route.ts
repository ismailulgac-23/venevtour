import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { success: true, message: "Çıkış yapıldı." },
        { status: 200 }
    );

    response.cookies.set("auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return response;
}
