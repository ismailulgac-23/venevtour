'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { Field, Label } from '@/shared/fieldset'
import toast from 'react-hot-toast'
import AvatarUpdate from '@/components/AvatarUpdate'

const CustomerProfilePage = () => {
    const { user, refreshUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
    })

    useEffect(() => {
        if (user?.customerProfile) {
            setFormData({
                firstName: user.customerProfile.firstName || '',
                lastName: user.customerProfile.lastName || '',
                phone: user.customerProfile.phone || '',
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => data.append(key, value))

            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: data,
            })
            if (res.ok) {
                toast.success('Profil başarıyla güncellendi.')
                await refreshUser()
            } else {
                const err = await res.json()
                toast.error(err.message || 'Bir hata oluştu.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b dark:border-neutral-700">
                <div>
                    <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Hesap Bilgileri</h2>
                    <p className="mt-2 text-neutral-500 dark:text-neutral-400">Kişisel bilgilerinizi ve iletişim detaylarını güncelleyin.</p>
                </div>
            </div>

            <AvatarUpdate className="bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-700" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field className="space-y-1">
                        <Label>Adınız</Label>
                        <Input
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </Field>
                    <Field className="space-y-1">
                        <Label>Soyadınız</Label>
                        <Input
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </Field>
                </div>
                <Field className="space-y-1">
                    <Label>Telefon Numarası</Label>
                    <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>E-posta Adresi (Değiştirilemez)</Label>
                    <Input disabled value={user?.email || ''} />
                </Field>

                <div className="pt-4 border-t dark:border-neutral-700">
                    <ButtonPrimary type="submit" disabled={loading}>
                        Bilgileri Güncelle
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    )
}

export default CustomerProfilePage
