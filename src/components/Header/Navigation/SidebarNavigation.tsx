'use client'

import { getCurrencies, getLanguages, TNavigationItem } from '@/data/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SocialsList from '@/shared/SocialsList'
import { Disclosure, DisclosureButton, DisclosurePanel, useClose } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import CurrLangDropdown from '../CurrLangDropdown'
import { useAuth } from '@/context/AuthContext'
import { FavouriteIcon, Task01Icon, UserIcon } from '@hugeicons/core-free-icons'

interface Props {
  data: TNavigationItem[]
  currencies: Awaited<ReturnType<typeof getCurrencies>>
  languages: Awaited<ReturnType<typeof getLanguages>>
}

const SidebarNavigation: React.FC<Props> = ({ data, currencies, languages }) => {
  const handleClose = useClose()
  const router = useRouter()
  const { user } = useAuth()

  // Prefetch the next step to improve performance
  useEffect(() => {
    router.prefetch('/stay-categories/all')
  }, [router])

  const _renderAccountMenu = () => {
    if (!user) {
      return (
        <div className="mb-6 mt-6 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-3xl border border-primary-100 dark:border-primary-900/20">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-3 text-balance">Hesabınıza erişerek rezervasyonlarınızı yönetin.</p>
          <Link
            href="/login"
            onClick={handleClose}
            className="flex items-center justify-center w-full py-3 bg-primary-600 text-white font-bold rounded-2xl text-sm"
          >
            Giriş Yap
          </Link>
        </div>
      )
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
      <div className="mb-4 mt-4">
        <div className="flex items-center gap-2.5 mb-2 px-3">
          <div className="size-1 w-1 rounded-full bg-primary-600 h-3" />
          <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
            {user.role === 'ADMIN' ? 'YÖNETİCİ PANELİ' : user.role === 'AGENT' ? 'ACENTE PANELİ' : 'HESABIM'}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 gap-0.5">
          {navigation.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={handleClose}
              className="flex items-center p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
            >
              <div className="size-8 flex shrink-0 items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-600 transition-colors">
                <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.5} />
              </div>
              <span className="ms-3 text-sm font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Handle form submission
  const handleSubmitForm = async (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries())
    // Handle form submission logic here
    console.log('Form submitted:', formObject)
    const searchQuery = formObject.search as string
    // Close the popover
    handleClose()
    // Redirect to the search page
    router.push('/stay-categories/all' + (searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''))
  }

  const _renderMenuChild = (
    item: TNavigationItem,
    itemClass = 'pl-3 text-neutral-900 dark:text-neutral-200 font-medium'
  ) => {
    return (
      <ul className="nav-mobile-sub-menu pb-1 pl-6 text-base">
        {item.children?.map((childMenu, index) => (
          <Disclosure key={index} as="li">
            <Link
              href={childMenu.href || '#'}
              onClick={handleClose}
              className={`mt-0.5 flex rounded-lg pr-4 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${itemClass}`}
            >
              <span className={`py-2.5 ${!childMenu.children ? 'block w-full' : ''}`}>{childMenu.name}</span>
              {childMenu.children && (
                <span className="flex grow items-center" onClick={(e) => e.preventDefault()}>
                  <DisclosureButton as="span" className="flex grow justify-end">
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-neutral-500" aria-hidden="true" />
                  </DisclosureButton>
                </span>
              )}
            </Link>
            {childMenu.children && (
              <DisclosurePanel>
                {_renderMenuChild(childMenu, 'pl-3 text-neutral-600 dark:text-neutral-400')}
              </DisclosurePanel>
            )}
          </Disclosure>
        ))}
      </ul>
    )
  }

  const _renderItem = (menu: TNavigationItem, index: number) => {
    return (
      <Disclosure key={index} as="li" className="text-neutral-900 dark:text-white">
        <DisclosureButton className="flex w-full cursor-pointer rounded-lg px-3 text-start text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Link
            href={menu.href || '#'}
            className={clsx(!menu.children?.length && 'flex-1', 'block py-2.5')}
            onClick={handleClose}
          >
            {menu.name}
          </Link>
          {menu.children?.length && (
            <div className="flex flex-1 justify-end">
              <ChevronDownIcon className="ml-2 h-4 w-4 self-center text-neutral-500" aria-hidden="true" />
            </div>
          )}
        </DisclosureButton>
        {menu.children && <DisclosurePanel>{_renderMenuChild(menu)}</DisclosurePanel>}
      </Disclosure>
    )
  }



  return (
    <div>
      <span className="text-sm text-neutral-500 font-medium leading-relaxed block mb-4">Hayalinizdeki turu keşfedin, benzersiz deneyimlere adım atın ve anılarınızı paylaşın.</span>

      {_renderAccountMenu()}

      <div className="flex items-center justify-between">
        <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
      </div>
      <ul className="flex flex-col gap-y-1 px-2 py-6">{data?.map(_renderItem)}</ul>
      <Divider className="mb-6" />

      <div className="py-6 border-t dark:border-neutral-800">
        <ButtonPrimary
          href="/tours"
          className="text-sm font-bold w-full h-14 rounded-2xl shadow-xl shadow-primary-600/10"
        >
          Turları Keşfet
        </ButtonPrimary>
      </div>
    </div>
  )
}

export default SidebarNavigation
