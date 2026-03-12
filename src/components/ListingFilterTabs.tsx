'use client'

import NcInputNumber from '@/components/NcInputNumber'
import { Button } from '@/shared/Button'
import ButtonClose from '@/shared/ButtonClose'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/shared/Checkbox'
import { Description, Fieldset, Label } from '@/shared/fieldset'
import T from '@/utils/getT'
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FilterVerticalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import clsx from 'clsx'
import { useState } from 'react'
import { PriceRangeSlider } from './PriceRangeSlider'

type CheckboxFilter = {
  label: string
  name: string
  tabUIType: 'checkbox'
  options: {
    name: string
    description?: string
    defaultChecked?: boolean
  }[]
}
type PriceRangeFilter = {
  name: string
  label: string
  tabUIType: 'price-range'
  min: number
  max: number
}
type SelectNumberFilter = {
  name: string
  label: string
  tabUIType: 'select-number'
  options: {
    name: string
    max: number
  }[]
}

const demo_filters_options = [
  {
    name: 'type-of-place',
    label: 'Type of place',
    tabUIType: 'checkbox',
    options: [
      {
        name: 'Entire place',
        value: 'entire_place',
        description: 'Have a place to yourself',
        defaultChecked: true,
      },
      {
        name: 'Private room',
        value: 'private_room',
        description: 'Have your own room and share some common spaces',
        defaultChecked: true,
      },
      {
        name: 'Hotel room',
        value: 'hotel_room',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Shared room',
        value: 'shared_room',
        description: 'Stay in a shared space, like a common room',
      },
    ],
  },
  {
    label: 'Price per day',
    name: 'price-per-day',
    tabUIType: 'price-range',
    min: 0,
    max: 1000,
  },
  {
    label: 'Rooms & Beds',
    name: 'rooms-beds',
    tabUIType: 'select-number',
    options: [
      { name: 'Beds', max: 10 },
      { name: 'Bedrooms', max: 10 },
      { name: 'Bathrooms', max: 10 },
    ],
  },
  {
    label: 'Amenities',
    name: 'amenities',
    tabUIType: 'checkbox',
    options: [
      {
        name: 'Kitchen',
        value: 'kitchen',
        description: 'Have a place to yourself',
        defaultChecked: true,
      },
      {
        name: 'Air conditioning',
        value: 'air_conditioning',
        description: 'Have your own room and share some common spaces',
        defaultChecked: true,
      },
      {
        name: 'Heating',
        value: 'heating',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Dryer',
        value: 'dryer',
        description: 'Stay in a shared space, like a common room',
      },
      {
        name: 'Washer',
        value: 'washer',
        description: 'Stay in a shared space, like a common room',
      },
    ],
  },
  {
    name: 'Facilities',
    label: 'Facilities',
    tabUIType: 'checkbox',
    options: [
      {
        name: 'Free parking on premise',
        value: 'free_parking_on_premise',
        description: 'Have a place to yourself',
      },
      {
        name: 'Hot tub',
        value: 'hot_tub',
        description: 'Have your own room and share some common spaces',
      },
      {
        name: 'Gym',
        value: 'gym',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Pool',
        value: 'pool',
        description: 'Stay in a shared space, like a common room',
      },
      {
        name: 'EV charger',
        value: 'ev_charger',
        description: 'Stay in a shared space, like a common room',
      },
    ],
  },
  {
    name: 'Property-type',
    label: 'Property type',
    tabUIType: 'checkbox',
    options: [
      {
        name: 'House',
        value: 'house',
        description: 'Have a place to yourself',
      },
      {
        name: 'Bed and breakfast',
        value: 'bed_and_breakfast',
        description: 'Have your own room and share some common spaces',
      },
      {
        name: 'Apartment',
        defaultChecked: true,
        value: 'apartment',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Boutique hotel',
        value: 'boutique_hotel',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Bungalow',
        value: 'bungalow',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Chalet',
        defaultChecked: true,
        value: 'chalet',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Condominium',
        defaultChecked: true,
        value: 'condominium',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Cottage',
        value: 'cottage',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Guest suite',
        value: 'guest_suite',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
      {
        name: 'Guesthouse',
        value: 'guesthouse',
        description: 'Have a private or shared room in a boutique hotel, hostel, and more',
      },
    ],
  },
  {
    name: 'House-rules',
    label: 'House rules',
    tabUIType: 'checkbox',
    options: [
      {
        name: 'Pets allowed',
        value: 'pets_allowed',
        description: 'Have a place to yourself',
      },
      {
        name: 'Smoking allowed',
        value: 'smoking_allowed',
        description: 'Have your own room and share some common spaces',
      },
    ],
  },
]

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const CheckboxPanel = ({ filterOption, className }: { filterOption: any; className?: string }) => {
  const searchParams = useSearchParams()
  const filterValuesArray = searchParams.getAll(`${filterOption.name}[]`)
  const filterValueSingle = searchParams.get(filterOption.name)
  const initialValues = [...filterValuesArray, ...(filterValueSingle ? [filterValueSingle] : [])]

  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues)

  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedValues(prev => [...prev, value])
    } else {
      setSelectedValues(prev => prev.filter(v => v !== value))
    }
  }

  return (
    <Fieldset>
      <CheckboxGroup className={clsx(className, "grid grid-cols-1 sm:grid-cols-2 gap-4")}>
        {filterOption.options.map((option: any) => {
          const isChecked = selectedValues.includes(option.value)
          return (
            <CheckboxField key={option.value} className="flex items-center gap-3 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-primary-500/30 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200 cursor-pointer group">
              <Checkbox
                checked={isChecked}
                onChange={(checked) => handleChange(option.value, checked)}
                className="size-4 rounded-lg border-neutral-300 transition-all duration-300 data-checked:bg-primary-600 cursor-pointer"
              />
              {/* Native hidden input for form submission */}
              <input type="checkbox" name={`${filterOption.name}[]`} value={option.value} checked={isChecked} readOnly className="sr-only" />
              <div className="flex flex-col">
                <Label className="text-sm font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer group-hover:text-primary-600 transition-colors">{option.name}</Label>
                {option.description && <Description className="text-xs text-neutral-500">{option.description}</Description>}
              </div>
            </CheckboxField>
          )
        })}
      </CheckboxGroup>
    </Fieldset>
  )
}
const PriceRagePanel = ({ filterOption: { min, max, name } }: { filterOption: PriceRangeFilter }) => {
  const searchParams = useSearchParams()
  const urlMin = searchParams.get('minPrice')
  const urlMax = searchParams.get('maxPrice')

  const [rangePrices, setRangePrices] = useState([
    urlMin ? Number(urlMin) : min,
    urlMax ? Number(urlMax) : max
  ])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Min Fiyat</label>
          <div className="flex items-center text-sm font-bold">
            <span className="mr-1 opacity-50">₺</span>
            {rangePrices[0].toLocaleString('tr-TR')}
          </div>
        </div>
        <div className="w-4 h-0.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
        <div className="flex-1 p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">Max Fiyat</label>
          <div className="flex items-center text-sm font-bold">
            <span className="mr-1 opacity-50">₺</span>
            {rangePrices[1].toLocaleString('tr-TR')}
          </div>
        </div>
      </div>
      <div className="px-2">
        <PriceRangeSlider defaultValue={rangePrices} onChange={setRangePrices} min={min} max={max} />
      </div>
      <input type="hidden" name="minPrice" value={rangePrices[0]} />
      <input type="hidden" name="maxPrice" value={rangePrices[1]} />
    </div>
  )
}
const NumberSelectPanel = ({ filterOption: { name, options } }: { filterOption: SelectNumberFilter }) => {
  const searchParams = useSearchParams()
  return (
    <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6">
      {options.map((option) => (
        <div key={option.name} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">{option.name}</span>
          <NcInputNumber
            inputName={option.name}
            max={option.max}
            defaultValue={Number(searchParams.get(option.name)) || 0}
          />
        </div>
      ))}
    </div>
  )
}

