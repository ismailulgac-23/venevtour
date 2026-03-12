'use client'

import T from '@/utils/getT'
import clsx from 'clsx'
import { usePathname, useRouter } from 'next/navigation'
import { ButtonSubmit, DateRangeField, GuestNumberField, LocationInputField, VerticalDividerLine } from './ui'

interface Props {
    className?: string
    formStyle: 'default' | 'small'
}

export const ToursSearchForm = ({ className, formStyle = 'default' }: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const formDataEntries = Object.fromEntries(formData.entries())

        const params = new URLSearchParams()

        if (formDataEntries['location']) params.set('location', formDataEntries['location'] as string)
        if (formDataEntries['checkin']) params.set('checkin', formDataEntries['checkin'] as string)
        if (formDataEntries['checkout']) params.set('checkout', formDataEntries['checkout'] as string)
        if (formDataEntries['guestAdults']) params.set('adults', formDataEntries['guestAdults'] as string)
        if (formDataEntries['guestChildren']) params.set('children', formDataEntries['guestChildren'] as string)
        if (formDataEntries['guestInfants']) params.set('infants', formDataEntries['guestInfants'] as string)

        const targetUrl = `/tours?${params.toString()}`
        const isCurrentPage = pathname === '/tours'

        router.push(targetUrl, { scroll: !isCurrentPage })
    }

    return (
        <form
            className={clsx(
                'relative z-20 flex w-full flex-col lg:flex-row lg:items-center rounded-3xl lg:rounded-full bg-white shadow-xl [--form-bg:var(--color-white)] dark:bg-neutral-800 dark:shadow-2xl dark:[--form-bg:var(--color-neutral-800)]',
                className,
                formStyle === 'small' && 'custom-shadow-1',
                formStyle === 'default' && 'shadow-xl dark:shadow-2xl'
            )}
            onSubmit={handleOnSubmit}
        >
            <LocationInputField className="lg:flex-5/12 border-b lg:border-b-0 border-neutral-100 dark:border-neutral-700" fieldStyle={formStyle} />
            <div className="hidden lg:block h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
            <DateRangeField
                className="lg:flex-4/12 border-b lg:border-b-0 border-neutral-100 dark:border-neutral-700"
                fieldStyle={formStyle}
                description={"Ne Zaman?"}
            />
            <div className="hidden lg:block h-8 w-px bg-neutral-200 dark:bg-neutral-700" />
            <GuestNumberField
                className="lg:flex-4/12"
                clearDataButtonClassName={clsx(formStyle === 'small' && 'sm:end-18', formStyle === 'default' && 'sm:end-22')}
                fieldStyle={formStyle}
            />

            <div className="flex items-center justify-center p-4 lg:p-0">
                <ButtonSubmit fieldStyle={formStyle} />
            </div>
        </form>
    )
}
