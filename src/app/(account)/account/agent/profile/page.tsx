'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { Field, Label } from '@/shared/fieldset'
import Textarea from '@/shared/Textarea'
import toast from 'react-hot-toast'
import AvatarUpdate from '@/components/AvatarUpdate'

const AgentProfilePage = () => {
    const { user, refreshUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        taxOffice: '',
        taxNumber: '',
        tursabNumber: '',
        address: '',
        bio: '',
    })

    useEffect(() => {
        if (user?.agentProfile) {
            setFormData({
                companyName: user.agentProfile.companyName || '',
                contactName: user.agentProfile.contactName || '',
                contactPhone: user.agentProfile.contactPhone || '',
                contactEmail: user.agentProfile.contactEmail || '',
                taxOffice: user.agentProfile.taxOffice || '',
                taxNumber: user.agentProfile.taxNumber || '',
                tursabNumber: user.agentProfile.tursabNumber || '',
                address: user.agentProfile.address || '',
                bio: user.agentProfile.bio || '',
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: new URLSearchParams(formData as any), // FormData or JSON both ok here but API uses formData.get
            })
            // Wait, my API /api/user/profile uses formData.get
            // Let's use FormData
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => data.append(key, value))

            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: data
            })

            if (response.ok) {
                toast.success('Profil başarıyla güncellendi.')
                await refreshUser()
            } else {
                const err = await response.json()
                toast.error(err.message || 'Bir hata oluştu.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b dark:border-neutral-700">
                <div>
                    <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Acente Bilgileri</h2>
                    <p className="mt-2 text-neutral-500 dark:text-neutral-400">Şirket bilgilerinizi ve iletişim tercihlerini yönetin.</p>
                </div>
            </div>

            <AvatarUpdate className="bg-neutral-50 dark:bg-neutral-800/30 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-700" />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                <Field className="space-y-1">
                    <Label>Şirket Adı</Label>
                    <Input
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>Yetkili Kişi</Label>
                    <Input
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>İletişim Telefonu</Label>
                    <Input
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>İletişim E-postası</Label>
                    <Input
                        required
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>Vergi Dairesi</Label>
                    <Input
                        value={formData.taxOffice}
                        onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>Vergi Numarası</Label>
                    <Input
                        value={formData.taxNumber}
                        onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    />
                </Field>
                <Field className="space-y-1">
                    <Label>TÜRSAB Belge No</Label>
                    <Input
                        required
                        value={formData.tursabNumber}
                        onChange={(e) => setFormData({ ...formData, tursabNumber: e.target.value })}
                    />
                </Field>
                <Field className="md:col-span-2 space-y-1">
                    <Label>Adres</Label>
                    <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                </Field>
                <Field className="md:col-span-2 space-y-1">
                    <Label>Şirket Hakkında (Bio)</Label>
                    <Textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </Field>
                <div className="md:col-span-2 pt-4 border-t dark:border-neutral-700">
                    <ButtonPrimary type="submit" disabled={loading}>
                        Değişiklikleri Kaydet
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    )
}

export default AgentProfilePage
