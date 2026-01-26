'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CreditCardIcon } from '@heroicons/react/24/outline'

const BillingPage = () => {
  const { user } = useAuth()
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Sadece CONFIRMED rezervasyonları ödeme olarak görelim
        const res = await fetch('/api/reservations/my')
        if (res.ok) {
          const json = await res.json()
          const confirmed = json.data.filter((r: any) => r.status === 'CONFIRMED')
          setPayments(confirmed)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Ödemeler ve Faturalar</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Geçmiş ödemelerinizi ve rezervasyon fişlerinizi görüntüleyin.</p>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800 rounded-3xl border-2 border-dashed dark:border-neutral-700">
          <p className="text-neutral-400">Henüz tamamlanmış bir ödemeniz bulunmuyor.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Tur</th>
                <th className="px-6 py-4 font-semibold">Tutar</th>
                <th className="px-6 py-4 font-semibold">Yöntem</th>
                <th className="px-6 py-4 font-semibold text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4 font-medium">{p.tour.title}</td>
                  <td className="px-6 py-4">{Number(p.totalPrice).toLocaleString('tr-TR')} ₺</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <CreditCardIcon className="size-4" />
                    ***** 4242
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-medium">Ödendi</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BillingPage
