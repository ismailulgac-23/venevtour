'use client'

import { ButtonCircle } from '@/shared/Button'
import SocialsShare from '@/shared/SocialsShare'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon } from '@heroicons/react/24/solid'
import { Share03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export const LikeButton = ({ tourId, initialIsLiked }: { tourId?: string, initialIsLiked?: boolean }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked || false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggleLike = async () => {
    if (!tourId) return
    if (loading) return
    setLoading(true)

    try {
      const authRes = await fetch('/api/auth/me')
      if (!authRes.ok) {
        toast.error('Favorilere eklemek için giriş yapmalısınız.')
        router.push(`/login?redirect=${window.location.pathname}`)
        return
      }

      if (isLiked) {
        const res = await fetch(`/api/favorites/${tourId}`, { method: 'DELETE' })
        if (res.ok) {
          setIsLiked(false)
          toast.success('Favorilerden kaldırıldı.')
        }
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tourId })
        })
        if (res.ok) {
          setIsLiked(true)
          toast.success('Favorilere eklendi.')
        }
      }
    } catch (e) {
      toast.error('Bağlantı hatası.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ButtonCircle outline onClick={handleToggleLike} className={clsx(loading && 'opacity-50 pointer-events-none')}>
      {isLiked ? <HeartIcon className={'size-5! text-red-500'} /> : <HeartIconOutline className="size-5!" />}
    </ButtonCircle>
  )
}

export const ShareButton = () => {
  return (
    <Popover className="relative">
      <PopoverButton as={ButtonCircle} outline>
        <HugeiconsIcon icon={Share03Icon} size={20} color="currentColor" strokeWidth={1.5} />
      </PopoverButton>
      <PopoverPanel
        anchor={{
          to: 'bottom end',
          gap: 12,
        }}
        className="relative z-10"
      >
        <div className="w-48 rounded-xl border bg-white px-4 py-2.5 dark:bg-neutral-800">
          <SocialsShare />
        </div>
      </PopoverPanel>
    </Popover>
  )
}

const LikeSaveBtns = ({ className, tourId, initialIsLiked }: { className?: string, tourId?: string, initialIsLiked?: boolean }) => {
  return (
    <div className={clsx('flex gap-2', className)}>
      <LikeButton tourId={tourId} initialIsLiked={initialIsLiked} />
      <ShareButton />
    </div>
  )
}

export default LikeSaveBtns
