'use client'

import React, { useState, useRef } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Textarea from '@/shared/Textarea'
import { useRouter } from 'next/navigation'
import { CheckIcon, PlusIcon, TrashIcon, CameraIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const STEPS = [
    { id: 1, title: 'Temel Bilgiler', description: 'Tur adı ve açıklama' },
    { id: 2, title: 'Fiyat & Kapasite', description: 'Süre ve kontenjan' },
    { id: 3, title: 'Tur İçeriği', description: 'Neler dahil? Neler değil?' },
    { id: 4, title: 'Fotoğraflar', description: 'Görsel yükle' }
]

const CreateTourPage = () => {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        priceFrom: '',
        durationDays: '',
        maxCapacity: '',
    })

    // List States for Includes/Excludes
    const [includes, setIncludes] = useState<string[]>([])
    const [excludes, setExcludes] = useState<string[]>([])
    const [includeInput, setIncludeInput] = useState('')
    const [excludeInput, setExcludeInput] = useState('')

    // Image Upload State
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const addItem = (type: 'include' | 'exclude') => {
        if (type === 'include' && includeInput.trim()) {
            setIncludes([...includes, includeInput.trim()])
            setIncludeInput('')
        } else if (type === 'exclude' && excludeInput.trim()) {
            setExcludes([...excludes, excludeInput.trim()])
            setExcludeInput('')
        }
    }

    const removeItem = (type: 'include' | 'exclude', index: number) => {
        if (type === 'include') {
            setIncludes(includes.filter((_, i) => i !== index))
        } else {
            setExcludes(excludes.filter((_, i) => i !== index))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const allowedExtensions = ['webp', 'jpg', 'jpeg', 'png', 'heic'];

        const validFiles = files.filter(file => {
            const ext = file.name.split('.').pop()?.toLowerCase() || '';
            const isValid = allowedExtensions.includes(ext);
            if (!isValid) {
                toast.error(`Geçersiz format: ${file.name}. Sadece webp, jpg, jpeg, png ve heic kabul edilir.`);
            }
            return isValid;
        });

        if (validFiles.length + selectedImages.length > 10) {
            toast.error('En fazla 10 fotoğraf yükleyebilirsiniz.')
            return
        }

        setSelectedImages([...selectedImages, ...validFiles])

        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        setImagePreviews([...imagePreviews, ...newPreviews])
    }

    const removeImage = (index: number) => {
        const newImages = [...selectedImages]
        newImages.splice(index, 1)
        setSelectedImages(newImages)

        const newPreviews = [...imagePreviews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setImagePreviews(newPreviews)
    }

    const validateStep = (step: number) => {
        if (step === 1) {
            if (!formData.title.trim()) { toast.error('Lütfen bir tur başlığı giriniz.'); return false; }
            if (!formData.location.trim()) { toast.error('Lütfen bir konum belirtiniz.'); return false; }
            if (!formData.description.trim()) { toast.error('Lütfen tur açıklaması ekleyiniz.'); return false; }
        }
        if (step === 2) {
            if (!formData.priceFrom || Number(formData.priceFrom) <= 0) { toast.error('Lütfen geçerli bir başlangıç fiyatı giriniz.'); return false; }
            if (!formData.durationDays || Number(formData.durationDays) <= 0) { toast.error('Lütfen tur süresini giriniz.'); return false; }
            if (!formData.maxCapacity || Number(formData.maxCapacity) <= 0) { toast.error('Lütfen kontenjan sayısını giriniz.'); return false; }
        }
        if (step === 3) {
            // Opsiyonel olabilir ama en az bir "Dahil olan" istenebilir
            if (includes.length === 0) { toast.error('Lütfen en az bir tane dahil olan hizmet ekleyiniz.'); return false; }
        }
        if (step === 4) {
            if (selectedImages.length === 0) { toast.error('Lütfen en az bir fotoğraf yükleyiniz.'); return false; }
        }
        return true
    }

    const handleNextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleSubmit = async () => {
        if (!validateStep(4)) return
        setLoading(true)
        try {
            const data = new FormData()
            data.append('title', formData.title)
            data.append('description', formData.description)
            data.append('location', formData.location)
            data.append('priceFrom', formData.priceFrom)
            data.append('durationDays', formData.durationDays)
            data.append('maxCapacity', formData.maxCapacity)
            data.append('includes', JSON.stringify(includes))
            data.append('excludes', JSON.stringify(excludes))

            selectedImages.forEach((image) => {
                data.append('files', image)
            })

            const res = await fetch('/api/tours/advanced', {
                method: 'POST',
                body: data, // JSON değil FormData gönderiyoruz
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.message || 'Hata oluştu')

            toast.success('Tur başarıyla oluşturuldu ve yayına alındı!')
            router.push('/account/agent')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const renderStepper = () => (
        <nav className="mb-12">
            <ul className="flex items-center justify-between w-full">
                {STEPS.map((step, idx) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <li key={step.id} className="relative flex-1 group">
                            <div className={`flex items-center ${idx == STEPS.length - 1 ? "justify-end" : idx == 0 ? "justify-start" : "justify-center"}`}>
                                <div className={clsx(
                                    "z-10 flex items-center justify-center size-12 rounded-full border-2 font-bold transition-all duration-300 shadow-sm",
                                    isActive || isCompleted
                                        ? "bg-neutral-900 border-primary-6000 text-white"
                                        : "bg-white border-neutral-200 text-neutral-400"
                                )}>
                                    {isCompleted ? (
                                        <CheckIcon className="size-6 animate-in zoom-in duration-300" />
                                    ) : (
                                        <span className={clsx(isActive && "scale-110 transition-transform")}>{step.id}</span>
                                    )}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full animate-ping bg-primary-6000/20 -z-10" />
                                    )}
                                </div>
                                <div className={clsx(
                                    "absolute right-0 top-7 -translate-y-1/2 h-1 -z-0 w-full rounded-full",
                                    isCompleted ? "bg-neutral-900" : "bg-neutral-100"
                                )} />
                            </div>
                            <div className={`mt-4 hidden md:flex flex-col ${idx == STEPS.length - 1 ? "items-end" : idx == 0 ? "items-start" : "items-center"}`}>
                                <span className={clsx(
                                    "text-sm font-bold tracking-tight uppercase",
                                    isActive ? "text-primary-6000" : isCompleted ? "text-neutral-900" : "text-neutral-400"
                                )}>{step.title}</span>
                                <p className="text-[10px] text-neutral-400 leading-tight hidden xl:block uppercase font-medium mt-0.5">{step.description}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Field>
                            <Label>Tur Başlığı</Label>
                            <Input name="title" required value={formData.title} onChange={handleChange} placeholder="Örn: Kapadokya Balon Turu" />
                        </Field>
                        <Field>
                            <Label>Konum</Label>
                            <Input name="location" required value={formData.location} onChange={handleChange} placeholder="Örn: Göreme, Nevşehir" />
                        </Field>
                        <Field>
                            <Label>Açıklama</Label>
                            <Textarea name="description" required value={formData.description} onChange={handleChange} rows={6} placeholder="Tur hakkında detaylı bilgi verin..." />
                        </Field>
                    </div>
                )
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Field>
                            <Label>Başlangıç Fiyatı (₺)</Label>
                            <Input name="priceFrom" type="number" required value={formData.priceFrom} onChange={handleChange} placeholder="0" />
                        </Field>
                        <Field>
                            <Label>Süre (Gün)</Label>
                            <Input name="durationDays" type="number" required value={formData.durationDays} onChange={handleChange} placeholder="1" />
                        </Field>
                        <Field>
                            <Label>Kontenjan (Kişi)</Label>
                            <Input name="maxCapacity" type="number" required value={formData.maxCapacity} onChange={handleChange} placeholder="20" />
                        </Field>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Field className="space-y-4">
                            <Label>Neler Dahil?</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={includeInput}
                                    onChange={(e) => setIncludeInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem('include')}
                                    placeholder="Örn: Rehberlik Hizmeti"
                                />
                                <ButtonSecondary type="button" onClick={() => addItem('include')} className="shrink-0">
                                    <PlusIcon className="size-5" />
                                </ButtonSecondary>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {includes.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl text-green-800 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckIcon className="size-4 text-green-600" />
                                            {item}
                                        </div>
                                        <button onClick={() => removeItem('include', i)} className="text-green-600 hover:text-green-800">
                                            <XMarkIcon className="size-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Field>

                        <Field className="space-y-4">
                            <Label>Neler Dahil Değil?</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={excludeInput}
                                    onChange={(e) => setExcludeInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem('exclude')}
                                    placeholder="Örn: Müze Giriş Ücretleri"
                                />
                                <ButtonSecondary type="button" onClick={() => addItem('exclude')} className="shrink-0">
                                    <PlusIcon className="size-5" />
                                </ButtonSecondary>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {excludes.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-xl text-red-800 text-sm">
                                        <div className="flex items-center gap-2">
                                            <XMarkIcon className="size-4 text-red-600" />
                                            {item}
                                        </div>
                                        <button onClick={() => removeItem('exclude', i)} className="text-red-600 hover:text-red-800">
                                            <XMarkIcon className="size-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Field>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Field className="space-y-4">
                            <Label>Tur Fotoğrafları (En az 3 adet önerilir)</Label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition-all"
                            >
                                <CameraIcon className="size-12 mx-auto text-neutral-300" />
                                <p className="mt-4 text-neutral-500">Dosyaları sürükleyin veya <span className="text-primary-600 font-semibold underline">seçmek için tıklayın</span></p>
                                <p className="text-xs text-neutral-400 mt-2">JPG, PNG, WEBP veya HEIC (Max. 5MB)</p>
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    ref={fileInputRef}
                                    accept=".jpg,.jpeg,.png,.webp,.heic"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </Field>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                            {imagePreviews.map((preview, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-neutral-100">
                                    <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                                    <button
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <TrashIcon className="size-4" />
                                    </button>
                                    {i === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary-600/90 text-white text-[10px] py-1 text-center font-bold">KAPAK FOTOĞRAFI</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-neutral-900">Tur İlanı Oluştur</h1>
                <p className="text-neutral-500 mt-2 text-lg">Müşterilerinize unutulmaz bir deneyim sunun.</p>
            </div>

            {renderStepper()}

            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-xl p-8 min-h-[400px]">
                {renderStepContent()}
            </div>

            <div className="mt-10 flex items-center justify-between border-t pt-8 dark:border-neutral-700">
                <ButtonSecondary
                    disabled={currentStep === 1 || loading}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8"
                >
                    Geri Dön
                </ButtonSecondary>

                <div className="flex gap-4">
                    {currentStep < 4 ? (
                        <ButtonPrimary
                            onClick={handleNextStep}
                            className="px-10"
                        >
                            Devam Et
                        </ButtonPrimary>
                    ) : (
                        <ButtonPrimary
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-12 bg-primary-6000"
                        >
                            {loading ? 'Yayınlanıyor...' : 'Turu Yayınla'}
                        </ButtonPrimary>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreateTourPage
