'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { IdentificationIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline'

const CustomerDashboard = () => {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="size-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-medium tracking-tight">Profil bilgileriniz yükleniyor...</p>
        </div>
    )

    if (!user) return null

    const profile = user.customerProfile

    return (
        <div className="space-y-10">
            {/* HEADER */}
            <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Hesabım</h2>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400 font-medium">Profil bilgilerinizi ve hesap detaylarınızı buradan görüntüleyebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* LEFT CARD: AVATAR & BASIC INFO */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 p-8 shadow-sm flex flex-col items-center text-center">
                        <div className="relative size-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-xl ring-1 ring-neutral-100 dark:ring-neutral-700">
                            <Image
                                fill
                                src={user.avatarUrl || "https://images.pexels.com/photos/1450114/pexels-photo-1450114.jpeg"}
                                alt="Profil"
                                className="object-cover"
                            />
                        </div>
                        <h3 className="mt-6 text-xl font-bold text-neutral-900 dark:text-white">
                            {profile?.firstName} {profile?.lastName || 'Gezgin'}
                        </h3>
                        <p className="text-sm text-neutral-500 font-medium">Müşteri Hesabı</p>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                {user.status === 'ACTIVE' ? 'Aktif Hesap' : user.status}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold border border-primary-100">
                                Doğrulanmış
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD: DETAILED INFO */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 p-10 shadow-sm space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* AD SOYAD */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <IdentificationIcon className="size-5" />
                                    <span className="text-xs font-bold">Ad Soyad</span>
                                </div>
                                <p className="text-lg font-bold text-neutral-900 dark:text-white pl-7">
                                    {profile?.firstName} {profile?.lastName}
                                </p>
                            </div>

                            {/* E-POSTA */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <EnvelopeIcon className="size-5" />
                                    <span className="text-xs font-bold">E-Posta Adresi</span>
                                </div>
                                <p className="text-lg font-bold text-neutral-900 dark:text-white pl-7">
                                    {user.email}
                                </p>
                            </div>

                            {/* TELEFON */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <PhoneIcon className="size-5" />
                                    <span className="text-xs font-bold">Telefon Numarası</span>
                                </div>
                                <p className="text-lg font-bold text-neutral-900 dark:text-white pl-7">
                                    {profile?.phone || '-'}
                                </p>
                            </div>

                            {/* ROL / YETKİ */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <ShieldCheckIcon className="size-5" />
                                    <span className="text-xs font-bold">Hesap Türü</span>
                                </div>
                                <p className="text-lg font-bold text-neutral-900 dark:text-white pl-7">
                                    Standart Müşteri
                                </p>
                            </div>
                        </div>

                        {/* BOTTOM INFO */}
                        <div className="pt-10 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-6">
                            <div className="flex items-center gap-2 text-neutral-400">
                                <CalendarIcon className="size-5" />
                                <span className="text-xs font-medium">Katılım Tarihi: </span>
                                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Ocak 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerDashboard
