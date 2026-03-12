import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BgGlassmorphism from "@/components/BgGlassmorphism"
import { CalendarIcon, UserIcon } from "@heroicons/react/24/outline"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return { title: "Yazı Bulunamadı" }
  return { title: post.title, description: post.excerpt }
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { include: { customerProfile: true, agentProfile: true } } }
  })

  if (!post) return notFound()

  return (
    <div className="relative overflow-hidden min-h-screen">
      <BgGlassmorphism />
      <div className="container py-16 lg:py-24 space-y-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-6 text-xs font-black uppercase tracking-widest text-neutral-400 italic">
                    <span className="flex items-center gap-2"><CalendarIcon className="size-4" /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    <span className="flex items-center gap-2"><UserIcon className="size-4" /> {post.author.customerProfile ? `${post.author.customerProfile.firstName} ${post.author.customerProfile.lastName}` : post.author.agentProfile?.companyName || 'Admin'}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase italic leading-[1.1]">{post.title}</h1>
            </div>

            <div className="aspect-[21/9] overflow-hidden rounded-[60px] shadow-2xl shadow-black/10">
                <img src={post.image || "/images/placeholder.jpg"} className="size-full object-cover" alt={post.title} />
            </div>

            <article className="prose prose-lg dark:prose-invert mx-auto py-10 leading-loose text-neutral-600 dark:text-neutral-300 font-medium">
                {post.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </article>

            <div className="pt-20 border-t border-neutral-100 dark:border-neutral-800 flex flex-col items-center gap-4">
                <span className="text-xs font-black italic text-neutral-400 uppercase tracking-widest opacity-60">Paylaşmayı Unutmayın</span>
                <div className="flex gap-4">
                     {/* Placeholder social icons */}
                     <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">FB</div>
                     <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">TW</div>
                     <div className="size-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-primary-50 transition-colors cursor-pointer">IG</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
