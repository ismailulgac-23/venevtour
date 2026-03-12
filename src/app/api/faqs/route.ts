import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth-utils"
import { cookies } from "next/headers"

// GET all active FAQs
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const payload = token ? await verifyJWT(token) : null
    const isAdmin = payload?.role === "ADMIN"

    const faqs = await prisma.fAQ.findMany({
      where: isAdmin ? {} : { isActive: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ data: faqs })
  } catch (error) {
    return NextResponse.json({ message: "SSS verileri çekilemedi" }, { status: 500 })
  }
}

// POST new FAQ (Admin only)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const payload = token ? await verifyJWT(token) : null

    if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })
    }

    const { question, answer, order, isActive } = await req.json()

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        order: order || 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({ data: faq })
  } catch (error) {
    return NextResponse.json({ message: "SSS oluşturulamadı" }, { status: 500 })
  }
}
