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
import Pagination from '@/shared/Pagination'

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

    // Parse category[] which can be string or array
    const categoryQuery = params['category[]']
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
    let durationFilter: number | undefined
    if (checkin && checkout) {
        const start = new Date(checkin)
        const end = new Date(checkout)
        durationFilter = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    // WHERE Clause
    const where: any = { isActive: true }
    if (location) {
        where.location = { contains: location, mode: 'insensitive' }
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
    if (durationFilter && durationFilter > 0) {
        where.durationDays = { lte: durationFilter }
    }

    // Fetch Data
    const [tours, categories, totalCount] = await Promise.all([
        prisma.tour.findMany({
            where,
            include: { images: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 20
        }),
        prisma.category.findMany(),
        prisma.tour.count({ where })
    ])

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

    const heroImage = {
        src: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1260,
        height: 400
    }

    return (
        <div className="pb-28">
            <div className="relative container mt-14 lg:mt-24">
                {/* start heading */}
                <div className="flex flex-wrap items-end justify-between gap-x-2.5 gap-y-5">
                    <div>
                        <h2 id="heading" className="scroll-mt-20 text-2xl font-bold sm:text-3xl text-neutral-900 dark:text-neutral-100">
                            Popüler Turlar
                        </h2>
                        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                            {convertNumbThousand(totalCount)} adet uygun tur bulundu.
                        </p>
                    </div>
                </div>
                <Divider className="my-8 md:mb-12" />

                {/* Filters */}
                <ListingFilterTabs filterOptions={filterOptions} />

                {/* List */}
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
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
                        <div className="col-span-full py-32 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4 text-neutral-400">
                                <HugeiconsIcon icon={HotAirBalloonIcon} size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Tur Bulunamadı</h3>
                            <p className="text-neutral-500 max-w-sm mx-auto">
                                Aradığınız kriterlere uygun tur şu an bulunmuyor. Lütfen filtrelerinizi temizlemeyi veya farklı lokasyon aramayı deneyin.
                            </p>
                        </div>
                    )}
                </div>

                {tours.length > 0 && (
                    <div className="mt-16 flex items-center justify-center">
                        <Pagination />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
