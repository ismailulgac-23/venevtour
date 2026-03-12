'use client'

import React, { useState, useEffect, useRef, use } from 'react'
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
    { id: 4, title: 'Fotoğraflar & Yayın', description: 'Görsel ve durum' }
]

const EditTourPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params)
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        priceFrom: '',
        durationDays: '',
        maxCapacity: '',
        isActive: true
    })

    const [includes, setIncludes] = useState<string[]>([])
    const [excludes, setExcludes] = useState<string[]>([])
    const [includeInput, setIncludeInput] = useState('')
    const [excludeInput, setExcludeInput] = useState('')

    // Image States
    const [existingImages, setExistingImages] = useState<any[]>([])
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const res = await fetch(`/api/tours/${id}`)
                if (res.ok) {
                    const json = await res.json()
                    const tour = json.data
                    setFormData({
                        title: tour.title,
                        description: tour.description,
                        location: tour.location,
                        priceFrom: tour.priceFrom.toString(),
                        durationDays: tour.durationDays.toString(),
                        maxCapacity: tour.maxCapacity?.toString() || '',
                        isActive: tour.isActive
                    })
                    setIncludes(tour.includes || [])
                    setExcludes(tour.excludes || [])
                    setExistingImages(tour.images || [])
                }
            } catch (error) {
                toast.error('Tur bilgileri yüklenemedi.')
            } finally {
                setFetching(false)
            }
        }
        fetchTour()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setFormData({ ...formData, [name]: value })
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

    const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        if (validFiles.length + newImageFiles.length + existingImages.length > 10) {
            toast.error('En fazla 10 fotoğraf yükleyebilirsiniz.')
            return
        }

        setNewImageFiles([...newImageFiles, ...validFiles])
        const previews = validFiles.map(file => URL.createObjectURL(file))
        setNewImagePreviews([...newImagePreviews, ...previews])
    }

    const removeNewImage = (index: number) => {
        const newFiles = [...newImageFiles]
        newFiles.splice(index, 1)
        setNewImageFiles(newFiles)

        const newPreviews = [...newImagePreviews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setNewImagePreviews(newPreviews)
    }

    const removeExistingImage = (id: string) => {
        setExistingImages(existingImages.filter(img => img.id !== id))
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
            if (includes.length === 0) { toast.error('Lütfen en az bir tane dahil olan hizmet ekleyiniz.'); return false; }
        }
        if (step === 4) {
            if (existingImages.length === 0 && newImageFiles.length === 0) {
                toast.error('Lütfen en az bir fotoğraf yükleyiniz.'); return false;
            }
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
            data.append('isActive', String(formData.isActive))
            data.append('includes', JSON.stringify(includes))
            data.append('excludes', JSON.stringify(excludes))
            data.append('existingImages', JSON.stringify(existingImages))

            newImageFiles.forEach((file) => {
                data.append('files', file)
            })

            const res = await fetch(`/api/tours/${id}/advanced`, {
                method: 'PATCH',
                body: data,
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.message || 'Güncelleme başarısız.')

            toast.success('Tur başarıyla güncellendi.')
            router.push('/account/agent')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="py-20 text-center">Yükleniyor...</div>

    const renderStepper = () => {
        const stepCount = STEPS.length;
        const trackOffset = 100 / (2 * stepCount); // Center of the first/last step
        const progressWidth = ((currentStep - 1) / (stepCount - 1)) * 100;

        return (
            <nav className="mb-16 relative">
                {/* Track Container (Constrained between first and last step centers) */}
                <div 
                    className="absolute top-6 h-0.5 bg-neutral-100 dark:bg-neutral-800 -z-10 rounded-full" 
                    style={{ left: `${trackOffset}%`, right: `${trackOffset}%` }}
                >
                    {/* Active Progress Line */}
                    <div 
                        className="absolute h-full bg-neutral-900 dark:bg-primary-500 transition-all duration-700 ease-in-out rounded-full" 
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>

                <ul className="relative flex items-center justify-between w-full z-10">
                    {STEPS.map((step) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;

                        return (
                            <li key={step.id} className="flex-1">
                                <div className="flex flex-col items-center">
                                    {/* Circle */}
                                    <div className={clsx(
                                        "flex items-center justify-center size-12 rounded-full border-2 transition-all duration-500 shadow-sm relative",
                                        isActive 
                                            ? "bg-white dark:bg-neutral-900 border-neutral-900 dark:border-primary-500 scale-110 z-20" 
                                            : isCompleted 
                                                ? "bg-neutral-900 border-neutral-900 text-white z-10" 
                                                : "bg-white dark:bg-neutral-900 border-neutral-200 text-neutral-400 z-0"
                                    )}>
                                        {isCompleted ? (
                                            <CheckIcon className="size-6 text-white animate-in zoom-in duration-300" />
                                        ) : (
                                            <span className={clsx("text-sm font-bold", isActive ? "text-neutral-900 dark:text-primary-400" : "text-neutral-400")}>
                                                {step.id}
                                            </span>
                                        )}
                                        
                                        {isActive && (
                                            <div className="absolute inset-0 rounded-full animate-ping bg-neutral-900/10 dark:bg-primary-500/10 -z-10" />
                                        )}
                                    </div>

                                    {/* Labels */}
                                    <div className="mt-4 flex flex-col items-center text-center px-2">
                                        <span className={clsx(
                                            "text-[11px] font-bold tracking-widest uppercase transition-colors duration-300",
                                            isActive ? "text-neutral-900 dark:text-primary-400" : isCompleted ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-400"
                                        )}>
                                            {step.title}
                                        </span>
                                        <p className="text-[10px] text-neutral-400 hidden lg:block font-medium mt-1 leading-tight tracking-tight opacity-70">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        )
    }

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
                                <Input value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem('include')} placeholder="Örn: Rehberlik Hizmeti" />
                                <ButtonSecondary type="button" onClick={() => addItem('include')} className="shrink-0"><PlusIcon className="size-5" /></ButtonSecondary>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {includes.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-xl text-green-800 text-sm">
                                        <div className="flex items-center gap-2"><CheckIcon className="size-4 text-green-600" />{item}</div>
                                        <button onClick={() => removeItem('include', i)} className="text-green-600 hover:text-green-800"><XMarkIcon className="size-4" /></button>
                                    </li>
                                ))}
                            </ul>
                        </Field>
                        <Field className="space-y-4">
                            <Label>Neler Dahil Değil?</Label>
                            <div className="flex gap-2">
                                <Input value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem('exclude')} placeholder="Örn: Müze Giriş Ücretleri" />
                                <ButtonSecondary type="button" onClick={() => addItem('exclude')} className="shrink-0"><PlusIcon className="size-5" /></ButtonSecondary>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {excludes.map((item, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-xl text-red-800 text-sm">
                                        <div className="flex items-center gap-2"><XMarkIcon className="size-4 text-red-600" />{item}</div>
                                        <button onClick={() => removeItem('exclude', i)} className="text-red-600 hover:text-red-800"><XMarkIcon className="size-4" /></button>
                                    </li>
                                ))}
                            </ul>
                        </Field>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <Field className="space-y-6">
                            <Label>Tur Fotoğrafları</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {/* Existing Images */}
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-neutral-100">
                                        <img src={img.url} alt="Tour" className="object-cover w-full h-full" />
                                        <button onClick={() => removeExistingImage(img.id)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TrashIcon className="size-4" />
                                        </button>
                                    </div>
                                ))}
                                {/* New Image Previews */}
                                {newImagePreviews.map((preview, i) => (
                                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-primary-100 ring-2 ring-primary-50">
                                        <img src={preview} alt="New" className="object-cover w-full h-full" />
                                        <button onClick={() => removeNewImage(i)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-600 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <XMarkIcon className="size-4" />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary-600 text-white text-[8px] py-1 text-center font-bold">YENİ</div>
                                    </div>
                                ))}
                                {/* Add Button */}
                                {existingImages.length + newImageFiles.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all text-neutral-400 hover:text-primary-600"
                                    >
                                        <CameraIcon className="size-8" />
                                        <span className="text-[10px] mt-2 font-medium">Ekle</span>
                                        <input type="file" hidden multiple ref={fileInputRef} accept=".jpg,.jpeg,.png,.webp,.heic" onChange={handleNewImageChange} />
                                    </button>
                                )}
                            </div>
                        </Field>

                        <div className="w-full border-t border-neutral-100 dark:border-neutral-700 pt-8">
                            <Field className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-700">
                                <div>
                                    <Label className="text-xl font-bold">Tur Yayında mı?</Label>
                                    <p className="text-sm text-neutral-500 mt-1">Pasif yaparsanız tur aramalarda görünmez.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="size-8 text-primary-600 rounded-xl border-neutral-300 focus:ring-primary-500 transition-all cursor-pointer"
                                />
                            </Field>
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
                <h1 className="text-4xl font-bold text-neutral-900">Turu Düzenle</h1>
                <p className="text-neutral-500 mt-2 text-lg">Mevcut tur bilgilerinizi güncelleyin ve fotoğrafları yönetin.</p>
            </div>

            {renderStepper()}

            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-2xl p-8 min-h-[450px]">
                {renderStepContent()}
            </div>

            <div className="mt-10 flex items-center justify-between border-t pt-8 dark:border-neutral-700">
                <ButtonSecondary disabled={currentStep === 1 || loading} onClick={() => setCurrentStep(currentStep - 1)} className="px-8 text-lg">Geri Dön</ButtonSecondary>
                <div className="flex gap-4">
                    {currentStep < 4 ? (
                        <ButtonPrimary onClick={handleNextStep} className="px-10 text-lg">Devam Et</ButtonPrimary>
                    ) : (
                        <ButtonPrimary onClick={handleSubmit} disabled={loading} className="px-12 text-lg bg-primary-6000">
                            {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                        </ButtonPrimary>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditTourPage
