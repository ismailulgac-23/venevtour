'use client'

import React, { FC, useRef, useState } from 'react'
import Avatar from '@/shared/Avatar'
import { CameraIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

interface AvatarUpdateProps {
    className?: string
}

const AvatarUpdate: FC<AvatarUpdateProps> = ({ className = '' }) => {
    const { user, refreshUser } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const allowedExtensions = ['webp', 'jpg', 'jpeg', 'png', 'heic'];
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

        if (!allowedExtensions.includes(fileExt)) {
            toast.error('Geçersiz dosya formatı. Sadece webp, jpg, jpeg, png ve heic dosyaları kabul edilir.');
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Dosya boyutu 2MB üzerinde olamaz.')
            return
        }

        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)

        // Otomatik yükleme
        setLoading(true)
        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: formData
            })

            if (res.ok) {
                toast.success('Profil fotoğrafı güncellendi!')
                await refreshUser()
            } else {
                toast.error('Görsel yüklenirken bir hata oluştu.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setLoading(false)
            setPreview(null)
        }
    }

    return (
        <div className={`flex flex-col items-center sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 ${className}`}>
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="size-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-800 shadow-2xl relative">
                    <Avatar
                        src={preview || user?.avatarUrl}
                        className="size-full object-cover"
                    />
                    {loading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="size-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 size-10 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-neutral-800 group-hover:scale-110 transition-transform">
                    <CameraIcon className="size-6" />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Profil Fotoğrafı</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Hesabınızı kişiselleştirin. WEBP, JPG, PNG veya HEIC formatında, maksimum 2MB boyutunda görseller yükleyebilirsiniz.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-xl text-xs font-bold hover:bg-primary-900 hover:text-white transition-all flex items-center gap-2"
                    >
                        <CloudArrowUpIcon className="size-4" />
                        Fotoğraf Değiştir
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AvatarUpdate
