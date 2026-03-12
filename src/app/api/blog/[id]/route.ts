import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth-utils"
import { cookies } from "next/headers"

// GET one blog post
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: true }
    })
    if (!post) return NextResponse.json({ message: "Post bulunamadı" }, { status: 404 })
    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json({ message: "Bilinmeyen bir hata" }, { status: 500 })
  }
}

// PATCH update blog post (Admin only)
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
    const updated = await prisma.blogPost.update({
      where: { id },
      data
    })
    return NextResponse.json({ data: updated })
  } catch (error) {
    return NextResponse.json({ message: "Güncellenemedi" }, { status: 500 })
  }
}

// DELETE blog post (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const payload = token ? await verifyJWT(token) : null

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })
    }

    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ message: "Post silindi" })
  } catch (error) {
    return NextResponse.json({ message: "Silinemedi" }, { status: 500 })
  }
}
