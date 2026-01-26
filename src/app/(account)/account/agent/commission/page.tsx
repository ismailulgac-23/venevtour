'use client'

import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { BanknotesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const CommissionPage = () => {
    const { user } = useAuth()
    const agentProfile = user?.agentProfile

    if (!user || user.role !== 'AGENT') return null

    const commissionType = agentProfile?.commissionType || 'PERCENTAGE'
    const commissionAmount = Number(agentProfile?.commissionAmount || 0)

    return (
        <div className="max-w-2xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Komisyon Oranım</h2>
                <p className="text-neutral-500 mt-2 text-lg">Platform üzerindeki satışlarınızdan alınan komisyon bilgileri.</p>
            </div>

            <div className="relative overflow-hidden bg-neutral-900 rounded-[40px] p-8 md:p-12 shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 size-64 bg-primary-600/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 size-64 bg-violet-600/20 rounded-full blur-[80px]" />

                <div className="relative flex flex-col items-center justify-center space-y-6">
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20">
                        <BanknotesIcon className="size-10 text-white" />
                    </div>

                    <div className="text-center">
                        <span className="text-neutral-400 text-sm font-bold uppercase tracking-[0.2em]">Aktif Komisyon Oranı</span>
                        <div className="mt-2 flex items-baseline justify-center gap-2">
                            <span className="text-7xl font-bold text-white tracking-tighter">
                                {commissionType === 'PERCENTAGE' ? `%${commissionAmount}` : `${commissionAmount.toLocaleString('tr-TR')} ₺`}
                            </span>
                        </div>
                        <p className="mt-4 text-neutral-400 font-medium">
                            {commissionType === 'PERCENTAGE'
                                ? 'Satış tutarı üzerinden yüzdelik kesinti uygulanır.'
                                : 'Her rezervasyon başına sabit tutar kesintisi uygulanır.'
                            }
                        </p>
                    </div>

                    <div className="pt-8 w-full border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                            <span className="text-white font-bold text-sm tracking-wide uppercase">Hesap Durumu: Aktif</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-neutral-300 text-xs font-bold">
                            Son Güncelleme: {new Date(agentProfile?.updatedAt || Date.now()).toLocaleDateString('tr-TR')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 rounded-3xl p-6 flex gap-4">
                <InformationCircleIcon className="size-6 text-primary-600 shrink-0" />
                <div className="space-y-1">
                    <h4 className="font-bold text-primary-900 dark:text-primary-100 italic">Bilgilendirme</h4>
                    <p className="text-sm text-primary-800/80 dark:text-primary-400/80 leading-relaxed font-medium">
                        Komisyon oranlarınız anlaşmanıza bağlı olarak belirlenmektedir. Oranınızda bir yanlışlık olduğunu düşünüyorsanız veya güncelleme talep ediyorsanız lütfen <span className="underline font-bold cursor-pointer">destek ekibi</span> ile iletişime geçiniz.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CommissionPage
