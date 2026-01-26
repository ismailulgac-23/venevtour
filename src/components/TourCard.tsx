'use client'

import BtnLikeIcon from '@/components/BtnLikeIcon'
import GallerySlider from '@/components/GallerySlider'
import SaleOffBadge from '@/components/SaleOffBadge'
import StartRating from '@/components/StartRating'
import { Badge } from '@/shared/Badge'
import Link from 'next/link'
import { FC } from 'react'

interface Props {
    className?: string
    ratioClass?: string
    data: any // Can be typed to prisma Tour model
    size?: 'default' | 'small'
}

const TourCard: FC<Props> = ({
    size = 'default',
    className = '',
    data,
    ratioClass = 'aspect-w-3 aspect-h-3',
}) => {
    const {
        images,
        location,
        title,
        priceFrom,
        id,
        durationDays,
        category
    } = data

    const listingHref = `/tours/${id}`
    const galleryImgs = images?.map((img: any) => img.url) || []

    const renderSliderGallery = () => {
        return (
            <div className="relative w-full overflow-hidden rounded-2xl">
                <GallerySlider ratioClass={ratioClass} galleryImgs={galleryImgs} href={listingHref} />
                {/* <BtnLikeIcon className="absolute top-3 right-3" /> */}
            </div>
        )
    }

    const renderContent = () => {
        return (
            <div className={size === 'default' ? 'space-y-2.5 px-1 pt-4' : 'space-y-1 p-3'}>
                <div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{location}</span>
                        {category && <Badge color="blue">{category.name}</Badge>}
                    </div>

                    <div className="mt-1.5 flex items-center gap-x-2">
                        <h2 className={`text-base font-medium`}>
                            <span className="line-clamp-1">{title}</span>
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span>{durationDays} Gün</span>
                    <span>•</span>
                    <span>En İyi Fiyat</span>
                </div>

                <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <span className="text-base font-semibold">{Number(priceFrom).toLocaleString('tr-TR')} ₺</span>
                        {size === 'default' && (
                            <>
                                <span className="mx-1 text-xs font-light text-neutral-400 dark:text-neutral-500">/</span>
                                <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">kişi</span>
                            </>
                        )}
                    </div>
                    {/* <StartRating point={5} reviewCount={0} /> */}
                </div>
            </div>
        )
    }

    return (
        <div className={`group relative ${className}`}>
            {renderSliderGallery()}
            <Link href={listingHref}>{renderContent()}</Link>
        </div>
    )
}

export default TourCard
