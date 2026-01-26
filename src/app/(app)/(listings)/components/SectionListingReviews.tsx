'use client'

import ListingReview from '@/components/ListingReview'
import { TListingReivew } from '@/data/data'
import ButtonCircle from '@/shared/ButtonCircle'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Divider } from '@/shared/divider'
import Input from '@/shared/Input'
import { ArrowRightIcon, StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { SectionHeading } from './SectionHeading'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Textarea from '@/shared/Textarea'
import ButtonPrimary from '@/shared/ButtonPrimary'

interface Props {
  tourId?: string
  reviewCount: number
  reviewStart: number
  reviews: TListingReivew[]
}

const SectionListingReviews = ({ tourId, reviews, reviewCount, reviewStart }: Props) => {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) setIsLoggedIn(true)
      })
      .catch(() => { })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      toast.error('Yorum yapmak için giriş yapmalısınız.')
      router.push('/login')
      return
    }

    if (!comment.trim()) {
      toast.error('Lütfen bir yorum yazın.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/tours/${tourId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      })

      if (res.ok) {
        toast.success('Yorumunuz başarıyla eklendi.')
        setComment('')
        setRating(5)
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.message || 'Bir hata oluştu.')
      }
    } catch (err) {
      toast.error('Bağlantı hatası.')
    } finally {
      setLoading(false)
    }
  }

  const renderRatingSummary = () => {
    const counts = [0, 0, 0, 0, 0]
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++
    })

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white dark:bg-neutral-900 p-8 rounded-[40px] border border-neutral-100 dark:border-neutral-800 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-2 border-r border-neutral-100 dark:border-neutral-800 hidden md:flex">
          <div className="text-7xl font-bold text-neutral-900 dark:text-white tracking-tighter italic">{reviewStart.toFixed(1)}</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <StarIcon key={n} className={clsx("size-5", reviewStart >= n ? "text-yellow-400" : "text-neutral-200")} />
            ))}
          </div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{reviewCount} Toplam Yorum</p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(num => {
            const count = counts[num - 1]
            const percent = reviewCount > 0 ? (count / reviewCount) * 100 : 0
            return (
              <div key={num} className="flex items-center gap-4 group">
                <span className="text-[10px] font-bold text-neutral-400 w-4">{num}</span>
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 w-8 text-right underline decoration-dotted">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-10 pt-8">
      {/* HEADING */}
      <div className="space-y-2 px-1">
        <SectionHeading>Misafir Deneyimleri</SectionHeading>
        <p className="text-sm text-neutral-500 font-medium italic">Bu turu daha önce deneyimleyen misafirlerimizin yorumları.</p>
      </div>

      {renderRatingSummary()}

      {/* Form */}
      {tourId && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 p-8 rounded-[40px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 transition-all hover:border-primary-600/30 group">
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-1 group-hover:text-primary-600 transition-colors">Yorumunuzu ve Puanınızı Bırakın</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                    >
                      <StarIcon className={clsx("size-10", rating >= num ? "text-yellow-400" : "text-neutral-300")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  rows={4}
                  placeholder="Deneyiminizi diğer misafirlerle paylaşın..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 font-medium shadow-sm focus:ring-4 focus:ring-primary-600/5 transition-all text-base"
                />
              </div>

              <div className="flex justify-end">
                <ButtonPrimary type="submit" disabled={loading} className="w-full sm:w-auto h-12 px-12 rounded-3xl text-sm font-medium shadow-xl shadow-primary-600/20 active:scale-95 transition-transform bg-neutral-900 text-white">
                  {loading ? 'Gönderiliyor...' : 'Deneyimi Yayınla'}
                </ButtonPrimary>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="size-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <StarIcon className="size-10 text-neutral-300" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight uppercase mb-2">Fikriniz Bizim İçin Değerli</h4>
              <p className="text-neutral-500 font-medium mb-8 max-w-sm">Yorum bırakmak ve diğer gezginlere yardımcı olmak için hemen giriş yapın.</p>
              <ButtonSecondary className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs" onClick={() => router.push('/login')}>Oturum Aç</ButtonSecondary>
            </div>
          )}
        </div>
      )}

      {/* comment list */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {reviews.map((item, index) => (
              <ListingReview key={index} className="py-10" reivew={item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800">
            <div className="size-16 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 italic text-2xl font-bold text-neutral-300">!</div>
            <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[10px]">Henüz yorum yapılmamış.</p>
            <p className="text-xs text-neutral-400 mt-1 uppercase font-medium">İlk yorumu siz yapmak ister misiniz?</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionListingReviews
