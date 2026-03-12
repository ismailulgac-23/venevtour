'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReservationTable from '../../components/ReservationTable'

const AgentReservationsPage = () => {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReservations = async () => {
        try {
            const res = await fetch('/api/reservations/agent')
            if (res.ok) {
                const json = await res.json()
                setReservations(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReservations()
    }, [])

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/agent/reservations/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success('Rezervasyon durumu güncellendi.')
                fetchReservations()
            } else {
                toast.error('İşlem başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Gelen Rezervasyonlar</h2>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400 font-medium">Turlarınıza yapılan rezervasyon taleplerini ve katılımcı bilgilerini takip edin.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="size-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-neutral-500 font-medium tracking-tight">Rezervasyonlar listeleniyor...</p>
                </div>
            ) : reservations.length === 0 ? (
                <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-800/30 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="size-20 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-2xl">
                        📥
                    </div>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 italic={false}">Henüz bir rezervasyon talebi yok.</p>
                    <p className="text-neutral-500 mt-2 font-medium">Yeni talepler geldiğinde burada görünecektir.</p>
                </div>
            ) : (
                <ReservationTable 
                    reservations={reservations} 
                    role="AGENT" 
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    )
}

export default AgentReservationsPage
