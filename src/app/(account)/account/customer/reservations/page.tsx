'use client'

import React, { useEffect, useState } from 'react'
import ReservationTable from '../../components/ReservationTable'

const CustomerReservationsPage = () => {
    const [reservations, setReservations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchReservations = async () => {
        try {
            const res = await fetch('/api/reservations')
            const json = await res.json()
            if (res.ok) {
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

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">Rezervasyonlarım</h2>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400 font-medium">Bütün tur rezervasyonlarınızı ve işlem detaylarını buradan takip edebilirsiniz.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="size-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-neutral-500 font-medium tracking-tight">İşlemleriniz yükleniyor...</p>
                </div>
            ) : reservations.length === 0 ? (
                <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-800/30 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                    <div className="size-20 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        🌍
                    </div>
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 italic={false}">Henüz bir rezervasyonunuz bulunmuyor.</p>
                    <p className="text-neutral-500 mt-2 font-medium">Yeni maceralara atılmak için turlarımızı keşfedin.</p>
                </div>
            ) : (
                <ReservationTable reservations={reservations} role="CUSTOMER" />
            )}
        </div>
    )
}

export default CustomerReservationsPage
