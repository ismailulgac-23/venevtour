"use client"

import React, { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })

  // Tek form input handler'ı
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Kayıt yapılamadı.')
      }

      // Başarılı kayıt -> login'e yönlendir
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Logo className="w-32" />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <h2 className="text-center text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Hesap Oluştur (Müşteri)
        </h2>

        <p className="text-center text-sm text-neutral-500">
          Acente olmak mı istiyorsunuz? <Link href="/become-an-agent" className="text-primary-600 underline">Acente Başvurusu</Link>
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {error}
          </div>
        )}

        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>

          <div className="grid grid-cols-2 gap-4">
            <Field className="block">
              <Label>Ad</Label>
              <Input
                name="firstName"
                placeholder="Adınız"
                className="mt-1"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </Field>
            <Field className="block">
              <Label>Soyad</Label>
              <Input
                name="lastName"
                placeholder="Soyadınız"
                className="mt-1"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </Field>
          </div>

          <Field className="block">
            <Label>E-posta Adresi</Label>
            <Input
              type="email"
              name="email"
              placeholder="ornek@email.com"
              className="mt-1"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Field>

          <Field className="block">
            <Label>Telefon</Label>
            <Input
              type="tel"
              name="phone"
              placeholder="0555..."
              className="mt-1"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </Field>

          <Field className="block">
            <Label>Şifre</Label>
            <Input
              type="password"
              name="password"
              className="mt-1"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Field>

          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Devam Et'}
          </ButtonPrimary>
        </form>

        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Zaten hesabın var mı? {` `}
          <Link href="/login" className="font-medium underline">
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
