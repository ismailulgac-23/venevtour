'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { PlusIcon, TrashIcon, PencilSquareIcon, GlobeAltIcon, EyeIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

const AdminBlogPage = () => {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        isActive: true
    })

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/blog')
            if (res.ok) {
                const json = await res.json()
                setPosts(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleOpenModal = (post: any = null) => {
        if (post) {
            setEditingPost(post)
            setFormData({
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt || '',
                content: post.content,
                image: post.image || '',
                isActive: post.isActive
            })
        } else {
            setEditingPost(null)
            setFormData({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                image: '',
                isActive: true
            })
        }
        setIsModalOpen(true)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('type', 'blog')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            })
            const json = await res.json()
            if (res.ok && json.success) {
                setFormData({ ...formData, image: json.url })
                toast.success('Görsel yüklendi.')
            } else {
                toast.error(json.message || 'Yükleme başarısız.')
            }
        } catch (error) {
            toast.error('Bağlantı hatası.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingPost ? 'PATCH' : 'POST'
        const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog'

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                toast.success(editingPost ? 'Yazı güncellendi.' : 'Yazı oluşturuldu.')
                setIsModalOpen(false)
                fetchPosts()
            } else {
                toast.error('İşlem başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return
        try {
            const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Yazı silindi.')
                fetchPosts()
            } else {
                toast.error('Silinemedi.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-20 px-4 sm:px-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase italic">Blog Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium tracking-tight">Haber ve duyuruları yönetin.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest"
                >
                    <PlusIcon className="size-4" />
                    Yeni Yazı Ekle
                </button>
            </div>

            <TableFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Yazı başlığına göre ara..."
                filters={[]}
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
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Görsel / Başlık</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Yazar</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Tarih</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {filteredPosts.map((post) => (
                                    <tr key={post.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors text-neutral-900 dark:text-white">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-700 shrink-0">
                                                    <img src={post.image || "/images/placeholder.jpg"} className="size-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <div className="font-bold line-clamp-1">{post.title}</div>
                                                    <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tighter">/{post.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-medium text-xs italic">{post.author?.email}</td>
                                        <td className="px-6 py-6 text-xs text-neutral-500">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</td>
                                        <td className="px-6 py-6">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${post.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-400'}`}>
                                                {post.isActive ? 'Yayında' : 'Taslak'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(post)} className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"><PencilSquareIcon className="size-5" /></button>
                                                <button onClick={() => handleDelete(post.id)} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><TrashIcon className="size-5" /></button>
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
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 rounded-[40px] p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center pb-4 border-b dark:border-neutral-800">
                            <h3 className="text-2xl font-black uppercase italic">{editingPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="size-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center font-bold hover:bg-neutral-200 transition-colors">✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-neutral-400 ml-1">Başlık</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-neutral-400 ml-1">Slug (Link)</label>
                                    <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full h-14 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 font-mono text-sm" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase text-neutral-400 ml-1">Kapak Görseli</label>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="relative size-32 rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center group shrink-0">
                                        {formData.image ? (
                                            <>
                                                <img src={formData.image} alt="" className="size-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => setFormData({...formData, image: ''})} className="text-white text-xs font-bold underline">Kaldır</button>
                                                </div>
                                            </>
                                        ) : (
                                            <CloudArrowUpIcon className="size-8 text-neutral-300" />
                                        )}
                                        {uploading && <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center"><div className="size-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>}
                                    </div>
                                    
                                    <div className="flex-1 space-y-3">
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                id="blog-image" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            <label 
                                                htmlFor="blog-image" 
                                                className="inline-flex items-center gap-2 px-6 py-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs uppercase cursor-pointer hover:bg-black transition-all active:scale-95"
                                            >
                                                <CloudArrowUpIcon className="size-4" />
                                                {formData.image ? 'Görseli Değiştir' : 'Görsel Yükle'}
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Veya görsel URL'si girin:</p>
                                        <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full h-12 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-4 text-xs font-mono" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-400 ml-1">Kısa Özet</label>
                                <input value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full h-14 bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl px-5 text-sm font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-neutral-400 ml-1">İçerik (HTML destekli)</label>
                                <textarea rows={8} required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-5 text-sm leading-relaxed" />
                            </div>

                            <div className="flex items-center gap-2 px-1">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="size-5 rounded-md border-neutral-300 text-primary-600 focus:ring-primary-500" />
                                <label htmlFor="isActive" className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Yayınla (Aktif)</label>
                            </div>

                            <div className="flex gap-4 pt-4 border-t dark:border-neutral-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all">İptal</button>
                                <button type="submit" className="flex-[2] h-16 bg-primary-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-600/20 transition-all active:scale-95 px-8">Değişiklikleri Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminBlogPage
