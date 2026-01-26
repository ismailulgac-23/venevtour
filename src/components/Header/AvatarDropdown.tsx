'use client'

import Avatar from '@/shared/Avatar'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  className?: string
}

export default function AvatarDropdown({ className }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const json = await res.json()
          setUser(json.data)
        }
      } catch (e) {
        console.error('User fetch error', e)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (!user) return null // Giriş yapmamışsa gösterme, Header 'Müşteri Paneli' butonu gösterecek

  const getDashboardLink = () => {
    if (user.role === 'ADMIN') return '/account/admin'
    if (user.role === 'AGENT') return '/account/agent'
    return '/account/customer'
  }

  const getDisplayName = () => {
    if (user.customerProfile) return `${user.customerProfile.firstName} ${user.customerProfile.lastName}`
    if (user.agentProfile) return user.agentProfile.companyName
    return user.email
  }

  return (
    <div className={className}>
      <Popover className="relative">
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800">
          <Avatar className="size-8" src={user.avatarUrl} />
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Avatar className="size-12" src={user.avatarUrl} />

              <div className="grow overflow-hidden">
                <h4 className="font-semibold truncate">{getDisplayName()}</h4>
                <p className="mt-0.5 text-xs truncate">{user.email}</p>
              </div>
            </div>

            <Divider />

            {/* ------------------ Hesabım (Dashboard) --------------------- */}
            <Link
              href={getDashboardLink()}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Hesabım</p>
            </Link>

            {/* ------------------ Acente Linkleri --------------------- */}
            {user.role === 'AGENT' && (
              <Link
                href={'/account/agent/create-tour'}
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Tur Ekle</p>
              </Link>
            )}

            {/* ------------------ Müşteri Linkleri --------------------- */}
            {/* MVP'de genel linkler */}

            <Divider />

            {/* ------------------ Dark Mode --------------------- */}
            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Karanlık Mod</p>
              </div>
              <SwitchDarkMode2 />
            </div>

            {/* ------------------ Çıkış Yap --------------------- */}
            <button
              onClick={handleLogout}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-orange-500/50 dark:hover:bg-neutral-700 w-full text-left cursor-pointer"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Çıkış Yap</p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
