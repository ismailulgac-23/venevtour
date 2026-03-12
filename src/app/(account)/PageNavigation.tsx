'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

export const PageNavigation = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const swiperRef = useRef<any>(null)

  if (!user) return null

  const commonNav = [
    { title: 'Hesabım', href: user.role === 'AGENT' ? '/account/agent' : user.role === 'ADMIN' ? '/account/admin' : '/account/customer' },
    { title: 'Profil Bilgilerim', href: user.role === 'AGENT' ? '/account/agent/profile' : user.role === 'ADMIN' ? '/account/admin/profile' : '/account/customer/profile' },
    { title: 'Şifre Değiştir', href: '/account-password' },
  ]

  const customerNav = [
    ...commonNav,
    { title: 'Rezervasyonlarım', href: '/account/customer/reservations' },
    { title: 'Favorilerim', href: '/account-savelists' },
    { title: 'Ödemelerim', href: '/account-billing' },
  ]

  const agentNav = [
    ...commonNav,
    { title: 'Turlarımı Yönet', href: '/account/agent/tours' },
    { title: 'Rezervasyonlar', href: '/account/agent/reservations' },
    { title: 'Komisyon Oranım', href: '/account/agent/commission' },
    { title: 'Kazanç Raporu', href: '/account/agent/revenue' },
    { title: 'Favorilerim', href: '/account-savelists' },
  ]

  const adminNav = [
    ...commonNav,
    { title: 'Tüm Turlar', href: '/account/admin/tours' },
    { title: 'Acenteler', href: '/account/admin/agents' },
    { title: 'Rezervasyonlar', href: '/account/admin/reservations' },
    { title: 'Kullanıcı Yönetimi', href: '/account/admin/users' },
    { title: 'Blog Yönetimi', href: '/account/admin/blog' },
    { title: 'SSS Yönetimi', href: '/account/admin/faqs' },
    { title: 'Kazanç Raporu', href: '/account/admin/revenue' },
    { title: 'Favorilerim', href: '/account-savelists' },
  ]

  const navigation = user.role === 'ADMIN' ? adminNav : user.role === 'AGENT' ? agentNav : customerNav

  return (
    <div className="container relative group">
      <div className="flex items-center">
        {/* Navigation Buttons */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 z-20 size-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 disabled:hidden"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <div className="w-full">
          <Swiper
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper
            }}
            slidesPerView="auto"
            spaceBetween={8}
            className="!py-4 md:!py-5"
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <SwiperSlide key={item.href + item.title} className="!w-auto">
                  <Link
                    href={item.href}
                    className={`block px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 whitespace-nowrap border ${
                      isActive 
                        ? 'bg-neutral-900 text-white shadow-xl shadow-neutral-200 dark:shadow-none border-neutral-900' 
                        : 'text-neutral-500 bg-white dark:bg-neutral-800 border-neutral-100 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-300'
                      }`}
                  >
                    {item.title}
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 z-20 size-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-full shadow-lg border border-neutral-100 dark:border-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 disabled:hidden"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>
    </div>
  )
}
