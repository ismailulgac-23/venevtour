import StartRating from '@/components/StartRating'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { ClockIcon, UsersIcon, LanguageIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Divider } from '@/shared/divider'
import { Table, TableBody, TableCell, TableRow } from '@/shared/table'
import HeaderGallery from '../../../(listings)/components/HeaderGallery'
import SectionHeader from '../../../(listings)/components/SectionHeader'
import { SectionHeading } from '../../../(listings)/components/SectionHeading'
import SectionHost from '../../../(listings)/components/SectionHost'
import SectionListingReviews from '../../../(listings)/components/SectionListingReviews'
import SectionMap from '../../../(listings)/components/SectionMap'
import ReservationForm from './ReservationForm'
import React from 'react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const tour = await prisma.tour.findUnique({ where: { id } })

  if (!tour) {
    return { title: 'Tur bulunamadı' }
  }

  return {
    title: tour.title,
    description: tour.description,
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const tour: any = await prisma.tour.findUnique({
    where: { id },
    include: {
      images: true,
      extras: true,
      category: true,
      roadmaps: { orderBy: { dayNumber: 'asc' } },
      agent: { include: { agentProfile: true } },
      reviews: {
        include: { user: { include: { customerProfile: true, agentProfile: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    },
  })

  if (!tour) return notFound()

  console.log("tour", JSON.stringify(tour, null, 2));


  // Calculate review stats
  const reviewCount = tour.reviews.length
  const reviewStart = reviewCount > 0
    ? tour.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount
    : 5.0

  // Serialize complex Prisma types (Decimal, Date)
  const serializedTour = {
    ...tour,
    priceFrom: Number(tour.priceFrom),
    createdAt: tour.createdAt.toISOString(),
    updatedAt: tour.updatedAt.toISOString(),
    tourStartDate: tour.tourStartDate ? tour.tourStartDate.toISOString() : null,
    tourEndDate: tour.tourEndDate ? tour.tourEndDate.toISOString() : null,
    extras: tour.extras.map((extra: any) => ({
      ...extra,
      price: Number(extra.price),
    })),
    roadmaps: tour.roadmaps.map((rm: any) => ({
      ...rm,
      createdAt: rm.createdAt.toISOString(),
      updatedAt: rm.updatedAt.toISOString(),
    })),
    reviews: tour.reviews.map((r: any) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      user: {
        ...r.user,
        createdAt: r.user.createdAt.toISOString(),
        updatedAt: r.user.updatedAt.toISOString(),
      }
    }))
  }

  // Calculate agent stats
  const agentToursCount = await prisma.tour.count({ where: { agentId: tour.agentId } })
  const agentReviews = await prisma.review.findMany({
    where: { tour: { agentId: tour.agentId } }
  })
  const agentReviewsCount = agentReviews.length
  const agentRating = agentReviewsCount > 0
    ? agentReviews.reduce((acc, r) => acc + r.rating, 0) / agentReviewsCount
    : 5.0

  // Mapping Host data to expected format
  const host = {
    displayName: tour.agent.agentProfile?.companyName || 'Acente',
    avatarUrl: tour.agent.agentProfile?.avatarUrl || `https://i.pravatar.cc/150?u=${tour.agentId}`,
    description: tour.agent.agentProfile?.bio || 'Güvenilir tur acentesi.',
    handle: tour.agent.id,
    rating: agentRating,
    reviewsCount: agentReviewsCount,
    listingsCount: agentToursCount,
    joinedDate: new Date(tour.agent.createdAt).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    responseRate: 100,
    responseTime: '1 saat içinde',
    tursabNumber: tour.agent.agentProfile?.tursabNumber || 'Belirtilmedi',
    contactEmail: tour.agent.agentProfile?.contactEmail,
    contactPhone: tour.agent.agentProfile?.contactPhone,
    address: tour.agent.agentProfile?.address
  }

  const renderSectionHeader = () => {
    return (
      <SectionHeader
        address={serializedTour.location}
        host={host}
        listingCategory={serializedTour.category?.name || 'Tur'}
        reviewCount={reviewCount}
        reviewStart={reviewStart}
        title={serializedTour.title}
      >
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <ClockIcon className="h-6 w-6" />
          <span>{serializedTour.durationDays} Gün</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <UsersIcon className="h-6 w-6" />
          <span>Maks. {serializedTour.maxCapacity || 50} Kişi</span>
        </div>
        <div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-y-0 sm:gap-x-3 sm:text-start">
          <LanguageIcon className="h-6 w-6" />
          <span>{serializedTour.languages.join(', ')}</span>
        </div>
      </SectionHeader>
    )
  }

  const renderSectionInfo = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>Tur Programı</SectionHeading>
        <Divider className="w-14!" />

        <Table>
          <TableBody>
            {serializedTour.roadmaps.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-semibold align-top whitespace-nowrap">{item.dayNumber}. Gün</TableCell>
                <TableCell>
                  <div className="max-w-lg leading-relaxed sm:text-pretty">
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-2.5 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  const renderSectionIncludes = () => {
    return (
      <div className="listingSection__wrap">
        <SectionHeading>Fiyata Dahil Olanlar</SectionHeading>
        <Divider className="w-14!" />

        <div className="grid grid-cols-1 gap-6 text-sm text-neutral-700 lg:grid-cols-2 dark:text-neutral-300">
          {serializedTour.includes.map((item: string) => (
            <div key={item} className="flex items-center gap-x-3">
              <CheckCircleIcon className="mt-px h-6 w-6 shrink-0 text-primary-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 lg:py-12">
      {/*  HEADER GALLERY */}
      <HeaderGallery gridType="grid4" images={serializedTour.images.map((img: any) => img.url)} />

      {/* MAIN */}
      <main className="relative z-[1] mt-10 flex flex-col gap-8 lg:flex-row xl:gap-10">
        {/* CONTENT */}
        <div className="flex w-full flex-col gap-y-8 lg:w-3/5 xl:w-[64%] xl:gap-y-10">
          {renderSectionHeader()}

          <div className="listingSection__wrap">
            <SectionHeading>Tur Açıklaması</SectionHeading>
            <Divider className="w-14!" />
            <p className="text-neutral-600 dark:text-neutral-400 leading-loose">
              {serializedTour.description}
            </p>
          </div>

          {renderSectionInfo()}
          {renderSectionIncludes()}

          {/* Calendar Placeholder or SectionDateRange if you have it */}
          <div className="listingSection__wrap">
            <SectionHeading>Müsait Tarihler</SectionHeading>
            <Divider className="w-14!" />
            <p className="text-sm text-neutral-500">Tur tarihlerini yan panelden seçerek rezervasyon yapabilirsiniz.</p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="sticky top-24">
          <ReservationForm
            tour={serializedTour}
            reviewStart={reviewStart}
            reviewCount={reviewCount}
          />
        </div>
      </main>

      <Divider className="my-16" />

      <div className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="w-full lg:w-4/9 xl:w-1/3">
            <SectionHost {...host} />
          </div>
          <div className="w-full lg:w-2/3">
            <SectionListingReviews
              tourId={serializedTour.id}
              reviewCount={reviewCount}
              reviewStart={reviewStart}
              reviews={serializedTour.reviews.map((r: any) => ({
                id: r.id,
                author: r.user.customerProfile ? `${r.user.customerProfile?.firstName} ${r.user.customerProfile?.lastName?.charAt(0)}.` : r.user.agentProfile?.companyName,
                date: new Date(r.createdAt).toLocaleDateString('tr-TR'),
                datetime: r.createdAt,
                content: r.comment,
                rating: r.rating,
                authorAvatar: r.user.customerProfile?.avatarUrl || `https://i.pravatar.cc/150?u=${r.userId}`,
                title: ""
              }))}
            />
          </div>
        </div>

        <SectionMap
          address={serializedTour.location}
          map={{
            lat: serializedTour.lat || 41.0082,
            lng: serializedTour.lng || 28.9784
          }}
        />
      </div>
    </div>
  )
}

export default Page
