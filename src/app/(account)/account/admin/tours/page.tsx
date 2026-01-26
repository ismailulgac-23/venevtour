'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

const AdminToursPage = () => {
    const [tours, setTours] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTours = async () => {
        try {
            const res = await fetch('/api/admin/tours')
            if (res.ok) {
                const json = await res.json()
                setTours(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTours()
    }, [])

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/admin/tours/${id}/toggle`, { method: 'POST' })
            if (res.ok) {
                toast.success('Tur durumu güncellendi.')
                fetchTours()
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const deleteTour = async (id: string) => {
        if (!confirm('Bu turu silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Tur silindi.')
                fetchTours()
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">Tüm Turlar</h2>
                <div className="text-sm text-neutral-500">{tours.length} tur listeleniyor</div>
            </div>

            {loading ? (
                <div>Yükleniyor...</div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Tur Başlığı</th>
                                    <th className="px-6 py-4 font-semibold">Acente</th>
                                    <th className="px-6 py-4 font-semibold">Fiyat</th>
                                    <th className="px-6 py-4 font-semibold">Durum</th>
                                    <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {tours.map((tour) => (
                                    <tr key={tour.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white truncate max-w-[200px]">{tour.title}</div>
                                            <div className="text-neutral-500 text-xs">{tour.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {tour.agent?.agentProfile?.companyName || 'Bilinmiyor'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{Number(tour.priceFrom).toLocaleString('tr-TR')} ₺</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tour.isActive ? 'Yayında' : 'Yayında Değil'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => toggleStatus(tour.id, tour.isActive)}
                                                className="text-primary-600 hover:underline"
                                            >
                                                {tour.isActive ? 'Durdur' : 'Yayınla'}
                                            </button>
                                            <button
                                                onClick={() => deleteTour(tour.id)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminToursPage
