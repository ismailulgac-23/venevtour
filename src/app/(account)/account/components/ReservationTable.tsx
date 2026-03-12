'use client'

import React, { useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { EyeIcon, XMarkIcon, CalendarIcon, UserGroupIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    reservations: any[]
    role: 'AGENT' | 'CUSTOMER'
    onStatusUpdate?: (id: string, status: string) => Promise<void>
}

const ReservationTable = ({ reservations, role, onStatusUpdate }: Props) => {
    const [selectedRes, setSelectedRes] = useState<any>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    const openDetails = (res: any) => {
        setSelectedRes(res)
        setIsOpen(true)
    }

    const closeDetails = () => {
        setIsOpen(false)
        setTimeout(() => setSelectedRes(null), 200)
    }

    const handleAction = async (status: string) => {
        if (!selectedRes || !onStatusUpdate) return
        setActionLoading(true)
        try {
            await onStatusUpdate(selectedRes.id, status)
            closeDetails()
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
            case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-100'
            default: return 'bg-amber-50 text-amber-700 border-amber-100'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'Onaylandı'
            case 'CANCELLED': return 'İptal Edildi'
            default: return 'Bekliyor'
        }
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto rounded-3xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">İşlem</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">Tur</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">{role === 'AGENT' ? 'Müşteri' : 'Acente'}</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">Tarih</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100 text-center">Yolcu</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100">Toplam</th>
                            <th className="px-6 py-4 font-bold text-neutral-900 dark:text-neutral-100 text-center">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openDetails(res)}
                                        className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all shadow-sm group"
                                    >
                                        <EyeIcon className="size-5 group-hover:scale-110 transition-transform" />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">{res.tour.title}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">#{res.id.split('-')[0].toUpperCase()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {role === 'AGENT' ? (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                {res.customer.customerProfile?.firstName} {res.customer.customerProfile?.lastName || 'Müşteri'}
                                            </span>
                                            <span className="text-xs text-neutral-400">{res.customer.email}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                                {res.tour.agent?.agentProfile?.companyName || 'Acente'}
                                            </span>
                                            <span className="text-xs text-neutral-400">{res.tour.agent?.email}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                                        {res.startDate ? new Date(res.startDate).toLocaleDateString('tr-TR') : '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold text-xs">
                                        {res.passengerCount}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-bold text-primary-600">{Number(res.totalPrice).toLocaleString('tr-TR')} ₺</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${getStatusStyle(res.status)}`}>
                                        {getStatusText(res.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DETAIL MODAL */}
            <AnimatePresence>
                {isOpen && selectedRes && (
                    <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={closeDetails}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <TransitionChild
                                    as={motion.div}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <DialogPanel className="w-full max-w-3xl rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-2xl overflow-hidden">
                                        {/* HEADER */}
                                        <div className="px-10 py-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/30">
                                            <div>
                                                <DialogTitle as="h3" className="text-2xl font-bold text-neutral-900 dark:text-white">
                                                    Rezervasyon Detayları
                                                </DialogTitle>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-sm text-neutral-400 font-medium">#{selectedRes.id.toUpperCase()}</p>
                                                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                        {selectedRes.createdAt ? new Date(selectedRes.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={closeDetails}
                                                className="size-10 rounded-full bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-rose-600 transition-colors shadow-sm"
                                            >
                                                <XMarkIcon className="size-6" />
                                            </button>
                                        </div>

                                        <div className="px-10 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[70vh]">
                                            {/* LEFT SIDE: TOUR & AGENT INFO */}
                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest leading-none">Tur Bilgisi</h4>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                            <MapPinIcon className="size-5 text-neutral-400" />
                                                            <span className="font-bold">{selectedRes.tour.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                                                            <CalendarIcon className="size-5 text-neutral-400" />
                                                            <span className="font-medium">
                                                                {selectedRes.startDate ? new Date(selectedRes.startDate).toLocaleDateString('tr-TR') : '-'}
                                                                {selectedRes.endDate ? ` - ${new Date(selectedRes.endDate).toLocaleDateString('tr-TR')}` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-4">
                                                    <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest leading-none">
                                                        {role === 'AGENT' ? 'Müşteri Bilgisi' : 'Acente Bilgisi'}
                                                    </h4>
                                                    <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-10 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                                <UserGroupIcon className="size-5" />
                                                            </div>
                                                            <span className="font-bold">
                                                                {role === 'AGENT'
                                                                    ? `${selectedRes.customer.customerProfile?.firstName} ${selectedRes.customer.customerProfile?.lastName}`
                                                                    : selectedRes.tour.agent?.agentProfile?.companyName
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col gap-2 pl-12 border-l-2 border-neutral-100 dark:border-neutral-800 ml-5">
                                                            <div className="flex items-center gap-3">
                                                                <EnvelopeIcon className="size-4 text-neutral-400" />
                                                                <span className="text-sm font-medium">{role === 'AGENT' ? selectedRes.customer.email : selectedRes.tour.agent?.email}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <PhoneIcon className="size-4 text-neutral-400" />
                                                                <span className="text-sm font-medium">
                                                                    {role === 'AGENT'
                                                                        ? selectedRes.customer.customerProfile?.phone || '-'
                                                                        : selectedRes.tour.agent?.agentProfile?.contactPhone || '-'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-dashed border-neutral-100 dark:border-neutral-800">
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ödeme Özeti</span>
                                                            <span className="text-sm font-medium text-neutral-400">{selectedRes.passengerCount} Kişi</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block text-3xl font-bold text-primary-600">{Number(selectedRes.totalPrice).toLocaleString('tr-TR')} ₺</span>
                                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Kredi Kartı ile Ödendi</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: PASSENGERS */}
                                            <div className="space-y-6">
                                                <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest leading-none">Katılımcı Listesi</h4>
                                                <div className="space-y-4">
                                                    {selectedRes.passengers?.map((p: any, idx: number) => (
                                                        <div key={p.id} className="p-5 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm space-y-3 group hover:border-primary-600/30 transition-colors">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Gezgin {idx + 1}</span>
                                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Bilet Hazır</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <IdentificationIcon className="size-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                                                                <span className="font-bold text-neutral-800 dark:text-neutral-200">{p.fullName}</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 pl-8">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase">T.C. / Pasaport</span>
                                                                    <span className="text-xs font-bold font-mono">{p.idNumber || '-'}</span>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Doğum Tarihi</span>
                                                                    <span className="text-xs font-bold">{p.birthDate ? new Date(p.birthDate).toLocaleDateString('tr-TR') : '-'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* EXTRAS */}
                                                <div className="pt-4 space-y-4">
                                                    <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest leading-none">Seçilen Ekstralar</h4>
                                                    <div className="space-y-2">
                                                        {selectedRes.extras && selectedRes.extras.length > 0 ? (
                                                            selectedRes.extras.map((extra: any) => (
                                                                <div key={extra.id} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                                                                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">{extra.name}</span>
                                                                    <span className="text-sm font-bold text-primary-600">{Number(extra.price).toLocaleString('tr-TR')} ₺</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-xs font-medium text-neutral-400 italic">Dahil olan ekstra bulunmamaktadır.</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* FOOTER */}
                                        <div className="px-10 py-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 flex justify-end gap-3">
                                            {role === 'AGENT' && selectedRes.status === 'PENDING' ? (
                                                <>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleAction('CANCELLED')}
                                                        className="px-8 h-12 bg-rose-50 text-rose-600 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all disabled:opacity-50"
                                                    >
                                                        Talebi Reddet
                                                    </button>
                                                    <button
                                                        disabled={actionLoading}
                                                        onClick={() => handleAction('CONFIRMED')}
                                                        className="px-8 h-12 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                                                    >
                                                        {actionLoading ? (
                                                            <div className="size-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : 'Hemen Onayla'}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={closeDetails}
                                                    className="px-8 h-12 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-neutral-900/10 dark:shadow-white/5"
                                                >
                                                    Kapat
                                                </button>
                                            )}
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ReservationTable
