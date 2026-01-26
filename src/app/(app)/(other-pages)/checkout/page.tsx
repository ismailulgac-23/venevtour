'use client'

import React, { useState, useEffect } from 'react'
import StartRating from '@/components/StartRating'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { DescriptionList } from '@/shared/description-list'
import { useRouter } from 'next/navigation'
import PayWith from './PayWith'
import YourTrip from './YourTrip'
import toast from 'react-hot-toast'

const Page = () => {
  const router = useRouter()
  const [resData, setResData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [passengers, setPassengers] = useState<any[]>([])

  useEffect(() => {
    const data = sessionStorage.getItem('pending_reservation')
    if (data) {
      const parsedData = JSON.parse(data)
      setResData(parsedData)
      setPassengers(Array.from({ length: parsedData.passengerCount }).map(() => ({
        firstName: '',
        lastName: '',
        birthDate: '',
        idNumber: '',
        email: '',
        phone: ''
      })))
    } else {
      router.push('/tours')
    }
  }, [router])

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const newPassengers = [...passengers]
    newPassengers[index][field] = value
    setPassengers(newPassengers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resData) return

    const isAnyEmpty = passengers.some(p => !p.firstName || !p.lastName || !p.idNumber)
    if (isAnyEmpty) {
      toast.error('Lütfen tüm yolcu bilgilerini doldurunuz.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        tourId: resData.tourId,
        startDate: resData.dates[0],
        endDate: resData.dates[1],
        selectedExtras: resData.selectedExtras.map((e: any) => e.id),
        passengers: passengers.map(p => ({
          fullName: `${p.firstName} ${p.lastName}`,
          idNumber: p.idNumber,
          email: p.email,
          phone: p.phone,
          birthDate: p.birthDate ? new Date(p.birthDate).toISOString() : null
        }))
      }

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        sessionStorage.removeItem('pending_reservation')
        // Store reservation data for pay-done page
        sessionStorage.setItem('last_reservation', JSON.stringify({
          ...data.data,
          tourTitle: resData.tourTitle,
          featuredImage: resData.featuredImage,
          location: resData.location
        }))
        router.push('/pay-done')
      } else {
        toast.error(data.message || 'Rezervasyon sırasında bir hata oluştu.')
      }
    } catch (e) {
      toast.error('Bağlantı hatası oluştu.')
    } finally {
      setLoading(false)
    }
  }

  if (!resData) return (
    <div className="container py-32 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-500 font-medium">Rezervasyon detayları yükleniyor...</p>
      </div>
    </div>
  )

  const renderSidebar = () => {
    return (
      <div className="sticky top-28 flex w-full flex-col gap-y-8 bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-[32px] border border-neutral-100 dark:border-neutral-800">
        <div className="flex gap-4">
          <div className="relative size-20 shrink-0 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
            <img
              alt=""
              className="w-full h-full object-cover"
              src={resData.featuredImage || "https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg"}
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-xs font-semibold text-primary-600">{resData.location}</span>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-tight">
              {resData.tourTitle}
            </h2>
            <div className="mt-1">
              <StartRating point={5} reviewCount={10} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Birim Fiyat x {resData.passengerCount} Kişi</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{(resData.pricePerPerson * resData.passengerCount).toLocaleString('tr-TR')} ₺</span>
          </div>

          {resData.selectedExtras?.map((extra: any) => (
            <div key={extra.id} className="flex justify-between items-center text-sm">
              <span className="text-neutral-500">{extra.name}</span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">+{Number(extra.price).toLocaleString('tr-TR')} ₺</span>
            </div>
          ))}

          <div className="pt-4 mt-2 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-end">
            <span className="font-bold text-neutral-900 dark:text-neutral-100">Toplam Tutar</span>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold text-primary-600 tracking-tight">{resData.totalPrice.toLocaleString('tr-TR')} ₺</span>
              <span className="text-[10px] text-neutral-400 font-medium">Tüm vergiler dahildir</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-xs font-medium text-neutral-500 leading-relaxed shadow-sm">
          💡 Rezervasyonunuzu tamamladıktan sonra acentemiz sizinle iletişime geçecektir.
        </div>
      </div>
    )
  }

  const renderMain = () => {
    return (
      <div className="flex w-full flex-col gap-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">Detaylar ve Ödeme</h1>
          <p className="text-neutral-500 font-medium max-w-lg">Lütfen seyahat detaylarını kontrol edin ve katılımcı bilgilerini kimlikte yazdığı gibi doldurun.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          <YourTrip guestCount={resData.passengerCount} />

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl flex items-center justify-center font-bold">1</div>
              <h3 className="text-xl font-bold">Katılımcı Bilgileri</h3>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {passengers.map((p, idx) => (
                <div key={idx} className="p-8 bg-neutral-50 dark:bg-neutral-800/20 rounded-3xl border border-neutral-100 dark:border-neutral-800 space-y-8">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <span className="text-xs font-bold text-primary-600">#{idx + 1}. Katılımcı</span>
                    <span className="text-[10px] font-medium text-neutral-400">Tüm bilgiler zorunludur</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-1">İsim</label>
                      <input
                        type="text"
                        placeholder="Örn: Ahmet"
                        className="w-full h-14 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary-600 transition-all outline-none"
                        value={p.firstName}
                        onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-1">Soyisim</label>
                      <input
                        type="text"
                        placeholder="Örn: Yılmaz"
                        className="w-full h-14 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary-600 transition-all outline-none"
                        value={p.lastName}
                        onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-1">T.C. No / Pasaport No</label>
                      <input
                        type="text"
                        placeholder="00000000000"
                        className="w-full h-14 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary-600 transition-all outline-none"
                        value={p.idNumber}
                        onChange={(e) => handlePassengerChange(idx, 'idNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 px-1">Doğum Tarihi</label>
                      <input
                        type="date"
                        className="w-full h-14 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 rounded-2xl px-5 text-sm font-medium focus:ring-2 focus:ring-primary-600 transition-all outline-none"
                        value={p.birthDate}
                        onChange={(e) => handlePassengerChange(idx, 'birthDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-bold">Ödeme Seçenekleri</h3>
            </div>
            <div className="p-8 bg-neutral-50 dark:bg-neutral-800/20 rounded-[32px] border border-neutral-100 dark:border-neutral-800">
              <PayWith />
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col">
              <span className="text-xs text-neutral-500 font-medium">Toplam Ödenecek</span>
              <span className="text-4xl font-bold text-primary-600 tracking-tight">{resData.totalPrice.toLocaleString('tr-TR')} ₺</span>
            </div>
            <ButtonPrimary
              type="submit"
              disabled={loading}
              className="h-16 px-16 text-sm font-bold shadow-xl shadow-primary-500/20 active:scale-95 transition-all w-full md:w-auto rounded-2xl bg-neutral-900 text-white hover:bg-black"
            >
              {loading ? 'İşlem yapılıyor...' : 'Rezervasyonu Tamamla'}
            </ButtonPrimary>
          </div>
        </form>
      </div>
    )
  }

  return (
    <main className="container mt-12 mb-24 flex flex-col gap-12 lg:mb-32 lg:flex-row lg:gap-16">
      <div className="w-full lg:w-[65%]">{renderMain()}</div>
      <div className="grow">{renderSidebar()}</div>
    </main>
  )
}

export default Page
