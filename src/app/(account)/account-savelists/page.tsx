'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import TourCard from '@/components/TourCard'
import { HotAirBalloonIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const SavedListsPage = () => {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/user/favorites')
        if (res.ok) {
          const json = await res.json()
          setFavorites(json.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Favorilerim</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Daha sonra incelemek için kaydettiğiniz turlar.</p>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col items-center">
            <HugeiconsIcon icon={HotAirBalloonIcon} size={48} className="text-neutral-300 mb-4" />
            <p className="text-neutral-500 mb-4 text-lg">Henüz hiç tur kaydetmediniz.</p>
            <ButtonPrimary href="/tours">Turları Keşfet</ButtonPrimary>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <TourCard
              key={fav.tour.id}
              data={{
                ...fav.tour,
                priceFrom: Number(fav.tour.priceFrom),
                createdAt: fav.tour.createdAt,
                updatedAt: fav.tour.updatedAt,
                like: true
              }}
              onLikeChange={(liked) => {
                if (!liked) {
                  setFavorites((prev) => prev.filter((item) => item.tour.id !== fav.tour.id))
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedListsPage
