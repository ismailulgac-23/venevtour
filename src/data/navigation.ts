// TNavigationItem type is defined below
export type TNavigationItem = Partial<{
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}>

export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    {
      id: '1',
      href: '/',
      name: 'Anasayfa',
    },
    {
      id: '2',
      href: '/tours',
      name: 'Turlar',
    },
    {
      id: '3',
      href: '/become-an-agent',
      name: 'Acente Başvurusu'
    },
    {
      id: '4',
      href: '/account',
      name: 'Hesabım'
    }
  ]
}

export async function getNavMegaMenu(): Promise<TNavigationItem> {
  // Return empty or dummy to prevent crash if Header expects it
  return {
    id: 'template',
    name: 'Templates',
    children: []
  }
}

export const getLanguages = async () => {
  return [
    {
      id: 'Turkish',
      name: 'Türkçe',
      description: 'Türkiye',
      href: '#',
      active: true,
    },
    {
      id: 'English',
      name: 'English',
      description: 'Global',
      href: '#',
    },
  ]
}

export const getCurrencies = async () => {
  return [
    {
      id: 'TRY',
      name: 'TRY',
      href: '#',
      icon: '₺',
      active: true,
    },
    {
      id: 'USD',
      name: 'USD',
      href: '#',
      icon: '$',
    },
  ]
}
