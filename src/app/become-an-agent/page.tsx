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
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        contactPhone: '',
        password: '',
        tursabNumber: '',
        taxOffice: '',
        taxNumber: '',
        companyType: '',
        address: '',
        documentUrl: '' // MVP'de text input
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch('/api/auth/register-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Başvuru yapılamadı.')
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="container my-20">
                <div className="mx-auto max-w-md text-center space-y-4">
                    <h2 className="text-2xl font-bold text-green-600">Başvurunuz Alındı! ✅</h2>
                    <p className="text-neutral-600">
                        Acente başvurunuz sisteme kaydedilmiştir. Yönetici onayı sonrası hesabınız aktif edilecek ve bilgilendirileceksiniz.
                    </p>
                    <div className="pt-4">
                        <Link href="/" className="text-primary-600 underline">Anasayfaya Dön</Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="my-10 flex justify-center">
                <Logo className="w-32" />
            </div>

            <div className="mx-auto max-w-2xl space-y-8 mb-20">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                        Acente Başvurusu
                    </h2>
                    <p className="mt-2 text-neutral-500">
                        Kurumsal bilgilerinizi girerek resmi acente başvurusunda bulunun.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20">
                        {error}
                    </div>
                )}

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Yetkili Bilgileri</h3>
                    </div>

                    <Field className="block">
                        <Label>Yetkili Ad Soyad</Label>
                        <Input name="contactName" required onChange={handleChange} value={formData.contactName} />
                    </Field>

                    <Field className="block">
                        <Label>Yetkili Telefon</Label>
                        <Input name="contactPhone" type="tel" required onChange={handleChange} value={formData.contactPhone} />
                    </Field>

                    <Field className="block">
                        <Label>E-posta (Giriş İçin)</Label>
                        <Input name="email" type="email" required onChange={handleChange} value={formData.email} />
                    </Field>

                    <Field className="block">
                        <Label>Şifre</Label>
                        <Input name="password" type="password" required onChange={handleChange} value={formData.password} />
                    </Field>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Şirket Bilgileri</h3>
                    </div>

                    <Field className="block">
                        <Label>Şirket Ünvanı</Label>
                        <Input name="companyName" required onChange={handleChange} value={formData.companyName} />
                    </Field>

                    <Field className="block">
                        <Label>Şirket Türü (Ltd, AŞ vb.)</Label>
                        <Input name="companyType" onChange={handleChange} value={formData.companyType} />
                    </Field>

                    <Field className="block">
                        <Label>Vergi Dairesi</Label>
                        <Input name="taxOffice" onChange={handleChange} value={formData.taxOffice} />
                    </Field>

                    <Field className="block">
                        <Label>Vergi Numarası</Label>
                        <Input name="taxNumber" onChange={handleChange} value={formData.taxNumber} />
                    </Field>

                    <Field className="block md:col-span-2">
                        <Label>Şirket Adresi</Label>
                        <Input name="address" onChange={handleChange} value={formData.address} />
                    </Field>

                    <div className="md:col-span-2 mt-4">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-4">Belge Bilgileri</h3>
                    </div>

                    <Field className="block">
                        <Label>TURSAB Belge No</Label>
                        <Input name="tursabNumber" required placeholder="örn: 12345" onChange={handleChange} value={formData.tursabNumber} />
                    </Field>

                    <Field className="block">
                        <Label>Belge Dosya URL (MVP)</Label>
                        <Input name="documentUrl" placeholder="https://..." onChange={handleChange} value={formData.documentUrl} />
                    </Field>

                    <div className="md:col-span-2 pt-4">
                        <ButtonPrimary type="submit" disabled={loading} className="w-full">
                            {loading ? 'Başvuru Gönderiliyor...' : 'Başvuruyu Tamamla'}
                        </ButtonPrimary>
                    </div>
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
