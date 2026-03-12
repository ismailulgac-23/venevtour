import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center gap-0.5 font-black text-2xl tracking-tighter transition-transform hover:scale-105 active:scale-95",
        className
      )}
    >
      <span className="text-neutral-900 dark:text-white flex items-center">
        Venev
      </span>
      <span className="text-primary-600">
        tour
      </span>
    </Link>
  )
}

export default Logo
