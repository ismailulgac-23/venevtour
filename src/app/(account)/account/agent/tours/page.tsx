'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const ManageToursPage = () => {
    const { user } = useAuth()
    const [tours, setTours] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchMyTours = async () => {
        if (!user) return
        try {
            const toursRes = await fetch(`/api/tours?agentId=${user.id}`)
            if (toursRes.ok) {
                const json = await toursRes.json()
                setTours(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyTours()
    }, [user])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`"${title}" turunu silmek istediğinize emin misiniz?`)) return
        try {
            const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Tur başarıyla silindi.')
                fetchMyTours()
            } else {
                const err = await res.json()
                toast.error(err.message || 'Silme işlemi başarısız.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        }
    }

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Turlarımı Yönet</h2>
                    <p className="text-neutral-500 mt-2">Tüm tur ilanlarınızı listeleyin, düzenleyin veya silin.</p>
                </div>
                <Link
                    href="/account/agent/create-tour"
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl transition-all font-bold hover:bg-neutral-800"
                >
                    <PlusIcon className="size-5" />
                    Yeni Tur Ekle
                </Link>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                    <p className="text-neutral-500 text-lg font-medium">Henüz hiç tur eklemediniz.</p>
                    <Link href="/account/agent/create-tour" className="text-primary-600 font-bold hover:underline mt-2 inline-block">İlk turunu hemen ekle →</Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm rounded-[32px] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Tur Bilgisi</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Konum / Süre</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Fiyat</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tours.map((tour) => (
                                    <tr key={tour.id} className="border-b border-neutral-50 dark:border-neutral-700 last:border-0 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/30 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-16 rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
                                                    {tour.images[0] ? (
                                                        <img src={tour.images[0].url} alt="" className="size-full object-cover" />
                                                    ) : (
                                                        <div className="size-full flex items-center justify-center text-[10px] font-bold text-neutral-400 uppercase">Resim Yok</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-neutral-900 dark:text-white line-clamp-1">{tour.title}</span>
                                                    <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-tight mt-0.5">ID: {tour.id.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-neutral-700 dark:text-neutral-300 font-medium">{tour.location}</span>
                                                <span className="text-neutral-400 text-xs">{tour.durationDays} Gün</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-primary-600 font-mono">{Number(tour.priceFrom).toLocaleString('tr-TR')} ₺</span>
                                        </td>
                                        <td className="px-6 py-5 text-xs">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full font-bold uppercase tracking-tighter",
                                                tour.isActive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                                            )}>
                                                {tour.isActive ? "Aktif" : "Pasif"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/tours/${tour.id}`}
                                                    className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                                                    title="Görüntüle"
                                                >
                                                    <EyeIcon className="size-5" />
                                                </Link>
                                                <Link
                                                    href={`/account/agent/edit-tour/${tour.id}`}
                                                    className="p-2 text-neutral-400 hover:text-blue-600 transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <PencilSquareIcon className="size-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(tour.id, tour.title)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                                                    title="Sil"
                                                >
                                                    <TrashIcon className="size-5" />
                                                </button>
                                            </div>
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

export default ManageToursPage
