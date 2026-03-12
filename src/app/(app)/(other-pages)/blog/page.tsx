'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import BgGlassmorphism from '@/components/BgGlassmorphism'

const BlogPage = () => {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog')
                if (res.ok) {
                    const json = await res.json()
                    setPosts(json.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    return (
        <div className="relative overflow-hidden min-h-screen">
            <BgGlassmorphism />
            <div className="container py-16 lg:py-24 space-y-16">
                <div className="max-w-2xl">
                    <h2 className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase italic">Blog & Haberler</h2>
                    <p className="mt-4 text-lg text-neutral-500 font-medium tracking-tight">En yeni turlar, seyahat tavsiyeleri ve acente dünyasından gelişmeler hakkında her şey.</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-4 animate-pulse">
                                <div className="aspect-[16/10] bg-neutral-100 dark:bg-neutral-800 rounded-[40px]" />
                                <div className="h-6 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
                                <div className="h-4 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group space-y-6">
                                <div className="aspect-[16/10] overflow-hidden rounded-[40px] relative shadow-2xl shadow-black/5">
                                    <img 
                                        src={post.image || "/images/placeholder.jpg"} 
                                        className="size-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                                        alt={post.title} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-3 px-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full italic">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors tracking-tight line-clamp-2 uppercase italic">{post.title}</h3>
                                    <p className="text-neutral-500 dark:text-neutral-400 font-medium text-sm line-clamp-2 leading-relaxed tracking-tight">{post.excerpt}</p>
                                    <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                                        DEVAMINI OKU
                                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 font-medium italic">Henüz yazı eklenmemiş.</p>
                )}
            </div>
        </div>
    )
}

export default BlogPage
