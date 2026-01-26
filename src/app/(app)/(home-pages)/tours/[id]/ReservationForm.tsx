"use client"

import React, { useState, useEffect } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/shared/description-list'
import DatesRangeInputPopover from '../../../(listings)/components/DatesRangeInputPopover'
import GuestsInputPopover from '../../../(listings)/components/GuestsInputPopover'
import { GuestsObject } from '@/type'
import T from '@/utils/getT'
import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import toast from 'react-hot-toast'

import StartRating from '@/components/StartRating'

const ReservationForm = ({ tour, reviewStart, reviewCount }: { tour: any, reviewStart?: number, reviewCount?: number }) => {
    const router = useRouter()
    const [guests, setGuests] = useState<GuestsObject>({
        guestAdults: 1,
        guestChildren: 0,
        guestInfants: 0
    })

    // Initialize dates with tour's valid range if exists, otherwise next 1 day
    const tourStart = tour.tourStartDate ? new Date(tour.tourStartDate) : new Date()
    const today = new Date()
    const minDate = tourStart < today ? today : tourStart
    const maxDate = tour.tourEndDate ? new Date(tour.tourEndDate) : null

    const [dates, setDates] = useState<[Date | null, Date | null]>([
        minDate,
        tour.durationDays ? new Date(minDate.getTime() + Number(tour.durationDays) * 24 * 60 * 60 * 1000) : null
    ])

    const [selectedExtras, setSelectedExtras] = useState<string[]>([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) setIsLoggedIn(true)
            } catch (e) { }
        }
        checkAuth()
    }, [])

    const passengerCount = (guests.guestAdults || 0) + (guests.guestChildren || 0)

    useEffect(() => {
        const basePrice = Number(tour.priceFrom) * passengerCount
        let extrasPrice = 0
        tour.extras.forEach((extra: any) => {
            if (selectedExtras.includes(extra.id)) {
                if (extra.isPerPerson) {
                    extrasPrice += Number(extra.price) * passengerCount
                } else {
                    extrasPrice += Number(extra.price)
                }
            }
        })
        setTotalPrice(basePrice + extrasPrice)
    }, [passengerCount, selectedExtras, tour])

    const isDateValid = () => {
        if (!dates[0]) return false
        if (minDate && dates[0] < new Date(minDate.setHours(0, 0, 0, 0))) return false
        if (maxDate && dates[0] > new Date(maxDate.setHours(23, 59, 59, 999))) return false
        return true
    }

    const handleReservation = () => {
        if (!isDateValid()) {
            toast.error('Lütfen tur tarihleri aralığında bir tarih seçiniz.')
            return
        }

        const reservationData = {
            tourId: tour.id,
            tourTitle: tour.title,
            pricePerPerson: Number(tour.priceFrom),
            passengerCount: passengerCount,
            guests: guests,
            dates: dates,
            reviewStart,
            reviewCount,
            selectedExtras: tour.extras.filter((e: any) => selectedExtras.includes(e.id)),
            totalPrice: totalPrice,
            featuredImage: tour.images[0]?.url,
            location: tour.location
        }
        sessionStorage.setItem('pending_reservation', JSON.stringify(reservationData))

        if (!isLoggedIn) {
            router.push(`/login?redirect=/checkout`)
        } else {
            router.push('/checkout')
        }
    }

    const handleExtraToggle = (id: string) => {
        if (selectedExtras.includes(id)) {
            setSelectedExtras(selectedExtras.filter(e => e !== id))
        } else {
            setSelectedExtras([...selectedExtras, id])
        }
    }

    const isValid = isDateValid() && passengerCount > 0

    return (
        <div className="dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[40px] py-8 px-4 space-y-8">
            <div className="flex justify-between items-center px-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400">Başlangıç Fiyatı</span>
                    <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tighter">
                        {Number(tour.priceFrom).toLocaleString('tr-TR')} ₺
                        <span className="ml-1 text-sm font-bold text-neutral-500 tracking-normal">/kişi</span>
                    </span>
                </div>
                <StartRating size="lg" point={reviewStart || 5} reviewCount={reviewCount || 0} />
            </div>

            <div className="flex flex-col rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 mx-4">
                <div className="relative border-b border-neutral-50 dark:border-neutral-800 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                    <DatesRangeInputPopover
                        className="w-full"
                        defaultDateValue={dates}
                        onDatesChange={setDates}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                </div>

                <div className="relative transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
                    <GuestsInputPopover
                        className="w-full"
                        defaultValue={guests}
                        onGuestsChange={setGuests}
                    />
                </div>
            </div>

            {tour.extras.length > 0 && (
                <div className="space-y-4 px-4">
                    <h4 className="text-[10px] font-bold text-neutral-400">Ekstra Hizmetler</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {tour.extras.map((extra: any) => {
                            const isSelected = selectedExtras.includes(extra.id);
                            return (
                                <button
                                    key={extra.id}
                                    type="button"
                                    onClick={() => handleExtraToggle(extra.id)}
                                    className={clsx(
                                        "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left",
                                        isSelected
                                            ? "border-primary-600 bg-primary-50/10 ring-1 ring-primary-600"
                                            : "border-neutral-50 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "size-5 rounded-md flex items-center justify-center border transition-colors",
                                            isSelected ? "bg-primary-600 border-primary-600" : "border-neutral-300 dark:border-neutral-600"
                                        )}>
                                            {isSelected && <CheckIcon className="size-3.5 text-white stroke-[3]" />}
                                        </div>
                                        <span className="text-xs font-bold tracking-tight">{extra.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary-600">+{Number(extra.price).toLocaleString('tr-TR')} ₺</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800 mx-4">
                <DescriptionList className="">
                    <DescriptionTerm className="text-[11px] font-bold text-neutral-500 tracking-wider">
                        Baz Ücret ({passengerCount} Kişi)
                    </DescriptionTerm>
                    <DescriptionDetails className="text-sm font-bold text-right">
                        {(Number(tour.priceFrom) * passengerCount).toLocaleString('tr-TR')} ₺
                    </DescriptionDetails>

                    {selectedExtras.length > 0 && (
                        <>
                            <DescriptionTerm className="text-[11px] font-bold text-neutral-500 tracking-wider">
                                Ekstralar Toplamı
                            </DescriptionTerm>
                            <DescriptionDetails className="text-sm font-bold text-right">
                                {(totalPrice - (Number(tour.priceFrom) * passengerCount)).toLocaleString('tr-TR')} ₺
                            </DescriptionDetails>
                        </>
                    )}


                    <DescriptionTerm className="text-sm font-bold text-neutral-900 dark:text-white">
                        Toplam Tutar
                    </DescriptionTerm>
                    <DescriptionDetails className="text-xl font-bold text-primary-600 text-right">
                        {totalPrice.toLocaleString('tr-TR')} ₺
                    </DescriptionDetails>
                </DescriptionList>
            </div>

            <div className="px-4">
                <ButtonPrimary
                    onClick={handleReservation}
                    disabled={!isValid}
                    className={clsx(
                        "w-full py-5 text-sm shadow-2xl active:scale-95 transition-transform",
                        !isValid ? "opacity-50 cursor-not-allowed grayscale" : "shadow-primary-600/30"
                    )}
                >
                    {T['common']['Reserve']}
                </ButtonPrimary>
            </div>

            <p className="text-center text-[10px] font-bold text-neutral-400 tracking-widest leading-relaxed px-4">
                Güvenli ödeme altyapısı ile hemen yerinizi ayırtın.
            </p>
        </div>
    )
}

export default ReservationForm
