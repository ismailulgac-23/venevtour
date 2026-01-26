'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const PageNavigation = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const commonNav = [
    { title: 'Hesabım', href: user.role === 'AGENT' ? '/account/agent' : user.role === 'ADMIN' ? '/account/admin' : '/account/customer' },
    { title: 'Profil Bilgilerim', href: user.role === 'AGENT' ? '/account/agent/profile' : user.role === 'ADMIN' ? '/account/admin/profile' : '/account/customer/profile' },
    { title: 'Şifre Değiştir', href: '/account-password' },
  ]

  const customerNav = [
    ...commonNav,
    { title: 'Rezervasyonlarım', href: '/account/customer/reservations' },
    { title: 'Favorilerim', href: '/account-savelists' },
    { title: 'Ödemelerim', href: '/account-billing' },
  ]

  const agentNav = [
    ...commonNav,
    { title: 'Turlarımı Yönet', href: '/account/agent/tours' },
    { title: 'Rezervasyonlar', href: '/account/agent/reservations' },
    { title: 'Komisyon Oranım', href: '/account/agent/commission' },
  ]

  const adminNav = [
    ...commonNav,
    { title: 'Tüm Turlar', href: '/account/admin/tours' },
    { title: 'Acenteler', href: '/account/admin/agents' },
    { title: 'Rezervasyonlar', href: '/account/admin/reservations' },
  ]

  const navigation = user.role === 'ADMIN' ? adminNav : user.role === 'AGENT' ? agentNav : customerNav

  return (
    <div className="container">
      <div className="hidden-scrollbar flex gap-x-8 overflow-x-auto md:gap-x-14">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href + item.title}
              href={item.href}
              className={`block shrink-0 border-b-2 py-5 capitalize md:py-8 ${isActive ? 'border-primary-500 font-medium' : 'border-transparent'
                }`}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
