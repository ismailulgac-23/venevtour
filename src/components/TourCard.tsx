'use client'

import BtnLikeIcon from '@/components/BtnLikeIcon'
import GallerySlider from '@/components/GallerySlider'
import SaleOffBadge from '@/components/SaleOffBadge'
import StartRating from '@/components/StartRating'
import { Badge } from '@/shared/Badge'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Props {
    className?: string
    ratioClass?: string
    data: any // Can be typed to prisma Tour model
    size?: 'default' | 'small'
    onLikeChange?: (isLiked: boolean) => void
}

const TourCard: FC<Props> = ({
    size = 'default',
    className = '',
    data,
    ratioClass = 'aspect-w-3 aspect-h-3',
    onLikeChange,
}) => {
    const router = useRouter()
    const {
        images,
        galleryImgs,
        location,
        address,
        title,
        priceFrom,
        price,
        id,
        durationDays,
        category,
        like = false
    } = data

    const [isLiked, setIsLiked] = useState(like)
    const [loading, setLoading] = useState(false)

    const listingHref = data.href || `/tours/${id}`
    const finalGalleryImgs = galleryImgs || images?.map((img: any) => img.url) || []
    const finalLocation = location || address
    const finalPrice = priceFrom || (typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price)

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (loading) return
        setLoading(true)

        try {
            // Önce login kontrolü
            const authRes = await fetch('/api/auth/me')
            if (!authRes.ok) {
                toast.error('Favorilere eklemek için giriş yapmalısınız.')
                router.push(`/login?redirect=${window.location.pathname}`)
                return
            }

            if (isLiked) {
                // Favoriden kaldır
                const res = await fetch(`/api/favorites/${id}`, {
                    method: 'DELETE'
                })
                if (res.ok) {
                    setIsLiked(false)
                    onLikeChange?.(false)
                    toast.success('Favorilerden kaldırıldı.')
                } else {
                    toast.error('Bir hata oluştu.')
                }
            } else {
                // Favoriye ekle
                const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tourId: id })
                })
                if (res.ok) {
                    setIsLiked(true)
                    onLikeChange?.(true)
                    toast.success('Favorilere eklendi.')
                } else {
                    toast.error('Bir hata oluştu.')
                }
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setLoading(false)
        }
    }

    const renderSliderGallery = () => {
        return (
            <div className="relative w-full overflow-hidden rounded-2xl group/gallery">
                <GallerySlider ratioClass={ratioClass} galleryImgs={finalGalleryImgs} href={listingHref} />
                <BtnLikeIcon
                    isLiked={isLiked}
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 z-10 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300"
                />
            </div>
        )
    }

    const renderContent = () => {
        return (
            <div className={size === 'default' ? 'space-y-2.5 px-1 pt-4' : 'space-y-1 p-3'}>
                <div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{finalLocation}</span>
                        {category && <Badge color="blue">{category.name}</Badge>}
                    </div>

                    <div className="mt-1.5 flex items-center gap-x-2">
                        <h2 className={`text-base font-medium transition-colors group-hover:text-primary-600`}>
                            <span className="line-clamp-1">{title}</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {durationDays || 1} Gün
                    </span>
                    <span>•</span>
                    <span className="text-primary-600 font-medium italic">En İyi Fiyat</span>
                </div>

                <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{Number(finalPrice || 0).toLocaleString('tr-TR')} ₺</span>
                        <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 italic">/kişi</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`group relative bg-white dark:bg-neutral-900 rounded-3xl p-2 transition-all duration-300 hover:shadow-2xl hover:shadow-neutral-200 dark:hover:shadow-black/50 ${className}`}>
            {renderSliderGallery()}
            <Link href={listingHref}>{renderContent()}</Link>
        </div>
    )
}

export default TourCard
