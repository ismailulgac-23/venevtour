'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function ContactForm() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (result.success) {
                toast.success(result.message)
                ;(e.target as HTMLFormElement).reset()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Mesajınız gönderilemedi. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <Field className="block">
                <Label>Ad Soyad</Label>
                <Input name="name" required placeholder="Örn: Ahmet Yılmaz" type="text" className="mt-1" />
            </Field>
            <Field className="block">
                <Label>E-posta Adresi</Label>
                <Input name="email" required type="email" placeholder="ornek@mail.com" className="mt-1" />
            </Field>
            <Field className="block">
                <Label>Mesajınız</Label>
                <Textarea name="message" required placeholder="Size nasıl yardımcı olabiliriz?" className="mt-1" rows={6} />
            </Field>
            <div>
                <ButtonPrimary loading={loading} type="submit" className="w-full sm:w-auto">Mesajı Gönder</ButtonPrimary>
            </div>
        </form>
    )
}
