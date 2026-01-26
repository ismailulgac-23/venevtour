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
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.type === 'email' ? 'email' : 'password']: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Giriş yapılamadı.')
      }

      // Başarılı giriş
      router.push('/')
      router.refresh()
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
          Giriş Yap
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
            {error}
          </div>
        )}

        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">E-posta Adresi</Label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              className="mt-1"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Field>
          <Field className="block">
            <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              <Label>Şifre</Label>
              <Link href="/forgot-password" className="text-sm font-medium underline">
                Şifremi Unuttum?
              </Link>
            </div>
            <Input
              type="password"
              className="mt-1"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Field>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </ButtonPrimary>
        </form>

        {/* ==== */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Yeni kullanıcı mısın? {` `}
          <Link href="/signup" className="font-medium underline">
            Hesap Oluştur
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
