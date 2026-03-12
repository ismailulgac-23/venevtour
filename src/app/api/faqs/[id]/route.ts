import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth-utils"
import { cookies } from "next/headers"

// PATCH update FAQ (Admin only)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const payload = token ? await verifyJWT(token) : null

    if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })
    }

    const data = await req.json()
    const updated = await prisma.fAQ.update({
      where: { id },
      data
    })
    return NextResponse.json({ data: updated })
  } catch (error) {
    return NextResponse.json({ message: "SSS güncellenemedi" }, { status: 500 })
  }
}

// DELETE FAQ (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const payload = token ? await verifyJWT(token) : null

    if (!payload || payload.role !== 'ADMIN') {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })
    }
    
    await prisma.fAQ.delete({ where: { id } })
    return NextResponse.json({ message: "SSS silindi" })
  } catch (error) {
    return NextResponse.json({ message: "SSS silinemedi" }, { status: 500 })
  }
}
