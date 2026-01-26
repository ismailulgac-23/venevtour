'use client'

import NcInputNumber from '@/components/NcInputNumber'
import { GuestsObject } from '@/type'
import T from '@/utils/getT'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'

interface Props {
  defaultValue?: GuestsObject
  onChange?: (data: GuestsObject) => void
  className?: string
}

const GuestsInput: FC<Props> = ({ defaultValue, onChange, className }) => {
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(defaultValue?.guestAdults || 0)
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(defaultValue?.guestChildren || 0)
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(defaultValue?.guestInfants || 0)

  useEffect(() => {
    setGuestAdultsInputValue(defaultValue?.guestAdults || 0)
  }, [defaultValue?.guestAdults])
  useEffect(() => {
    setGuestChildrenInputValue(defaultValue?.guestChildren || 0)
  }, [defaultValue?.guestChildren])
  useEffect(() => {
    setGuestInfantsInputValue(defaultValue?.guestInfants || 0)
  }, [defaultValue?.guestInfants])

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    let newValue = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    }
    if (type === 'guestAdults') {
      setGuestAdultsInputValue(value)
      newValue.guestAdults = value
    }
    if (type === 'guestChildren') {
      setGuestChildrenInputValue(value)
      newValue.guestChildren = value
    }
    if (type === 'guestInfants') {
      setGuestInfantsInputValue(value)
      newValue.guestInfants = value
    }
    onChange && onChange(newValue)
  }

  return (
    <div className={clsx(`relative flex flex-col`, className)}>
      <h3 className="mb-5 block text-xl font-bold sm:text-2xl tracking-tight">Kaç kişi katılıyor?</h3>
      <NcInputNumber
        className="w-full"
        defaultValue={guestAdultsInputValue}
        onChange={(value) => handleChangeData(value, 'guestAdults')}
        max={20}
        label="Yetişkin"
        description="13 yaş ve üzeri"
        inputName="guestAdults"
      />
      <NcInputNumber
        className="mt-6 w-full"
        defaultValue={guestChildrenInputValue}
        onChange={(value) => handleChangeData(value, 'guestChildren')}
        max={20}
        label="Çocuk"
        description="2-12 yaş"
        inputName="guestChildren"
      />

      <NcInputNumber
        className="mt-6 w-full"
        defaultValue={guestInfantsInputValue}
        onChange={(value) => handleChangeData(value, 'guestInfants')}
        max={20}
        label="Bebek"
        description="0-2 yaş"
        inputName="guestInfants"
      />
    </div>
  )
}

export default GuestsInput
