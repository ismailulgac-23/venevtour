'use client'

import React, { useEffect, useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { PlusIcon, PencilSquareIcon, EnvelopeIcon, IdentificationIcon, ShieldCheckIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Dialog, Transition } from '@headlessui/react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'
import Select from '@/shared/Select'

const AdminUsersPage = () => {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [editingUser, setEditingUser] = useState<any>(null)
    const [saveLoading, setSaveLoading] = useState(false)

    const fetchUsers = async () => {
        try {
            const params = new URLSearchParams()
            if (searchTerm) params.append('search', searchTerm)
            if (roleFilter) params.append('role', roleFilter)
            if (statusFilter) params.append('status', statusFilter)

            const res = await fetch(`/api/admin/users?${params.toString()}`)
            if (res.ok) {
                const json = await res.json()
                setUsers(json.data)
            }
        } catch (error) {
            console.error(error)
            toast.error('Kullanıcılar yüklenemedi.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers()
        }, 300)
        return () => clearTimeout(timer)
    }, [searchTerm, roleFilter, statusFilter])

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaveLoading(true)
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: editingUser.id,
                    role: editingUser.role,
                    status: editingUser.status,
                    email: editingUser.email,
                    firstName: editingUser.firstName,
                    lastName: editingUser.lastName,
                    companyName: editingUser.companyName,
                    phone: editingUser.phone
                })
            })

            if (res.ok) {
                toast.success('Kullanıcı güncellendi.')
                setEditingUser(null)
                fetchUsers()
            } else {
                toast.error('Güncelleme başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        } finally {
            setSaveLoading(false)
        }
    }

    const openEditModal = (user: any) => {
        const firstName = user.customerProfile?.firstName || user.agentProfile?.contactName?.split(' ')[0] || ''
        const lastName = user.customerProfile?.lastName || user.agentProfile?.contactName?.split(' ').slice(1).join(' ') || ''
        const phone = user.customerProfile?.phone || user.agentProfile?.contactPhone || ''
        const companyName = user.agentProfile?.companyName || ''

        setEditingUser({
            ...user,
            firstName,
            lastName,
            phone,
            companyName
        })
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Kullanıcı Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Bütün kullanıcıların detaylarını ve yetkilerini buradan yönetin.</p>
                </div>
                <div className="bg-neutral-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                    <UsersIcon className="size-5 text-primary-400" />
                    <span className="text-xl font-black">{users.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Kayıt</span>
                </div>
            </div>

            <TableFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="İsim veya e-posta ile ara..."
                filters={[
                    {
                        label: 'Rol',
                        name: 'role',
                        value: roleFilter,
                        onChange: setRoleFilter,
                        options: [
                            { label: 'Hepsi', value: '' },
                            { label: 'Admin', value: 'ADMIN' },
                            { label: 'Acente', value: 'AGENT' },
                            { label: 'Müşteri', value: 'CUSTOMER' }
                        ]
                    },
                    {
                        label: 'Durum',
                        name: 'status',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: 'Hepsi', value: '' },
                            { label: 'Aktif', value: 'ACTIVE' },
                            { label: 'Bekliyor', value: 'PENDING' },
                            { label: 'Engellendi', value: 'BLOCKED' }
                        ]
                    }
                ]}
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="size-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-[40px] border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Kullanıcı</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Rol</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Katılım</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {users.map((item) => (
                                    <tr key={item.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors text-neutral-900 dark:text-white">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-700 shrink-0">
                                                    <img src={item.avatarUrl || "https://images.pexels.com/photos/1450114/pexels-photo-1450114.jpeg"} alt="" className="size-full object-cover" />
                                                </div>
                                                <div>
                                                    <div className="font-bold flex items-center gap-1.5">
                                                        {item.agentProfile?.companyName || (item.customerProfile?.firstName ? `${item.customerProfile.firstName} ${item.customerProfile.lastName}` : 'İsimsiz')}
                                                        {item.role === 'ADMIN' && <ShieldCheckIcon className="size-3.5 text-primary-600" />}
                                                    </div>
                                                    <div className="text-[10px] text-neutral-400 font-black uppercase tracking-tighter">{item.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                item.role === 'ADMIN' ? "bg-purple-100 text-purple-700" :
                                                item.role === 'AGENT' ? "bg-blue-100 text-blue-700" : "bg-neutral-100 text-neutral-700"
                                            )}>
                                                {item.role === 'ADMIN' ? 'Yönetici' : item.role === 'AGENT' ? 'Acente' : 'Müşteri'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                item.status === 'ACTIVE' ? "bg-green-100 text-green-700" :
                                                item.status === 'PENDING' ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {item.status === 'ACTIVE' ? 'Aktif' : item.status === 'PENDING' ? 'Bekliyor' : 'Engellendi'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-xs text-neutral-500 italic">
                                            {new Date(item.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => openEditModal(item)}
                                                className="p-3 bg-neutral-900 text-white rounded-2xl hover:bg-primary-600 transition-all shadow-xl shadow-black/10"
                                            >
                                                <PencilSquareIcon className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* EDIT USER MODAL (POPUP) */}
            <Transition appear show={!!editingUser} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => setEditingUser(null)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[40px] bg-white dark:bg-neutral-900 p-10 text-left align-middle shadow-2xl transition-all border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b dark:border-neutral-800">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-full overflow-hidden bg-neutral-100 border-2 border-primary-500">
                                                <img src={editingUser?.avatarUrl || "https://images.pexels.com/photos/1450114/pexels-photo-1450114.jpeg"} alt="" className="size-full object-cover" />
                                            </div>
                                            <div>
                                                <Dialog.Title as="h3" className="text-2xl font-black uppercase tracking-tighter leading-none">
                                                    Kullanıcıyı Düzenle
                                                </Dialog.Title>
                                                <p className="text-xs text-neutral-400 font-bold mt-1 uppercase tracking-widest">{editingUser?.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setEditingUser(null)} className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                                            <XMarkIcon className="size-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpdateUser} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">E-Posta (Dikkat! Sisteme Giriş Bilgisidir)</label>
                                                <Input 
                                                    value={editingUser?.email || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} 
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Telefon</label>
                                                <Input 
                                                    value={editingUser?.phone || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} 
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Adı</label>
                                                <Input 
                                                    value={editingUser?.firstName || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} 
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Soyadı</label>
                                                <Input 
                                                    value={editingUser?.lastName || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} 
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold"
                                                />
                                            </div>

                                            {editingUser?.role === 'AGENT' && (
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Şirket Adı</label>
                                                    <Input 
                                                        value={editingUser?.companyName || ''} 
                                                        onChange={(e) => setEditingUser({ ...editingUser, companyName: e.target.value })} 
                                                        className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold"
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Kullanıcı Rolü</label>
                                                <Select 
                                                    value={editingUser?.role || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold h-14"
                                                >
                                                    <option value="ADMIN">ADMIN (Tam Yetki)</option>
                                                    <option value="AGENT">ACENTE (Tur Sağlayıcı)</option>
                                                    <option value="CUSTOMER">MÜŞTERİ (Gezgin)</option>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Hesap Durumu</label>
                                                <Select 
                                                    value={editingUser?.status || ''} 
                                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                                    className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-bold h-14"
                                                >
                                                    <option value="ACTIVE">AKTİF (Sorunsuz)</option>
                                                    <option value="PENDING">BEKLİYOR (Onay Gerekli)</option>
                                                    <option value="BLOCKED">ENGELLENDİ (Giriş Yapamaz)</option>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex gap-4">
                                            <button 
                                                type="button"
                                                onClick={() => setEditingUser(null)}
                                                className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-colors"
                                            >
                                                Vazgeç
                                            </button>
                                            <ButtonPrimary type="submit" className="flex-1 py-4 uppercase text-[10px] tracking-widest font-black" disabled={saveLoading}>
                                                {saveLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                                            </ButtonPrimary>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

export default AdminUsersPage
