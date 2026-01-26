'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import Link from 'next/link'
import clsx from 'clsx'
import { TrashIcon } from '@heroicons/react/24/outline'

import {
    TicketIcon,
    CurrencyDollarIcon,
    BriefcaseIcon,
    CheckCircleIcon,
    PlusIcon,
    ArrowUpRightIcon,
    ChartBarIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline'

const AgentDashboard = () => {
    const { user } = useAuth()
    const [tours, setTours] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    })

    const fetchDashboardData = async (filter?: { start: string, end: string }) => {
        if (!user) return
        try {
            const statsUrl = filter?.start && filter.end
                ? `/api/agent/dashboard/stats?startDate=${filter.start}&endDate=${filter.end}`
                : '/api/agent/dashboard/stats'

            const [toursRes, statsRes] = await Promise.all([
                fetch(`/api/tours?agentId=${user.id}`),
                fetch(statsUrl)
            ])

            if (toursRes.ok) {
                const json = await toursRes.json()
                setTours(json.data)
            }

            if (statsRes.ok) {
                const json = await statsRes.json()
                setStats(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [user])

    const handleFilterChange = (start: string, end: string) => {
        setDateRange({ start, end })
        fetchDashboardData({ start, end })
    }

    const setQuickFilter = (days: number) => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - days)
        handleFilterChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0])
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu turu silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Tur başarıyla silindi.')
                fetchDashboardData()
            } else {
                const err = await res.json()
                toast.error(err.message || 'Silme işlemi başarısız.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        }
    }

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className={clsx("p-2.5 rounded-2xl", color)}>
                    <Icon className="size-5 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center text-green-600 text-[10px] font-bold bg-green-50 px-2 py-0.5 rounded-lg">
                        <ArrowUpRightIcon className="size-3 mr-1" />
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-3">
                <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{title}</h3>
                <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-white tracking-tight">
                    {value}
                </p>
            </div>
        </div>
    )

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-sm">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tighter uppercase">Acente Özeti</h2>
                    <p className="text-neutral-500 font-medium text-xs">İşletmenizin genel durumu ve hızlı aksiyonlar.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                        {[
                            { label: 'Bugün', days: 0 },
                            { label: '7G', days: 7 },
                            { label: '30G', days: 30 }
                        ].map((q) => (
                            <button
                                key={q.label}
                                onClick={() => setQuickFilter(q.days)}
                                className="px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-all active:scale-95"
                            >
                                {q.label}
                            </button>
                        ))}
                    </div>
                    <Link
                        href="/account/agent/create-tour"
                        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl transition-all shadow-xl shadow-black/10 font-bold group text-[10px] uppercase tracking-widest active:scale-95"
                    >
                        <PlusIcon className="size-3.5 group-hover:rotate-90 transition-transform" />
                        Yeni Tur
                    </Link>
                </div>
            </div>

            {/* Analysis Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Toplam Tur"
                    value={stats?.totalTours || 0}
                    icon={BriefcaseIcon}
                    color="bg-blue-600"
                    trend="%12"
                />
                <StatCard
                    title="Aktif İlan"
                    value={stats?.activeTours || 0}
                    icon={CheckCircleIcon}
                    color="bg-emerald-600"
                />
                <StatCard
                    title="Rezervasyon"
                    value={stats?.totalReservations || 0}
                    icon={TicketIcon}
                    color="bg-orange-600"
                    trend="%5"
                />
                <StatCard
                    title="Toplam Gelir"
                    value={`${Number(stats?.totalRevenue || 0).toLocaleString('tr-TR')} ₺`}
                    icon={CurrencyDollarIcon}
                    color="bg-violet-600"
                />
            </div>

            {/* Micro Listings Section */}
            <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[40px] p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-6000">
                            <ChartBarIcon className="size-6" />
                        </div>
                        <h3 className="text-2xl font-bold">Tur İlanlarım</h3>
                    </div>
                    <Link
                        href="/account/agent/tours"
                        className="text-sm font-bold text-primary-6000 hover:underline flex items-center gap-1"
                    >
                        Tümünü Yönet <ArrowUpRightIcon className="size-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-14 bg-neutral-50 dark:bg-neutral-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : tours.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-neutral-500 font-medium">Henüz bir ilanınız yok.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tours.slice(0, 5).map((tour) => (
                            <div key={tour.id} className="group flex items-center justify-between p-4 bg-neutral-50/50 dark:bg-neutral-800/50 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600 hover:bg-white dark:hover:bg-neutral-800 rounded-2xl transition-all duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0">
                                        {tour.images && tour.images[0] ? (
                                            <img src={tour.images[0].url} alt="" className="size-full object-cover" />
                                        ) : (
                                            <div className="size-full flex items-center justify-center text-[8px] font-bold text-neutral-400">NO IMG</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-900 dark:text-white line-clamp-1">{tour.title}</span>
                                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{tour.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="hidden sm:block font-bold text-neutral-900 dark:text-white font-mono">{Number(tour.priceFrom).toLocaleString('tr-TR')} ₺</span>
                                    <div className={clsx(
                                        "size-2.5 rounded-full",
                                        tour.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500"
                                    )} title={tour.isActive ? "Online" : "Offline"} />
                                    <Link
                                        href={`/account/agent/edit-tour/${tour.id}`}
                                        className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                                    >
                                        <PencilSquareIcon className="size-5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AgentDashboard
