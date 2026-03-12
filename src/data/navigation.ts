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
  let categories: any[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/categories`)
    const json = await res.json()
    categories = json.data || []
  } catch (e) {
    console.error('Menu categories fetch error:', e)
  }

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
      id: 'categories',
      name: 'Kategoriler',
      type: 'dropdown',
      children: categories.map(c => ({
        id: c.id,
        name: c.name,
        href: `/tours?category=${c.slug}`
      }))
    },
    {
      id: 'corporate',
      name: 'Kurumsal',
      type: 'dropdown',
      children: [
        { id: 'cor1', name: 'Hakkımızda', href: '/about' },
        { id: 'cor2', name: 'Blog & Haberler', href: '/blog' },
        { id: 'cor3', name: 'Sıkça Sorulanlar (SSS)', href: '/faqs' },
        { id: 'cor4', name: 'Acenteler İçin', href: '/become-an-agent' },
        { id: 'cor5', name: 'İletişim', href: '/contact' },
      ]
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