import { XMarkIcon } from '@heroicons/react/24/outline'

interface ListingFilterTabsProps {
  filterOptions?: any[]
  heading?: React.ReactNode
}

const ListingFilterTabs: React.FC<ListingFilterTabsProps> = ({
  filterOptions = demo_filters_options,
  heading,
}) => {
  const [showAllFilter, setShowAllFilter] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeFilters: { label: string; key: string; value?: string; type: string; icon?: React.ReactNode }[] = []

  // Extract from filterOptions
  filterOptions.forEach((opt: any) => {
    if (!opt) return
    if (opt.tabUIType === 'checkbox') {
      const values = [...searchParams.getAll(`${opt.name}[]`), ...searchParams.getAll(opt.name)]
      const uniqueValues = Array.from(new Set(values))
      uniqueValues.forEach(val => {
        const optionLabel = opt.options.find((o: any) => o.value === val || o.name === val)?.name || val
        activeFilters.push({ label: optionLabel, key: `${opt.name}[]`, value: val, type: 'checkbox' })
      })
    }
  })

  // ... (rest of filtering logic)
  const urlMin = searchParams.get('minPrice')
  const urlMax = searchParams.get('maxPrice')
  if (urlMin || urlMax) {
    activeFilters.push({
      label: `Fiyat: ${urlMin || 0}₺ - ${urlMax || 'Max'}₺`,
      key: 'price',
      type: 'price-range'
    })
  }

  const loc = searchParams.get('location')
  if (loc) {
    activeFilters.push({ label: loc, key: 'location', type: 'location' })
  }

  const adults = Number(searchParams.get('adults')) || 0
  const children = Number(searchParams.get('children')) || 0
  if (adults + children > 0) {
    activeFilters.push({
      label: `${adults + children} Misafir`,
      key: 'guests',
      type: 'guests'
    })
  }

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'price') {
      params.delete('minPrice')
      params.delete('maxPrice')
    } else if (key === 'guests') {
      params.delete('adults')
      params.delete('children')
      params.delete('infants')
    } else if (value) {
      // Remove specific value from both array and single key versions
      const keysToClean = [key, key.replace('[]', '')]
      keysToClean.forEach(k => {
        const allValues = params.getAll(k)
        params.delete(k)
        allValues.forEach(v => {
          if (v !== value) params.append(k, v)
        })
      })
    } else {
      params.delete(key)
      params.delete(key.replace('[]', ''))
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false })
  }

  const handleFormSubmitExplicit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams.toString())

    // Clear existing filters that are manageable in this dialog
    filterOptions.forEach(opt => {
      if (opt) {
        params.delete(`${opt.name}[]`)
        params.delete(opt.name)
      }
    })
    params.delete('minPrice')
    params.delete('maxPrice')

    // Add new values from form
    formData.forEach((value, key) => {
      if (value) {
        params.append(key, value as string)
      }
    })

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    setShowAllFilter(false)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Top Row: Heading and Trigger Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        {heading}

        <div className="flex items-center gap-3 self-start md:self-end">
          <Button
            onClick={() => setShowAllFilter(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-neutral-900 dark:border-neutral-200 hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-200 dark:hover:text-neutral-900 transition-all duration-300 font-black text-xs uppercase tracking-widest"
          >
            <HugeiconsIcon icon={FilterVerticalIcon} size={18} color="currentColor" strokeWidth={2} />
            <span>Filtreleri Düzenle</span>
            {activeFilters.length > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 bg-primary-600 text-white text-[10px] rounded-full">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-700 opacity-50" />

      {/* Second Row: Active Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:border-primary-500 transition-all duration-200"
              >
                <span>{filter.label}</span>
                <button
                  onClick={() => removeFilter(filter.key, filter.value)}
                  className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="ml-2 text-xs font-black text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          <div className="text-sm text-neutral-400 font-medium italic">Herhangi bir filtre seçilmedi.</div>
        )}
      </div>

      {/* Filter Dialog */}
      <Dialog
        open={showAllFilter}
        onClose={() => setShowAllFilter(false)}
        className="relative z-max"
      >
        <DialogBackdrop className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md transition-opacity duration-300" />
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <DialogPanel
            as="form"
            onSubmit={handleFormSubmitExplicit}
            className="flex flex-col w-full max-w-2xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-7 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Filtreleri Özelleştir</DialogTitle>
                <p className="text-xs text-neutral-500 font-medium mt-1">İstediğin kriterlere göre turları daralt.</p>
              </div>
              <ButtonClose onClick={() => setShowAllFilter(false)} />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-12">
              {filterOptions.map((opt, i) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary-600" />
                    <h4 className="text-lg font-black italic uppercase tracking-wider text-neutral-900 dark:text-neutral-100">{opt.label}</h4>
                  </div>
                  <div className="">
                    {opt.tabUIType === 'checkbox' && (
                      <CheckboxPanel filterOption={opt} />
                    )}
                    {opt.tabUIType === 'price-range' && (
                      <PriceRagePanel filterOption={opt} />
                    )}
                    {opt.tabUIType === 'select-number' && (
                      <NumberSelectPanel filterOption={opt} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-8 py-7 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-red-600 transition-all duration-300"
                style={{ cursor: 'pointer' }}
              >
                Tümünü Sıfırla
              </button>
              <ButtonPrimary type="submit" className="px-12 h-14 rounded-2xl shadow-xl shadow-primary-500/20 font-black uppercase tracking-widest text-xs">
                Filtreleri Uygula
              </ButtonPrimary>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default ListingFilterTabs
