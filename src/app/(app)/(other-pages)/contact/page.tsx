import SectionSubscribe2 from '@/components/SectionSubscribe2'
import { Divider } from '@/shared/divider'
import SocialsList from '@/shared/SocialsList'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ContactForm from '@/components/ContactForm'

import { Facebook02Icon, InstagramIcon, NewTwitterIcon, Linkedin01Icon } from '@hugeicons/core-free-icons'

export const metadata: Metadata = {
  title: 'İletişim - Venevtour',
  description: 'Bizimle iletişime geçin. Venevtour ekibi olarak size yardımcı olmaktan mutluluk duyarız.',
}

const PageContact = async () => {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'global_settings' },
  })

  // Fallbacks if no settings are in DB yet
  const contactInfo = [
    {
      title: 'Adres',
      description: settings?.address || 'İstanbul, Türkiye',
    },
    {
      title: 'E-posta',
      description: settings?.email || 'destek@venevtour.com',
    },
    {
      title: 'Telefon',
      description: settings?.phone || '+90 (212) 123 45 67',
    },
  ]

  const socials = [
    { name: 'Facebook', href: settings?.facebook || '#', icon: Facebook02Icon },
    { name: 'Twitter', href: settings?.twitter || '#', icon: NewTwitterIcon },
    { name: 'Instagram', href: settings?.instagram || '#', icon: InstagramIcon },
    { name: 'Linkedin', href: settings?.linkedin || '#', icon: Linkedin01Icon },
  ].filter(s => s.href && s.href !== '#')

  return (
    <div className="pt-10 pb-24 sm:py-24 lg:py-32 bg-white dark:bg-neutral-900">
      <div className="container mx-auto max-w-7xl">
        <div className="grid shrink-0 grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
          <div className="space-y-12">
            <div>
              <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl tracking-tight text-neutral-900 dark:text-neutral-100">Bizimle İletişime Geçin</h1>
              <p className="mt-6 text-lg text-neutral-500 dark:text-neutral-400">
                Sorularınız, önerileriniz veya tur rezervasyonlarınız için bize ulaşabilirsiniz. Ekibimiz en kısa sürede size dönüş yapacaktır.
              </p>
            </div>
            
            <div className="mt-10 flex max-w-sm flex-col gap-y-10 sm:mt-16">
              {contactInfo.map((item, index) => (
                <div key={index} className="group">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2">{item.title}</h3>
                  <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200 block leading-snug group-hover:text-primary-600 transition-colors">
                    {item.description}
                  </span>
                </div>
              ))}
              
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">Sosyal Medya</h3>
                <SocialsList 
                  socials={socials}
                  className="mt-2" 
                  itemClass="size-10 flex items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-all font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 sm:p-10 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 text-neutral-900 dark:text-neutral-100">Bize Mesaj Gönderin</h2>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      <div className="container mt-20 lg:mt-32">
        <Divider className="opacity-50" />
        <SectionSubscribe2 className="mt-20 lg:mt-32" />
      </div>
    </div>
  )
}

export default PageContact
