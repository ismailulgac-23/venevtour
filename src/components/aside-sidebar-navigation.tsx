'use client'

import React, { useEffect, useState } from 'react'
import { getCurrencies, getLanguages, getNavigation } from '@/data/navigation'
import SidebarNavigation from './Header/Navigation/SidebarNavigation'
import Aside from './aside'

interface Props {
  className?: string
}

const AsideSidebarNavigation = ({ className }: Props) => {
  const [data, setData] = useState<{
    navigationMenu: any[],
    currencies: any[],
    languages: any[]
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const [navigationMenu, currencies, languages] = await Promise.all([
        getNavigation(),
        getCurrencies(),
        getLanguages()
      ])
      setData({ navigationMenu, currencies, languages })
    }
    fetchData()
  }, [])

  if (!data) return null

  return (
    <Aside openFrom="right" type="sidebar-navigation" logoOnHeading contentMaxWidthClassName="max-w-md">
      <div className="flex h-full flex-col">
        <div className="hidden-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6">
          <SidebarNavigation
            data={data.navigationMenu}
            currencies={data.currencies}
            languages={data.languages}
          />
        </div>
      </div>
    </Aside>
  )
}

export default AsideSidebarNavigation
