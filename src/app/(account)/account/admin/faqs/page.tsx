'use client'

import React, { useEffect, useState, Fragment } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { PlusIcon, TrashIcon, PencilSquareIcon, QuestionMarkCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Input from '@/shared/Input'

const AdminFAQPage = () => {
    const [faqs, setFaqs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState<any>(null)
    const [saveLoading, setSaveLoading] = useState(false)
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        order: 0,
        isActive: true
    })

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/faqs')
            if (res.ok) {
                const json = await res.json()
                setFaqs(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFaqs()
    }, [])

    const handleOpenModal = (faq: any = null) => {
        if (faq) {
            setEditingFaq(faq)
            setFormData({
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
                isActive: faq.isActive
            })
        } else {
            setEditingFaq(null)
            setFormData({
                question: '',
                answer: '',
                order: faqs.length,
                isActive: true
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaveLoading(true)
        const method = editingFaq ? 'PATCH' : 'POST'
        const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(editingFaq ? 'SSS güncellendi.' : 'Yeni SSS eklendi.')
                setIsModalOpen(false)
                fetchFaqs()
            } else {
                toast.error('İşlem başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        } finally {
            setSaveLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu soruyu silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('SSS silindi.')
                fetchFaqs()
            } else {
                toast.error('Silinemedi.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const filteredFaqs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-20 px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase italic">SSS Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Müşterilerin en çok sorduğu soruları buradan yönetin.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-2xl font-black hover:opacity-90 transition-all shadow-xl active:scale-95 text-[10px] uppercase tracking-widest"
                >
                    <PlusIcon className="size-4" />
                    Yeni Soru Ekle
                </button>
            </div>

            <TableFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Sorula göre ara..."
                filters={[]}
            />

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="size-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-[40px] border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Sıra</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Soru</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Cevap (Özet)</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {filteredFaqs.map((faq) => (
                                    <tr key={faq.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors text-neutral-900 dark:text-white uppercase tracking-tighter font-medium">
                                        <td className="px-6 py-6 font-black text-neutral-300 dark:text-neutral-600">#{faq.order}</td>
                                        <td className="px-6 py-6 font-black">{faq.question}</td>
                                        <td className="px-6 py-6 text-[10px] text-neutral-400 max-w-xs truncate italic">"{faq.answer}"</td>
                                        <td className="px-6 py-6">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${faq.isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'}`}>
                                                {faq.isActive ? 'Yayında' : 'Yayında Değil'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-neutral-900">
                                                <button onClick={() => handleOpenModal(faq)} className="p-3 bg-neutral-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-black/10"><PencilSquareIcon className="size-4" /></button>
                                                <button onClick={() => handleDelete(faq.id)} className="p-3 bg-rose-500 text-white rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/10"><TrashIcon className="size-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL (POPUP) */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[9999]" onClose={() => setIsModalOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="bg-white dark:bg-neutral-900 rounded-[40px] p-10 max-w-xl w-full shadow-2xl space-y-8 animate-in zoom-in duration-300 border border-neutral-100 dark:border-neutral-800">
                                    <div className="flex justify-between items-center pb-6 border-b dark:border-neutral-800">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                                                <QuestionMarkCircleIcon className="size-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">{editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru'}</h3>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Sıkça Sorulan Sorular</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsModalOpen(false)} className="size-12 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center font-bold hover:bg-neutral-100 transition-colors"><XMarkIcon className="size-6" /></button>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 italic">Görüntüleme Sırası (0 ilk sırada çıkar)</label>
                                            <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl h-14 font-black text-xl" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 italic">Soru Cümlesi</label>
                                            <Input required value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl h-14 font-black" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1 italic">Cevap Metni</label>
                                            <textarea rows={6} required value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-3xl p-6 text-sm leading-relaxed font-medium" />
                                        </div>

                                        <div className="flex items-center gap-3 px-1 py-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                            <div className="px-4 flex items-center gap-3">
                                                <input type="checkbox" id="isActiveFaq" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="size-6 rounded-md border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                                                <label htmlFor="isActiveFaq" className="text-sm font-black uppercase tracking-tighter cursor-pointer">Sitede Aktif Olarak Göster</label>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4 border-t dark:border-neutral-800">
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all">İptal</button>
                                            <ButtonPrimary type="submit" className="flex-[2] h-16 uppercase text-[10px] tracking-widest font-black" disabled={saveLoading}>
                                                {saveLoading ? 'Kaydediliyor...' : 'Değişiklikleri Tamamla'}
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

export default AdminFAQPage
