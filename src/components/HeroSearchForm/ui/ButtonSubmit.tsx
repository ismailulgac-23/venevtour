import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { FC } from 'react'

const styles = {
  base: 'flex lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:end-2 xl:end-4 shrink-0 items-center justify-center rounded-full bg-primary-600 text-neutral-50 hover:bg-primary-700 focus:outline-hidden cursor-pointer transition-all duration-200 z-10 shadow-xl shadow-primary-500/10',
  default: 'size-14 lg:size-16',
  small: 'size-12 lg:size-14',
}

interface Props {
  className?: string
  fieldStyle: 'default' | 'small'
}

export const ButtonSubmit: FC<Props> = ({ className, fieldStyle = 'default' }) => {
  return (
    <button type="submit" className={clsx(styles.base, styles[fieldStyle], className)}>
      <HugeiconsIcon icon={Search01Icon} size={24} strokeWidth={2.5} />
    </button>
  )
}
