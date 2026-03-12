"use client";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { TicketIcon, PhotoIcon } from '@heroicons/react/24/outline'

const AdminToursPage = () => {
    const [tours, setTours] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [priceFilter, setPriceFilter] = useState('')

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

    const filteredTours = tours.filter(tour => {
        const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === '' || (statusFilter === 'active' ? tour.isActive : !tour.isActive)

        let matchesPrice = true
        if (priceFilter === 'low') matchesPrice = Number(tour.priceFrom) < 1000
        else if (priceFilter === 'mid') matchesPrice = Number(tour.priceFrom) >= 1000 && Number(tour.priceFrom) <= 5000
        else if (priceFilter === 'high') matchesPrice = Number(tour.priceFrom) > 5000

        return matchesSearch && matchesStatus && matchesPrice
    })

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Tur Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Platformdaki tüm turları inceleyin, düzenleyin veya yayın durumunu yönetin.</p>
                </div>
                <div className="bg-neutral-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                    <TicketIcon className="size-5 text-primary-400" />
                    <span className="text-xl font-black">{filteredTours.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Aktif Liste</span>
                </div>
            </div>

            <TableFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Tur başlığına göre ara..."
                filters={[
                    {
                        label: 'Durum',
                        name: 'status',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: 'Yayında', value: 'active' },
                            { label: 'Yayında Değil', value: 'inactive' }
                        ]
                    },
                    {
                        label: 'Fiyat Aralığı',
                        name: 'price',
                        value: priceFilter,
                        onChange: setPriceFilter,
                        options: [
                            { label: '1.000 ₺ Altı', value: 'low' },
                            { label: '1.000 ₺ - 5.000 ₺', value: 'mid' },
                            { label: '5.000 ₺ Üstü', value: 'high' }
                        ]
                    }
                ]}
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="size-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-[40px] border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Görsel / Başlık</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Acente</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-center">Rez.</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Fiyat</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {filteredTours.map((tour) => (
                                    <tr key={tour.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800/50">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0 border border-neutral-100 dark:border-neutral-600">
                                                    {tour.images?.[0] ? (
                                                        <img src={tour.images[0].url} alt="" className="size-full object-cover" />
                                                    ) : (
                                                        <div className="size-full flex items-center justify-center text-neutral-300">
                                                            <PhotoIcon className="size-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-neutral-900 dark:text-white truncate max-w-[200px] mb-0.5">{tour.title}</div>
                                                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{tour.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-neutral-700 dark:text-neutral-300 text-xs">
                                                {tour.agent?.agentProfile?.companyName || 'Bilinmiyor'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="inline-flex size-8 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center font-black text-xs tabular-nums">
                                                {tour._count?.reservations || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap font-black text-neutral-900 dark:text-white italic">
                                            {Number(tour.priceFrom).toLocaleString('tr-TR')} ₺
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tour.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tour.isActive ? 'Yayında' : 'Pasif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right space-x-3">
                                            <button
                                                onClick={() => toggleStatus(tour.id, tour.isActive)}
                                                className={`text-[10px] font-bold uppercase tracking-widest hover:underline ${tour.isActive ? 'text-orange-600' : 'text-primary-600'}`}
                                            >
                                                {tour.isActive ? 'Durdur' : 'Yayınla'}
                                            </button>
                                            <button
                                                onClick={() => deleteTour(tour.id)}
                                                className="text-[10px] font-bold uppercase tracking-widest text-red-600 hover:underline"
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
