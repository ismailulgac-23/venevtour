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
        if (!payload || !payload.userId || (payload.role !== "ADMIN" && payload.role !== "OWNER")) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role") || undefined;
        const status = searchParams.get("status") || undefined;
        const search = searchParams.get("search") || "";

        const users = await prisma.user.findMany({
            where: {
                ...(role && { role: role as any }),
                ...(status && { status: status as any }),
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { 
                        customerProfile: {
                            OR: [
                                { firstName: { contains: search, mode: 'insensitive' } },
                                { lastName: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    },
                    {
                        agentProfile: {
                            OR: [
                                { companyName: { contains: search, mode: 'insensitive' } },
                                { contactName: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    }
                ]
            },
            include: {
                customerProfile: true,
                agentProfile: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: users
        });

    } catch (error: any) {
        console.error("Admin Users Fetch Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return NextResponse.json({ success: false, message: "Oturum bulunamadı." }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId || (payload.role !== "ADMIN" && payload.role !== "OWNER")) {
            return NextResponse.json({ success: false, message: "Yetkisiz erişim." }, { status: 403 });
        }

        const body = await request.json();
        const { userId, role, status, email, firstName, lastName, phone, companyName } = body;

        if (!userId) return NextResponse.json({ success: false, message: "Kullanıcı ID gereklidir." }, { status: 400 });

        // Update User
        const updatedUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    ...(role && { role }),
                    ...(status && { status }),
                    ...(email && { email }),
                }
            });

            if (user.role === "CUSTOMER" || user.role === "ADMIN") {
                await tx.customerProfile.upsert({
                    where: { userId },
                    create: {
                        userId,
                        firstName: firstName || "",
                        lastName: lastName || "",
                        phone: phone || ""
                    },
                    update: {
                        ...(firstName && { firstName }),
                        ...(lastName && { lastName }),
                        ...(phone && { phone }),
                    }
                });
            } else if (user.role === "AGENT") {
                await tx.agentProfile.upsert({
                    where: { userId },
                    create: {
                        user: { connect: { id: userId } },
                        companyName: companyName || "",
                        contactName: firstName + (lastName ? " " + lastName : ""),
                        contactPhone: phone || "",
                        contactEmail: email || "",
                        tursabNumber: body.tursabNumber || "TEMP-000",
                    },
                    update: {
                        ...(companyName && { companyName }),
                        ...(firstName && { contactName: firstName + (lastName ? " " + lastName : "") }),
                        ...(phone && { contactPhone: phone }),
                        ...(body.tursabNumber && { tursabNumber: body.tursabNumber }),
                        ...(body.taxOffice && { taxOffice: body.taxOffice }),
                        ...(body.taxNumber && { taxNumber: body.taxNumber }),
                    }
                });
            }

            return user;
        });

        return NextResponse.json({
            success: true,
            message: "Kullanıcı başarıyla güncellendi.",
            data: updatedUser
        });

    } catch (error: any) {
        console.error("Admin User Update Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sunucu hatası: " + error.message
        }, { status: 500 });
    }
}
