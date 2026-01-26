'use client'

import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import T from '@/utils/getT'
import clsx from 'clsx'
import { FC, useState } from 'react'
import DatePicker from 'react-datepicker'

interface Props {
  className?: string
  onChange?: (value: [Date | null, Date | null]) => void
  defaultStartDate?: Date | null
  defaultEndDate?: Date | null
}

const StayDatesRangeInput: FC<Props> = ({ className, defaultEndDate, defaultStartDate, onChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate || new Date())
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (onChange) {
      onChange([start, end])
    }
  }

  return (
    <>
      <div className={clsx(className)}>
        <h3 className="block text-center text-xl font-bold sm:text-2xl tracking-tight">
          Seyahatiniz ne zaman?
        </h3>
        <div className="relative z-10 flex shrink-0 justify-center py-5">
          <DatePicker
            selected={startDate}
            onChange={onChangeDate}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            monthsShown={2}
            showPopperArrow={false}
            inline
            renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
            renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
          />
        </div>
      </div>

      {/* input:hidde */}
      <input type="hidden" name="startDate" value={startDate ? startDate.toISOString().split('T')[0] : ''} />
      <input type="hidden" name="endDate" value={endDate ? endDate.toISOString().split('T')[0] : ''} />
    </>
  )
}

export default StayDatesRangeInput
