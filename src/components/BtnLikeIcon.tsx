'use client'

import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { FC, useState, useEffect } from 'react'

interface BtnLikeIconProps {
  className?: string
  colorClass?: string
  sizeClass?: string
  isLiked?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const BtnLikeIcon: FC<BtnLikeIconProps> = ({
  className,
  colorClass = 'text-white bg-black/30 hover:bg-black/50',
  sizeClass = 'w-8 h-8',
  isLiked = false,
  onClick,
}) => {
  const [likedState, setLikedState] = useState(isLiked)

  useEffect(() => {
    setLikedState(isLiked)
  }, [isLiked])

  const handleToggleLike = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClick) {
      onClick(e)
    } else {
      setLikedState(!likedState)
    }
  }

  return (
    <div
      className={clsx(
        `flex cursor-pointer items-center justify-center rounded-full transition-colors`,
        className,
        colorClass,
        sizeClass,
        likedState && 'text-red-500'
      )}
      onClick={handleToggleLike}
    >
      {likedState ? <HeartIconSolid className="size-5" /> : <HeartIcon className="size-5" />}
    </div>
  )
}

export default BtnLikeIcon
