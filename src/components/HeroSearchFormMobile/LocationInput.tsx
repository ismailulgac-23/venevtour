'use client'

import { Search01Icon } from '@/components/Icons'
import { MapPinIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'

interface Props {
  onClick?: () => void
  onChange?: (value: string) => void
  className?: string
  defaultValue?: string
  headingText?: string
  imputName?: string
}

const LocationInput: FC<Props> = ({
  onChange,
  className,
  defaultValue = '',
  headingText = 'Nereye gidiyoruz?',
  imputName = 'location',
}) => {
  const [value, setValue] = useState('')
  const [popularLocations, setPopularLocations] = useState<string[]>(['İstanbul', 'Antalya', 'Kapadokya', 'İzmir', 'Bursa'])
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setPopularLocations(json.data)
        }
      })
      .catch(() => { })
  }, [])

  const handleSelectLocation = (item: string) => {
    // DO NOT REMOVE SETTIMEOUT FUNC
    setTimeout(() => {
      setValue(item)
      onChange && onChange(item)
    }, 0)
  }

  const renderSearchValues = ({ heading, items }: { heading: string; items: string[] }) => {
    return (
      <>
        <p className="block text-base font-bold">{heading}</p>
        <div className="mt-3">
          {items.map((item) => {
            return (
              <div
                className="mb-1 flex items-center gap-x-3 py-2 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl px-2 transition-colors"
                onClick={() => handleSelectLocation(item)}
                key={item}
              >
                <MapPinIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                <span className="font-medium">{item}</span>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  const filteredLocations = popularLocations.filter(loc =>
    loc.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className={clsx(className)} ref={containerRef}>
      <h3 className="text-xl font-bold sm:text-2xl tracking-tight">{headingText}</h3>
      <div className="relative mt-5">
        <input
          className="block w-full truncate rounded-2xl border border-neutral-200 bg-white px-4 py-4 pe-12 leading-none font-medium placeholder-neutral-400 focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 sm:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:placeholder-neutral-500 outline-none transition-all"
          placeholder="Şehir veya bölge ara..."
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          ref={inputRef}
          name={imputName}
          autoComplete="off"
          autoFocus
          data-autofocus
        />
        <span className="absolute end-4 top-1/2 -translate-y-1/2">
          <Search01Icon className="h-6 w-6 text-neutral-400" />
        </span>
      </div>
      <div className="mt-7">
        {value
          ? // if input value is not empty, show suggestions based on input
          renderSearchValues({
            heading: 'Sonuçlar',
            items: filteredLocations.length > 0 ? filteredLocations : ['Sonuç bulunamadı'],
          })
          : // if input value is empty, show popular destinations suggestions
          renderSearchValues({
            heading: 'Popüler Destinasyonlar',
            items: popularLocations.slice(0, 8),
          })}
      </div>
    </div>
  )
}

export default LocationInput
