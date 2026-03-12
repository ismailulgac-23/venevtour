import React, { FC } from 'react'

export interface BackgroundSectionProps {
  className?: string
  children?: React.ReactNode
}

const BackgroundSection: FC<BackgroundSectionProps> = ({ className = 'bg-neutral-50 dark:bg-black/20 ', children }) => {
  return (
    <div
      className={`absolute inset-0 z-0 w-full rounded-[40px] ${className}`}
    >
      {children}
    </div>
  )
}

export default BackgroundSection
