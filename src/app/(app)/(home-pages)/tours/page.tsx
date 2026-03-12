import React from 'react'
import { prisma } from '@/lib/prisma'
import TourCard from '@/components/TourCard'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import { ToursSearchForm } from '@/components/HeroSearchForm/ToursSearchForm'
import ListingFilterTabs from '@/components/ListingFilterTabs'
import { Divider } from '@/shared/divider'
import { Metadata } from 'next'
import { MapPinpoint02Icon, HotAirBalloonIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import convertNumbThousand from '@/utils/convertNumbThousand'
import Link from 'next/link'
import { SmoothScrollToResults } from '@/components/SmoothScrollToResults'
import { ListingPagination } from '@/components/ListingPagination'

export const metadata: Metadata = {
    title: 'Turlar - En İyi Deneyimler ve Maceralar',
    description: 'Türkiye\'nin en popüler turlarını keşfedin ve online rezervasyon yapın.',
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>
}

const Page = async ({ searchParams }: PageProps) => {
    const params = await searchParams
    const location = params.location

    // Parse category which can be string or array (supports both category and category[])
    const categoryQuery = params['category[]'] || params['category']
    const selectedCategories = Array.isArray(categoryQuery)
        ? categoryQuery
        : categoryQuery
            ? [categoryQuery]
            : []

    const minPrice = params.minPrice ? Number(params.minPrice) : undefined
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined
    const totalGuests = (Number(params.adults) || 0) + (Number(params.children) || 0)

    const checkin = params.checkin
    const checkout = params.checkout

    // Pagination
    const page = Number(params.page) || 1
    const pageSize = 12
    const skip = (page - 1) * pageSize

    // WHERE Clause
    const where: any = { isActive: true }

    // Search both location and title if search term is provided
    if (location) {
        where.OR = [
            { location: { contains: location, mode: 'insensitive' } },
            { title: { contains: location, mode: 'insensitive' } }
        ]
    }

    if (selectedCategories.length > 0) {
        where.category = { slug: { in: selectedCategories } }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        where.priceFrom = {}
        if (minPrice !== undefined) where.priceFrom.gte = minPrice
        if (maxPrice !== undefined) where.priceFrom.lte = maxPrice
    }

    if (totalGuests > 0) {
        where.maxCapacity = { gte: totalGuests }
    }

    // Fetch Data
    const [tours, categories, totalCount] = await Promise.all([
        prisma.tour.findMany({
            where,
            include: { images: true, category: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize
        }),
        prisma.category.findMany(),
        prisma.tour.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / pageSize)

    // Filter Options for UI
    const filterOptions: any = [
        {
            name: 'category',
            label: 'Kategoriler',
            tabUIType: 'checkbox',
            options: categories.map(cat => ({
                name: cat.name,
                value: cat.slug,
                defaultChecked: selectedCategories.includes(cat.slug)
            }))
        },
        {
            label: 'Fiyat Aralığı',
            name: 'price',
            tabUIType: 'price-range',
            min: 0,
            max: 50000,
        }
    ]

    return (
        <div className="pb-28">
            <SmoothScrollToResults />
            <div className="bg-neutral-100/50 dark:bg-neutral-800/20 py-8 lg:py-12 mb-12 border-b border-neutral-200/50 dark:border-neutral-700/50 relative z-20">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary-500 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="container relative z-10">
                    {/* Quick Search Area */}
                    <div className="w-full max-w-screen-xl">
                        <ToursSearchForm formStyle="default" />
                    </div>
                </div>
            </div>

            <div className="relative container">
                {/* Filters and Heading integrated */}
                <ListingFilterTabs 
                    filterOptions={filterOptions} 
                    heading={
                        <div>
                            <h2 id="heading" className="scroll-mt-20 text-2xl font-bold sm:text-3xl text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                                Arama Sonuçları
                                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm rounded-full font-bold">
                                    {convertNumbThousand(totalCount)} Tur
                                </span>
                            </h2>
                            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                                Kriterlerinize uygun en iyi rotaları listeliyoruz.
                            </p>
                        </div>
                    }
                />

                {/* List */}
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
                    {tours.map((tour) => {
                        const serializedTour = {
                            ...tour,
                            priceFrom: Number(tour.priceFrom),
                            createdAt: tour.createdAt.toISOString(),
                            updatedAt: tour.updatedAt.toISOString(),
                        }
                        return <TourCard key={serializedTour.id} data={serializedTour} />
                    })}
                    {tours.length === 0 && (
                        <div className="col-span-full py-32 text-center bg-neutral-50 dark:bg-neutral-800/30 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-6 text-neutral-400">
                                <HugeiconsIcon icon={HotAirBalloonIcon} size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-3">Aranan Tur Bulunamadı</h3>
                            <p className="text-neutral-500 max-w-sm mx-auto mb-10 leading-relaxed italic">
                                "{location}" için kriterlerinize uygun aktif bir tur şu an bulunmuyor. Farklı bölgeleri aramayı deneyebilirsiniz.
                            </p>
                            <Link
                                href="/tours"
                                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-primary-600 text-white font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 dark:shadow-none hover:scale-105"
                            >
                                Tüm Filtreleri Temizle
                            </Link>
                        </div>
                    )}
                </div>

                {tours.length > 0 && (
                    <div className="mt-16 flex items-center justify-center">
                        <ListingPagination totalPages={totalPages} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
