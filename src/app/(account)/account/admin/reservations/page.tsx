"use client";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { CheckIcon, XMarkIcon, TicketIcon } from '@heroicons/react/24/outline'

const AdminReservationsPage = () => {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const fetchReservations = async () => {
        try {
            const res = await fetch('/api/admin/reservations')
            if (res.ok) {
                const json = await res.json()
                setReservations(json.data)
            }
        } catch (error) {
            console.error(error)
            toast.error('Rezervasyonlar yüklenemedi.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/reservations/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                toast.success('Rezervasyon durumu güncellendi.')
                fetchReservations()
            } else {
                toast.error('Güncelleme başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const filteredReservations = reservations.filter(res => {
        const fullName = `${res.customer.customerProfile?.firstName} ${res.customer.customerProfile?.lastName}`.toLowerCase()
        const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
            res.tour.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === '' || res.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest">Onaylandı</span>
            case 'CANCELLED':
                return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest">İptal Edildi</span>
            default:
                return <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-widest">Bekliyor</span>
        }
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Rezervasyon Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Tüm turlar için gelen rezervasyonları ve ödeme durumlarını yönetin.</p>
                </div>
                <div className="bg-neutral-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                    <TicketIcon className="size-5 text-primary-400" />
                    <span className="text-xl font-black">{filteredReservations.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Toplam Kayıt</span>
                </div>
            </div>

            <TableFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Müşteri adı veya tur başlığına göre ara..."
                filters={[
                    {
                        label: 'Durum',
                        name: 'status',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: 'Onaylandı', value: 'CONFIRMED' },
                            { label: 'Bekliyor', value: 'PENDING' },
                            { label: 'İptal Edildi', value: 'CANCELLED' }
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
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Tur / Müşteri</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Tarih / Kişi</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Toplam Tutar</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {filteredReservations.map((res) => (
                                    <tr key={res.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors text-neutral-900 dark:text-white">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800">
                                            <div className="font-bold mb-0.5 line-clamp-1 italic">{res.tour.title}</div>
                                            <div className="text-[10px] text-neutral-400 font-black uppercase">{res.customer.customerProfile?.firstName} {res.customer.customerProfile?.lastName}</div>
                                        </td>
                                        <td className="px-6 py-6 font-medium">
                                            <div className="font-bold italic">
                                                {res.startDate ? new Date(res.startDate).toLocaleDateString('tr-TR') : '-'}
                                            </div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase">{res.passengerCount} Kişi</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-base font-black italic">
                                                {Number(res.totalPrice).toLocaleString('tr-TR')} ₺
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            {getStatusBadge(res.status)}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                {res.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(res.id, 'CONFIRMED')}
                                                            className="p-3 bg-green-50 text-green-700 rounded-2xl hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                                            title="Onayla"
                                                        >
                                                            <CheckIcon className="size-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(res.id, 'CANCELLED')}
                                                            className="p-3 bg-red-50 text-red-700 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                            title="İptal Et"
                                                        >
                                                            <XMarkIcon className="size-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {res.status === 'CONFIRMED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(res.id, 'CANCELLED')}
                                                        className="px-4 py-2 border border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                                                    >
                                                        İptal Et
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredReservations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-neutral-500 font-medium">
                                            Arama sonucuna uygun rezervasyon bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminReservationsPage

