import Heading from '@/shared/Heading'
import { FC } from 'react'

const facts = [
  {
    id: '1',
    heading: '10 milyon',
    subHeading: 'Dünya çapında yayınlanan içerik ve makale sayısı',
  },
  {
    id: '2',
    heading: '100.000',
    subHeading: 'Kayıtlı aktif kullanıcı hesabı (Eylül 2025 itibarıyla)',
  },
  {
    id: '3',
    heading: '220+',
    subHeading: 'Hizmet verdiğimiz ülke ve bölge sayısı',
  },
]

interface SectionStatisticProps {
  className?: string
}

const SectionStatistic: FC<SectionStatisticProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Heading
        subheading="Bağımsız ve tarafsız bir yaklaşımla, her gün özgün ve 
          dünya standartlarında içerikler sunuyoruz"
      >
        🚀 Hızlı Bilgiler
      </Heading>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {facts.map((item) => (
          <div key={item.id} className="rounded-2xl bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-800">
            <h3 className="text-2xl leading-none font-semibold text-neutral-900 md:text-3xl dark:text-neutral-200">
              {item.heading}
            </h3>
            <span className="mt-3 block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">
              {item.subHeading}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionStatistic
