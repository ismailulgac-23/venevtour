'use client'

import React, { useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { Field, Label } from '@/shared/fieldset'
import toast from 'react-hot-toast'

const PasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor.')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })
      if (res.ok) {
        toast.success('Şifreniz başarıyla güncellendi.')
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const err = await res.json()
        toast.error(err.message || 'Şifre güncellenemedi.')
      }
    } catch (error) {
      toast.error('Bağlantı hatası.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Şifre Değiştir</h2>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">Hesap güvenliğiniz için şifrenizi düzenli olarak güncelleyin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field className="space-y-1">
          <Label>Mevcut Şifre</Label>
          <Input
            type="password"
            required
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          />
        </Field>

        <Field className="space-y-1">
          <Label>Yeni Şifre</Label>
          <Input
            type="password"
            required
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          />
        </Field>

        <Field className="space-y-1">
          <Label>Yeni Şifre (Tekrar)</Label>
          <Input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
        </Field>

        <div className="pt-4 border-t dark:border-neutral-700">
          <ButtonPrimary type="submit" disabled={loading} className="w-full text-lg">
            Şifreyi Güncelle
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}

export default PasswordPage
