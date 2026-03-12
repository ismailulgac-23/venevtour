'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { MapIcon, UserGroupIcon, TicketIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const AdminDashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalTours: 0,
        totalAgents: 0,
        totalReservations: 0,
        pendingAgents: 0,
        totalRevenue: 0,
        adminEarnings: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                if (res.ok) {
                    const json = await res.json()
                    setStats(json.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const financialStats = [
        { name: 'Toplam Ciro', value: `${stats.totalRevenue.toLocaleString('tr-TR')} ₺`, sub: 'Brüt Satış Tutarı', color: 'bg-neutral-900 text-white' },
        { name: 'Hesaplanan Kazanç', value: `${stats.adminEarnings.toLocaleString('tr-TR')} ₺`, sub: 'Tahmini Komisyon Geliri', color: 'bg-white border-2 border-neutral-900 text-neutral-900' },
    ]

    const platformStats = [
        { name: 'Turlar', value: stats.totalTours, icon: MapIcon, color: 'text-blue-600 bg-blue-50' },
        { name: 'Acenteler', value: stats.totalAgents, icon: UserGroupIcon, color: 'text-purple-600 bg-purple-50' },
        { name: 'Rezervasyonlar', value: stats.totalReservations, icon: TicketIcon, color: 'text-green-600 bg-green-50' },
        { name: 'Onay Bekleyen', value: stats.pendingAgents, icon: ChartBarIcon, color: 'text-orange-600 bg-orange-50' },
    ]

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase leading-none">
                        Panora <span className="text-neutral-400">Admin</span>
                    </h1>
                    <p className="text-lg text-neutral-500 font-medium mt-3">Platform genelindeki finansal akışı ve operasyonları yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-5 py-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-2">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Sistem Aktif</span>
                    </div>
                </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {financialStats.map((stat, i) => (
                    <div key={i} className={`p-10 rounded-[40px] shadow-2xl space-y-4 transition-transform hover:scale-[1.01] ${stat.color}`}>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">{stat.name}</div>
                        <div className="text-5xl font-black tabular-nums">{loading ? '...' : stat.value}</div>
                        <div className="text-xs font-semibold opacity-50 uppercase tracking-widest">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {platformStats.map((stat) => (
                    <div key={stat.name} className="bg-white dark:bg-neutral-800 p-8 rounded-[32px] border border-neutral-100 dark:border-neutral-700 transition-all hover:bg-neutral-50 group">
                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 mb-6 ${stat.color}`}>
                            <stat.icon className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{stat.name}</p>
                            <p className="text-3xl font-black text-neutral-900 dark:text-white">{loading ? '...' : stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Management */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-10 rounded-[40px] border border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold uppercase tracking-tight italic">Operasyon Merkezi</h3>
                        <p className="text-sm text-neutral-500 font-medium">Bekleyen işlemlere hızlıca müdahale edin ve sistemi güncel tutun.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { label: 'Acente Onayları', href: '/account/admin/agents', count: stats.pendingAgents },
                            { label: 'Rezervasyonlar', href: '/account/admin/reservations', count: stats.totalReservations },
                            { label: 'Tur Yönetimi', href: '/account/admin/tours', count: stats.totalTours },
                        ].map((btn, i) => (
                            <a 
                                key={i} 
                                href={btn.href} 
                                className="px-8 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-neutral-900 hover:text-white transition-all shadow-sm flex items-center gap-3 active:scale-95"
                            >
                                {btn.label}
                                {btn.count > 0 && <span className="size-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] animate-bounce">{btn.count}</span>}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
