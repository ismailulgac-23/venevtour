"use client";
import AvatarUpdate from '@/components/AvatarUpdate'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AdminProfilePage = () => {
    const { user, refreshUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    })

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.customerProfile?.firstName || '',
                lastName: user.customerProfile?.lastName || ''
            })
        }
    }, [user])

    const handleSave = async () => {
        setLoading(true)
        const updateData = new FormData()
        updateData.append('firstName', formData.firstName)
        updateData.append('lastName', formData.lastName)

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                body: updateData
            })

            if (res.ok) {
                toast.success('Profiliniz güncellendi.')
                await refreshUser()
            } else {
                toast.error('Güncelleme sırasında bir hata oluştu.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase">Profil Ayarları</h1>
                <p className="text-neutral-500 font-medium mt-2 text-lg">Hesap bilgilerinizi ve profil fotoğrafınızı yönetin.</p>
            </div>

            {/* Avatar Section */}
            <div className="bg-white dark:bg-neutral-800 p-10 rounded-[40px] border border-neutral-100 dark:border-neutral-700 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-500/5">
                <AvatarUpdate />
            </div>

            {/* Basic Info Form */}
            <div className="bg-white dark:bg-neutral-800 p-10 rounded-[40px] border border-neutral-100 dark:border-neutral-700 shadow-sm space-y-10">
                <div className="flex items-center gap-4 border-b border-neutral-50 dark:border-neutral-700 pb-6">
                    <div className="size-3 bg-primary-600 rounded-full" />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Kişisel Bilgiler</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">E-posta Adresi</label>
                        <Input
                            value={user?.email || ''}
                            disabled
                            className="bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 font-bold opacity-60 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-neutral-400 italic font-medium px-1">E-posta adresi güvenliği için sadece sistem yöneticisi tarafından değiştirilebilir.</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Kullanıcı Rolü</label>
                        <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-900/40">
                            <span className="text-primary-700 dark:text-primary-400 font-black uppercase text-sm tracking-widest">{user?.role}</span>
                        </div>
                    </div>

                    <div className="space-y-3 focus-within:scale-[1.02] transition-transform duration-300">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Adınız</label>
                        <Input
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-700 font-bold focus:ring-4 focus:ring-primary-500/10 rounded-2xl p-5"
                            placeholder="Adınız..."
                        />
                    </div>

                    <div className="space-y-3 focus-within:scale-[1.02] transition-transform duration-300">
                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Soyadınız</label>
                        <Input
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-700 font-bold focus:ring-4 focus:ring-primary-500/10 rounded-2xl p-5"
                            placeholder="Soyadınız..."
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-50 dark:border-neutral-700 flex justify-end">
                    <ButtonPrimary
                        onClick={handleSave}
                        disabled={loading}
                        className="px-12 py-5 rounded-2xl shadow-2xl shadow-primary-500/20 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all"
                    >
                        {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </ButtonPrimary>
                </div>
            </div>

            {/* Security Section (Placeholder for now) */}
            <div className="bg-neutral-900 text-white p-12 rounded-[40px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-3">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Hesap Güvenliği</h3>
                        <p className="text-neutral-400 font-bold text-sm max-w-md">Şifrenizi düzenli aralıklarla güncelleyerek hesabınızı tam koruma altında tutun.</p>
                    </div>
                    <ButtonPrimary className="bg-white text-neutral-900 hover:bg-neutral-50 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all hover:-rotate-2">
                        Şifreyi Değiştir
                    </ButtonPrimary>
                </div>
                <div className="absolute top-0 right-0 size-96 bg-primary-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-primary-600/30 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 size-64 bg-primary-400/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
            </div>
        </div>
    )
}

export default AdminProfilePage
