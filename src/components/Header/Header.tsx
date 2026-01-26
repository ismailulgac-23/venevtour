'use client'

import React, { FC, useEffect, useState } from 'react'
import Logo from '@/shared/Logo'
import AvatarDropdown from './AvatarDropdown'
import { Button } from '@/shared/Button'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/context/AuthContext'

interface HeaderProps {
  hasBorderBottom?: boolean
  className?: string
}

const Header: FC<HeaderProps> = ({ hasBorderBottom = true, className }) => {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  const renderNav = () => {
    return (
      <ul className="hidden md:flex items-center gap-8 font-medium text-sm text-neutral-600 dark:text-neutral-300">
        <li><Link href="/" className="hover:text-primary-600">Anasayfa</Link></li>
        <li><Link href="/tours" className="hover:text-primary-600">Turlar</Link></li>
        <li><Link href="/about" className="hover:text-primary-600">Hakkımızda</Link></li>
        <li><Link href="/contact" className="hover:text-primary-600">İletişim</Link></li>
      </ul>
    )
  }

  return (
    <div className={className}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between items-center gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            hasBorderBottom && 'border-b',
          )}
        >
          <div className="flex items-center gap-x-3 sm:gap-x-8">
            <Logo />
            {renderNav()}
          </div>

          <div className="flex items-center justify-end gap-x-2.5 sm:gap-x-6">

            <div className="hidden md:block">
              <Link href="/become-an-agent" className="text-sm font-medium hover:text-primary-600">
                Acente Ol
              </Link>
            </div>

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse"></div>
            ) : user ? (
              <AvatarDropdown />
            ) : (
              <Button className="py-2 px-4 text-sm" href="/login">
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
