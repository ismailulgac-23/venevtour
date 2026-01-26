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
        pendingAgents: 0
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

    const statCards = [
        { name: 'Toplam Tur', value: stats.totalTours, icon: MapIcon, color: 'text-blue-600 bg-blue-100' },
        { name: 'Toplam Acente', value: stats.totalAgents, icon: UserGroupIcon, color: 'text-purple-600 bg-purple-100' },
        { name: 'Toplam Rezervasyon', value: stats.totalReservations, icon: TicketIcon, color: 'text-green-600 bg-green-100' },
        { name: 'Onay Bekleyen Acente', value: stats.pendingAgents, icon: ChartBarIcon, color: 'text-orange-600 bg-orange-100' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-semibold">Admin Paneline Hoş Geldiniz</h2>
                <p className="text-neutral-500 mt-2">Platform genelindeki verileri ve kullanıcıları yönetin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon className="size-6" />
                            </div>
                            <div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{stat.name}</p>
                                <p className="text-2xl font-bold">{loading ? '...' : stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <a href="/account/admin/agents" className="p-4 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center">
                            Acenteleri Onayla
                        </a>
                        <a href="/account/admin/tours" className="p-4 border rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-center">
                            Turları Düzenle
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
