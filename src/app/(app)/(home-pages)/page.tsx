import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import HeroSectionWithSearchForm1 from '@/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from '@/components/HeroSearchForm/HeroSearchForm'
import { ToursSearchForm } from '@/components/HeroSearchForm/ToursSearchForm'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import SectionHowItWork from '@/components/SectionHowItWork'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import heroImage from '@/images/hero-right.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import HeadingWithSub from '@/shared/Heading'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { verifyJWT } from '@/lib/auth-utils'
import { HotAirBalloonIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export const metadata: Metadata = {
  title: 'Anasayfa - Tur Rezervasyon',
  description: 'En iyi turları keşfedin ve rezervasyon yapın.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

async function Page({ searchParams }: PageProps) {
  const params = await searchParams

  // Parse dynamic filters
  const categoryQuery = params['category[]']
  const selectedCategories = Array.isArray(categoryQuery)
    ? categoryQuery
    : categoryQuery
      ? [categoryQuery]
      : []

  const minPrice = params.minPrice ? Number(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined

  // Build WHERE clause
  const where: any = { isActive: true }
  if (selectedCategories.length > 0) {
    where.category = { slug: { in: selectedCategories } }
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceFrom = {}
    if (minPrice !== undefined) where.priceFrom.gte = minPrice
    if (maxPrice !== undefined) where.priceFrom.lte = maxPrice
  }

  // Veritabanından turları ve kategorileri çek
  const [tours, categories] = await Promise.all([
    prisma.tour.findMany({
      where,
      take: 8,
      include: {
        images: true,
        agent: true,
        category: true
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany()
  ])

  // Filter Options for UI
  const filterOptions = [
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

  // Auth kontrolü ve favorileri çek
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  let userFavorites: string[] = []

  if (token) {
    const payload = await verifyJWT(token)
    if (payload && payload.userId) {
      const favorites = await prisma.favorite.findMany({
        where: { userId: payload.userId as string },
        select: { tourId: true }
      })
      userFavorites = favorites.map(f => f.tourId)
    }
  }

  // UI formatına dönüştür
  const stayListings: any[] = tours.map((tour) => ({
    id: tour.id,
    date: tour.createdAt.toISOString(),
    listingCategory: 'Tur',
    title: tour.title,
    handle: tour.id,
    description: tour.description,
    featuredImage:
      tour.images[0]?.url ||
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
    galleryImgs: tour.images.map((img) => img.url),
    like: userFavorites.includes(tour.id),
    address: tour.location,
    reviewStart: 5.0,
    reviewCount: 0,
    price: `${Number(tour.priceFrom)} ₺`,
    maxGuests: tour.maxCapacity || 10,
    durationDays: tour.durationDays,
    category: tour.category,
    bedrooms: 0,
    bathrooms: 0,
    beds: 0,
    saleOff: null,
    isAds: null,
    map: { lat: 41.0082, lng: 28.9784 },
    href: `/tours/${tour.id}`,
  }))

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <Suspense fallback={<div className="h-20" />}>
          <HeroSectionWithSearchForm1
            heading="Hayalindeki Turu Keşfet"
            image={heroImage}
            imageAlt="Tur Rezervasyon"
            searchForm={<ToursSearchForm formStyle="default" />}
            description={
              <div className="space-y-4">
                <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400 font-medium leading-relaxed">
                  Eşsiz deneyimler ve unutulmaz anılar için en popüler rotaları keşfedin. Türkiye'nin her köşesine özel turlar sizi bekliyor.
                </p>
                <ButtonPrimary href={'/tours'} className="sm:text-base/normal px-8 py-4 shadow-xl">
                  Turları İncele
                </ButtonPrimary>
              </div>
            }
          />
        </Suspense>

        <div>
          <HeadingWithSub subheading="En yeni ve en popüler turlarımızı inceleyin">
            Son Eklenen Turlar
          </HeadingWithSub>
          {tours.length > 0 ? (
            <SectionGridFeaturePlaces
              stayListings={stayListings}
              cardType="card2"
              heading=""
              subHeading=""
              filterOptions={filterOptions}
            />
          ) : (
            <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-col items-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                  <HugeiconsIcon icon={HotAirBalloonIcon} size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Tur Bulunamadı</h3>
                <p className="text-neutral-500 mb-8 leading-relaxed">Seçtiğiniz filtrelere uygun tur bulunamadı. Lütfen filtrelerinizi temizleyerek tekrar deneyin.</p>
                <Link 
                  href="/" 
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 dark:shadow-none"
                >
                  Filtreleri Temizle
                </Link>
              </div>
            </div>
          )}
        </div>

        <Divider />
        <SectionHowItWork />

        <div className="relative py-24 lg:py-32">
          <BackgroundSection />
          <div className="text-center max-w-2xl mx-auto relative z-10 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">Kendi Turlarınızı Düzenleyin</h2>
            <p className="text-neutral-500 mb-10 text-lg leading-relaxed dark:text-neutral-400">
              Türkiye'nin en hızlı büyüyen tur rezervasyon platformunda acente olarak yerinizi alın. Binlerce gezgine ulaşın ve işinizi büyütün.
            </p>
            <ButtonPrimary href="/become-an-agent" className="px-10 py-4 shadow-2xl">Acente Başvurusu Yap</ButtonPrimary>
          </div>
        </div>

        <SectionSubscribe2 />
      </div>
    </main>
  )
}

export default Page
