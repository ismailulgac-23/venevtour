'use client'

import Avatar from '@/shared/Avatar'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface Props {
  className?: string
}

export default function AvatarDropdown({ className }: Props) {
  const router = useRouter()
  const { user, refreshUser } = useAuth()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    await refreshUser()
    router.push('/')
    router.refresh()
  }

  if (!user) return null

  const getDisplayName = () => {
    if (user.customerProfile) return `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
    if (user.agentProfile) return user.agentProfile.companyName
    return user.email
  }

  const getFirstName = () => {
    if (user.customerProfile?.firstName) return user.customerProfile.firstName
    if (user.agentProfile?.contactName) return user.agentProfile.contactName.split(' ')[0]
    return user.email.split('@')[0]
  }

  const commonNav = [
    { title: 'Hesabım', href: user.role === 'AGENT' ? '/account/agent' : user.role === 'ADMIN' ? '/account/admin' : '/account/customer', icon: UserIcon },
    { title: 'Profilim', href: user.role === 'AGENT' ? '/account/agent/profile' : user.role === 'ADMIN' ? '/account/admin/profile' : '/account/customer/profile', icon: UserIcon },
  ]

  const customerNav = [
    ...commonNav,
    { title: 'Rezervasyonlarım', href: '/account/customer/reservations', icon: Task01Icon },
    { title: 'Favorilerim', href: '/account-savelists', icon: FavouriteIcon },
  ]

  const agentNav = [
    ...commonNav,
    { title: 'Turlarımı Yönet', href: '/account/agent/tours', icon: Task01Icon },
    { title: 'Tur Ekle', href: '/account/agent/create-tour', icon: Task01Icon },
    { title: 'Rezervasyonlar', href: '/account/agent/reservations', icon: Task01Icon },
    { title: 'Komisyon Oranım', href: '/account/agent/commission', icon: Task01Icon },
  ]

  const adminNav = [
    ...commonNav,
    { title: 'Tüm Turlar', href: '/account/admin/tours', icon: Task01Icon },
    { title: 'Acenteler', href: '/account/admin/agents', icon: Task01Icon },
    { title: 'Rezervasyonlar', href: '/account/admin/reservations', icon: Task01Icon },
    { title: 'Kazanç Raporu', href: '/account/admin/revenue', icon: Task01Icon },
  ]

  const navigation = user.role === 'ADMIN' ? adminNav : user.role === 'AGENT' ? agentNav : customerNav

  return (
    <div className={className}>
      <Popover className="relative">
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center gap-3 rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800 pr-5 group">
          <Avatar className="size-9 ring-2 ring-white dark:ring-neutral-900 shadow-sm" src={user.avatarUrl} />
          <div className="hidden lg:flex flex-col items-start leading-none gap-1 pl-1">
            <span className="text-[10px] font-medium text-neutral-400 group-hover:text-primary-600 transition-colors">Hoşgeldiniz,</span>
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              {getFirstName()}
            </span>
          </div>
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 12,
          }}
          className="z-[105] w-72 rounded-3xl shadow-2xl ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0 bg-white dark:bg-neutral-800 overflow-hidden"
        >
          <div className="relative flex flex-col p-4 bg-white dark:bg-neutral-800 max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="size-10" src={user.avatarUrl} />
              <div className="grow overflow-hidden">
                <h4 className="font-bold truncate text-sm text-neutral-900 dark:text-neutral-100">{getDisplayName()}</h4>
                <p className="mt-0.5 text-[11px] truncate text-neutral-500 dark:text-neutral-400">{user.email}</p>
              </div>
            </div>

            <Divider className="mb-4" />

            {/* Role Header */}
            <div className="mb-2 px-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-md">
                {user.role === 'ADMIN' ? 'YÖNETİCİ PANELİ' : user.role === 'AGENT' ? 'ACENTE PANELİ' : 'MÜŞTERİ HESABI'}
              </span>
            </div>

            {/* Navigation Items */}
            <div className="grid grid-cols-1 gap-0.5">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors group"
                >
                  <div className="size-8 flex shrink-0 items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:text-primary-600 transition-colors">
                    <HugeiconsIcon icon={item.icon} size={16} strokeWidth={1.5} />
                  </div>
                  <span className="ms-3 text-sm font-bold text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>

            <Divider className="my-4" />

            {/* Settings & Logout */}
            <div className="space-y-0.5">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors group">
                <div className="flex items-center">
                  <div className="size-8 flex shrink-0 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/30 group-hover:text-orange-600 transition-colors">
                    <HugeiconsIcon icon={Idea01Icon} size={16} strokeWidth={1.5} />
                  </div>
                  <span className="ms-3 text-sm font-bold text-neutral-700 dark:text-neutral-200 uppercase tracking-tight">Karanlık Mod</span>
                </div>
                <SwitchDarkMode2 />
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group text-left"
              >
                <div className="size-8 flex shrink-0 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 transition-colors">
                  <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.5} />
                </div>
                <span className="ms-3 text-sm font-bold text-neutral-700 dark:text-neutral-200 group-hover:text-red-700 dark:group-hover:text-red-400">Çıkış Yap</span>
              </button>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
