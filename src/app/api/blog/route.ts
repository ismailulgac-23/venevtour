import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { verifyJWT } from "@/lib/auth-utils"
import { cookies } from "next/headers"

// GET all active blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isActive: true },
      include: { author: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ data: posts })
  } catch (error) {
    return NextResponse.json({ message: "Postlar çekilemedi" }, { status: 500 })
  }
}

// POST new blog post (Admin only)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const payload = token ? await verifyJWT(token) : null

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 })
    }

    const { title, content, excerpt, image, slug } = await req.json()

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        image,
        slug,
        authorId: payload.userId as string
      }
    })

    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json({ message: "Post oluşturulamadı" }, { status: 500 })
  }
}
