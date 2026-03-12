'use client'

import React, { FC, useEffect, useState } from 'react'
import Logo from '@/shared/Logo'
import AvatarDropdown from './AvatarDropdown'
import { Button } from '@/shared/Button'
import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  hasBorderBottom?: boolean
  className?: string
}

const Header: FC<HeaderProps> = ({ hasBorderBottom = true, className }) => {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          const json = await res.json()
          setCategories(json.data || [])
        }
      } catch (error) {
        console.error('Kategoriler çekilemedi:', error)
      }
    }
    fetchCategories()
  }, [])

  const CORPORATE_LINKS = [
    { name: 'Hakkımızda', href: '/about' },
    { name: 'Sıkça Sorulanlar (SSS)', href: '/faqs' },
    { name: 'Acenteler İçin', href: '/become-an-agent' },
    { name: 'İletişim', href: '/contact' },
  ]

  const renderNav = () => {
    return (
      <ul className="hidden lg:flex items-center gap-6 font-medium text-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <Link href="/" className={clsx("hover:text-primary-600 transition-colors", pathname === '/' && "text-primary-600 font-semibold")}>Anasayfa</Link>
        </li>
        <li>
          <Link href="/tours" className={clsx("hover:text-primary-600 transition-colors", pathname === '/tours' && "text-primary-600 font-semibold")}>Turlar</Link>
        </li>
        <li>
          <Link href="/blog" className={clsx("hover:text-primary-600 transition-colors", pathname === '/blog' && "text-primary-600 font-semibold")}>Blog</Link>
        </li>
        
        {/* Kategoriler Dropdown */}
        {categories.length > 0 && (
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-1 hover:text-primary-600 transition-colors focus:outline-none outline-none">
              Kategoriler
              <ChevronDownIcon className="size-3.5" />
            </PopoverButton>
            <Transition
              enter="transition duration-150 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-100 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <PopoverPanel className="absolute z-50 mt-5 w-60 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 py-3 grid grid-cols-1 overflow-hidden origin-top-left">
                  {categories.map((item) => (
                      <Link 
                          key={item.id} 
                          href={`/tours?category=${item.slug}`}
                          className="px-5 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary-600 transition-colors"
                      >
                          {item.name}
                      </Link>
                  ))}
              </PopoverPanel>
            </Transition>
          </Popover>
        )}

        {/* Kurumsal Dropdown */}
        <Popover className="relative">
          <PopoverButton className="flex items-center gap-1 hover:text-primary-600 transition-colors focus:outline-none outline-none">
            Kurumsal
            <ChevronDownIcon className="size-3.5" />
          </PopoverButton>
          <Transition
            enter="transition duration-150 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-in"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <PopoverPanel className="absolute z-50 mt-5 w-60 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 py-3 grid grid-cols-1 overflow-hidden origin-top-left">
                {CORPORATE_LINKS.map((item) => (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className="px-5 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-primary-600 transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </PopoverPanel>
          </Transition>
        </Popover>
      </ul>
    )
  }

  return (
    <div className={clsx("relative z-[100]", className)}>
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

            {user?.role !== 'AGENT' && (
              <div className="hidden md:block">
                <Link href="/become-an-agent" className="text-sm font-medium hover:text-primary-600 uppercase tracking-widest text-[11px] font-black">
                  Acente Ol
                </Link>
              </div>
            )}

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
