import { Calendar01Icon, Comment01Icon, Timer02Icon } from '@/components/Icons'
import StartRating from '@/components/StartRating'
import { Divider } from '@/shared/divider'
import { Mail01Icon, Medal01Icon, SmartPhone01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import HostAvatar from './HostAvatar'
import { SectionHeading } from './SectionHeading'

interface Props {
  className?: string
  avatarUrl: string
  displayName: string
  handle: string
  rating: number
  reviewsCount: number
  listingsCount: number
  description: string
  joinedDate: string
  responseRate: number
  responseTime: string
  tursabNumber?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

const SectionHost = ({
  avatarUrl,
  className,
  description,
  displayName,
  handle,
  joinedDate,
  rating,
  responseRate,
  responseTime,
  reviewsCount,
  listingsCount,
  tursabNumber,
  contactEmail,
  contactPhone,
  address,
}: Props) => {
  return (
    <div className="listingSection__wrap p-8 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[40px] shadow-sm">
      {/* host */}
      <div className="flex items-center gap-x-5">
        <HostAvatar avatarUrl={avatarUrl} className="size-16" />
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {displayName}
          </h3>
          <div className="mt-2 flex items-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <StartRating point={rating.toFixed(1)} reviewCount={reviewsCount} />
            <span className="mx-2 text-neutral-300">•</span>
            <span>{listingsCount} Aktif Tur</span>
          </div>
        </div>
      </div>

      <Divider className="my-0!" />

      {/* TÜRSAB Verifikasyonu */}
      <div className="flex items-center gap-3 bg-primary-50/10 border border-primary-600/20 p-4 rounded-3xl">
        <div className="size-10 rounded-2xl bg-primary-600 flex items-center justify-center shrink-0">
          <HugeiconsIcon icon={Medal01Icon} size={20} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Resmi Turizm Acentesi</p>
          <p className="text-sm font-bold text-neutral-900 dark:text-white">TÜRSAB No: {tursabNumber}</p>
        </div>
      </div>

      {/* desc */}
      <p className="block leading-relaxed text-neutral-600 dark:text-neutral-400 font-medium">
        {description}
      </p>

      {/* info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="flex items-center gap-x-3 group">
          <div className="size-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-colors">
            <Calendar01Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Üyelik</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{joinedDate}&apos;den beri</span>
          </div>
        </div>

        <div className="flex items-center gap-x-3 group">
          <div className="size-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-colors">
            <Timer02Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Cevap Süresi</span>
            <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{responseTime}</span>
          </div>
        </div>

        {contactEmail && (
          <div className="flex items-center gap-x-3 group">
            <div className="size-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-colors">
              <HugeiconsIcon icon={Mail01Icon} size={20} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">E-Posta</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{contactEmail}</span>
            </div>
          </div>
        )}

        {contactPhone && (
          <div className="flex items-center gap-x-3 group">
            <div className="size-11 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-primary-600 transition-colors">
              <HugeiconsIcon icon={SmartPhone01Icon} size={20} strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Telefon</span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1">{contactPhone}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default SectionHost
