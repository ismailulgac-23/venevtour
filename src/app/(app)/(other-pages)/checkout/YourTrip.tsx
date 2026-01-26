'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import NcInputNumber from '@/components/NcInputNumber'
import { GuestsObject } from '@/type'
import converSelectedDateToString from '@/utils/converSelectedDateToString'

const YourTrip = ({ guestCount }: { guestCount?: number }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000))
  const [guests, setGuests] = useState<GuestsObject>({
    guestAdults: guestCount || 1,
    guestChildren: 0,
    guestInfants: 0,
  })

  useEffect(() => {
    if (guestCount) {
      setGuests({
        guestAdults: guestCount,
        guestChildren: 0,
        guestInfants: 0
      })
    }
  }, [guestCount])

  const handleGuestChange = (value: number, type: keyof GuestsObject) => {
    setGuests(prev => ({ ...prev, [type]: value }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Tur Detayları</h3>
      <div className="flex flex-col md:flex-row gap-4">
        {/* DATE POPOVER */}
        <Popover className="relative flex-1">
          {({ open }) => (
            <>
              <PopoverButton
                className={`w-full flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-800/20 rounded-2xl border transition-all text-left group ${open ? 'border-primary-600 ring-2 ring-primary-600/10' : 'border-neutral-100 dark:border-neutral-800'
                  }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-neutral-400 leading-none">Tarih Aralığı</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                    {startDate ? converSelectedDateToString([startDate, endDate]) : 'Seçiniz'}
                  </span>
                </div>
                <PencilSquareIcon className={`size-5 transition-colors ${open ? 'text-primary-600' : 'text-neutral-400'}`} />
              </PopoverButton>

              <PopoverPanel className="absolute z-50 mt-3 p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl ring-1 ring-black/5 left-0 md:left-auto md:right-0">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    const [start, end] = dates
                    setStartDate(start)
                    setEndDate(end)
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  monthsShown={2}
                  showPopperArrow={false}
                  inline
                  renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
                  renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
                />
              </PopoverPanel>
            </>
          )}
        </Popover>

        {/* GUESTS POPOVER */}
        <Popover className="relative flex-1">
          {({ open }) => (
            <>
              <PopoverButton
                className={`w-full flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-800/20 rounded-2xl border transition-all text-left group ${open ? 'border-primary-600 ring-2 ring-primary-600/10' : 'border-neutral-100 dark:border-neutral-800'
                  }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-neutral-400 leading-none">Katılımcı Sayısı</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                    {`${(guests.guestAdults || 0) + (guests.guestChildren || 0)} Kişi, ${guests.guestInfants || 0} Bebek`}
                  </span>
                </div>
                <PencilSquareIcon className={`size-5 transition-colors ${open ? 'text-primary-600' : 'text-neutral-400'}`} />
              </PopoverButton>

              <PopoverPanel className="absolute z-50 mt-3 w-80 p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-xl ring-1 ring-black/5 right-0">
                <div className="flex flex-col gap-6">
                  <NcInputNumber
                    label="Yetişkin"
                    description="13 yaş ve üzeri"
                    defaultValue={guests.guestAdults}
                    onChange={(v) => handleGuestChange(v, 'guestAdults')}
                    min={1}
                  />
                  <NcInputNumber
                    label="Çocuk"
                    description="2 - 12 yaş arası"
                    defaultValue={guests.guestChildren}
                    onChange={(v) => handleGuestChange(v, 'guestChildren')}
                  />
                  <NcInputNumber
                    label="Bebek"
                    description="0 - 2 yaş arası"
                    defaultValue={guests.guestInfants}
                    onChange={(v) => handleGuestChange(v, 'guestInfants')}
                  />
                </div>
              </PopoverPanel>
            </>
          )}
        </Popover>
      </div>

      <input type="hidden" name="guestAdults" value={guests.guestAdults} />
      <input type="hidden" name="guestChildren" value={guests.guestChildren} />
      <input type="hidden" name="guestInfants" value={guests.guestInfants} />
      <input type="hidden" name="startDate" value={startDate ? startDate.toISOString() : ''} />
      <input type="hidden" name="endDate" value={endDate ? endDate.toISOString() : ''} />
    </div>
  )
}

export default YourTrip
