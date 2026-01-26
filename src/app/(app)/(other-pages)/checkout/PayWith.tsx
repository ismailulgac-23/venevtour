'use client'

import { Description, Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { MasterCardIcon, PaypalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

const PayWith = () => {
  const [paymentMethod, setPaymentMethod] = React.useState('creditCard')

  return (
    <div className="space-y-6">
      <TabGroup
        defaultIndex={1}
        onChange={(index) => {
          setPaymentMethod(index === 0 ? 'paypal' : 'creditCard')
        }}
      >
        <TabList className="flex gap-2">
          <Tab className="flex items-center gap-x-2 rounded-2xl px-6 py-3 text-sm font-semibold border-2 border-transparent data-selected:bg-neutral-900 data-selected:text-white data-hover:bg-neutral-100 transition-all outline-none">
            Paypal
            <HugeiconsIcon icon={PaypalIcon} size={20} strokeWidth={1.5} />
          </Tab>
          <Tab className="flex items-center gap-x-2 rounded-2xl px-6 py-3 text-sm font-semibold border-2 border-transparent data-selected:bg-neutral-900 data-selected:text-white data-hover:bg-neutral-100 transition-all outline-none">
            Kredi Kartı
            <HugeiconsIcon icon={MasterCardIcon} size={20} strokeWidth={1.5} />
          </Tab>
        </TabList>

        <TabPanels className="mt-8">
          <TabPanel className="flex flex-col gap-6">
            <Field className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 px-1">Paypal E-Posta</Label>
              <Input name="email" type="email" placeholder="ornek@mail.com" className="h-14 rounded-2xl bg-white border-neutral-200" />
            </Field>
            <Field className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 px-1">Notunuz (İsteğe bağlı)</Label>
              <Textarea name="message" rows={3} placeholder="Acenteye iletmek istediğiniz bir not var mı?" className="rounded-2xl bg-white border-neutral-200" />
            </Field>
          </TabPanel>

          <TabPanel className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field className="md:col-span-2 space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 px-1">Kart Numarası</Label>
                <Input name="card-number" placeholder="0000 0000 0000 0000" className="h-14 rounded-2xl bg-white border-neutral-200" />
              </Field>
              <Field className="md:col-span-2 space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 px-1">Kart Üzerindeki İsim</Label>
                <Input name="card-holder" placeholder="AD SOYAD" className="h-14 rounded-2xl bg-white border-neutral-200" />
              </Field>
              <Field className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 px-1">Son Kullanma (AA/YY)</Label>
                <Input name="expiration-date" placeholder="01/26" className="h-14 rounded-2xl bg-white border-neutral-200" />
              </Field>
              <Field className="space-y-2">
                <Label className="text-xs font-semibold text-neutral-500 px-1">CVC</Label>
                <Input name="CVC" placeholder="000" className="h-14 rounded-2xl bg-white border-neutral-200" />
              </Field>
            </div>
            <Field className="space-y-2">
              <Label className="text-xs font-semibold text-neutral-500 px-1">Notunuz (İsteğe bağlı)</Label>
              <Textarea name="message" rows={3} placeholder="Acenteye iletmek istediğiniz bir not var mı?" className="rounded-2xl bg-white border-neutral-200" />
            </Field>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <input type="hidden" name="paymentMethod" value={paymentMethod} />
    </div>
  )
}

export default PayWith
