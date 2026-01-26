'use client'

import StartRating from '@/components/StartRating'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import { Divider } from '@/shared/divider'
import { HomeIcon } from '@heroicons/react/24/outline'
import { Calendar04Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('last_reservation')
    if (data) {
      setBooking(JSON.parse(data))
      // Optional: Clear after reading to prevent re-shows on refresh if desired, 
      // but usually better to keep for the session.
    } else {
      router.push('/')
    }

    document.documentElement.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }, [router])

  if (!booking) return null

  return (
    <main className="container mt-10 mb-24 sm:mt-16 lg:mb-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-y-12 px-0 sm:rounded-3xl sm:p-8 xl:p-10 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/[0.03] border border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-4xl animate-bounce">
            🎉
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">Tebrikler!</h1>
          <p className="text-neutral-500 font-medium max-w-md">Rezervasyon talebiniz başarıyla alındı. Mail adresinizi kontrol etmeyi unutmayın.</p>
        </div>

        <Divider className="opacity-50" />

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Rezervasyon Özeti</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-neutral-50 dark:bg-neutral-800/20 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
            <div className="w-full shrink-0 sm:w-48">
              <div className="aspect-w-4 aspect-h-3 relative overflow-hidden rounded-2xl shadow-sm">
                <Image
                  fill
                  alt=""
                  className="object-cover"
                  src={booking.featuredImage || "https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg"}
                  sizes="300px"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-3 justify-center">
              <div>
                <span className="text-xs font-bold text-primary-600">
                  {booking.location}
                </span>
                <span className="mt-1 block text-lg font-bold text-neutral-900 dark:text-neutral-100 italic={false}">
                  {booking.tourTitle}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StartRating />
                <span className="text-xs text-neutral-400 font-medium">(4.8 / 5)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-x-5 p-6 bg-neutral-50 dark:bg-neutral-800/20 rounded-3xl border border-neutral-100 dark:border-neutral-800">
            <div className="size-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400 shadow-sm">
              <HugeiconsIcon icon={Calendar04Icon} size={28} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 leading-none">Tarih</span>
              <span className="mt-2 text-base font-bold text-neutral-900 dark:text-neutral-100">
                {booking.startDate ? new Date(booking.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belirtilmedi'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-x-5 p-6 bg-neutral-50 dark:bg-neutral-800/20 rounded-3xl border border-neutral-100 dark:border-neutral-800">
            <div className="size-14 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-400 shadow-sm">
              <HugeiconsIcon icon={UserIcon} size={28} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 leading-none">Katılımcı</span>
              <span className="mt-2 text-base font-bold text-neutral-900 dark:text-neutral-100">{booking.passengerCount} Gezgin</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">İşlem Detayları</h3>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 p-0 border-none divide-y divide-neutral-100 dark:divide-neutral-800">
              <div className="flex justify-between p-5 items-center">
                <DescriptionTerm className="text-sm font-medium text-neutral-500">Rezervasyon Kodu</DescriptionTerm>
                <DescriptionDetails className="text-sm font-bold text-neutral-900 dark:text-neutral-100">#{booking.id?.split('-')[0].toUpperCase() || 'RES-12345'}</DescriptionDetails>
              </div>
              <div className="flex justify-between p-5 items-center">
                <DescriptionTerm className="text-sm font-medium text-neutral-500">Talep Tarihi</DescriptionTerm>
                <DescriptionDetails className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{new Date(booking.createdAt).toLocaleDateString('tr-TR')}</DescriptionDetails>
              </div>
              <div className="flex justify-between p-5 items-center bg-primary-50/5">
                <DescriptionTerm className="text-sm font-medium text-primary-600">Toplam Ödenen</DescriptionTerm>
                <DescriptionDetails className="text-lg font-bold text-primary-600">{Number(booking.totalPrice).toLocaleString('tr-TR')} ₺</DescriptionDetails>
              </div>
              <div className="flex justify-between p-5 items-center">
                <DescriptionTerm className="text-sm font-medium text-neutral-500">Ödeme Yöntemi</DescriptionTerm>
                <DescriptionDetails className="text-sm font-bold text-neutral-900 dark:text-neutral-100 italic={false}">Kredi Kartı</DescriptionDetails>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <ButtonPrimary href="/" className="flex-1 h-16 rounded-2xl bg-neutral-900 text-white font-bold tracking-tight">
            <HomeIcon className="size-5 mr-2" />
            Anasayfaya Dön
          </ButtonPrimary>
          <button
            onClick={() => window.print()}
            className="flex-1 h-16 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold tracking-tight hover:bg-neutral-50 transition-colors"
          >
            Yazdır / PDF Kaydet
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page
