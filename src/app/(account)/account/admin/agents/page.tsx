'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'

const AdminAgentsPage = () => {
    const [agents, setAgents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/admin/agents')
            if (res.ok) {
                const json = await res.json()
                setAgents(json.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAgents()
    }, [])

    const [editingCommission, setEditingCommission] = useState<{ id: string, type: string, amount: string } | null>(null)

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/admin/agents/${id}/${action}`, { method: 'POST' })
            if (res.ok) {
                toast.success(action === 'approve' ? 'Acente onaylandı.' : 'Acente reddedildi.')
                fetchAgents()
            } else {
                toast.error('İşlem başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const updateCommission = async () => {
        if (!editingCommission) return
        try {
            const res = await fetch(`/api/admin/agents/${editingCommission.id}/commission`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    commissionType: editingCommission.type,
                    commissionAmount: editingCommission.amount
                })
            })
            if (res.ok) {
                toast.success('Komisyon güncellendi.')
                setEditingCommission(null)
                fetchAgents()
            } else {
                toast.error('Güncelleme başarısız.')
            }
        } catch (error) {
            toast.error('Hata oluştu.')
        }
    }

    const filteredAgents = agents.filter(agent => {
        const matchesSearch = agent.agentProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            agent.agentProfile?.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === '' || agent.status === statusFilter
        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Acente Yönetimi</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Başvuruları değerlendirin ve acente bazlı komisyon oranlarını yönetin.</p>
                </div>
            </div>

            <TableFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Şirket veya yetkili ismine göre ara..."
                filters={[
                    {
                        label: 'Durum',
                        name: 'status',
                        value: statusFilter,
                        onChange: setStatusFilter,
                        options: [
                            { label: 'Aktif', value: 'ACTIVE' },
                            { label: 'Bekliyor', value: 'PENDING' },
                            { label: 'Reddedildi', value: 'REJECTED' }
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
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Şirket / Yetkili</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">TÜRSAB No</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Komisyon</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Durum</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {filteredAgents.map((agent) => (
                                    <tr key={agent.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors text-neutral-900 dark:text-white">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800">
                                            <div className="font-bold mb-0.5">{agent.agentProfile?.companyName}</div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase">{agent.agentProfile?.contactName}</div>
                                        </td>
                                        <td className="px-6 py-6 font-mono text-xs tabular-nums tracking-tighter">{agent.agentProfile?.tursabNumber}</td>
                                        <td className="px-6 py-6">
                                            <div className="font-black text-sm italic">
                                                {agent.agentProfile?.commissionType === 'PERCENTAGE' ? '%' : ''}
                                                {Number(agent.agentProfile?.commissionAmount).toLocaleString('tr-TR')}
                                                {agent.agentProfile?.commissionType === 'FIXED' ? ' ₺' : ''}
                                            </div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">{agent.agentProfile?.commissionType === 'PERCENTAGE' ? 'Yüzde' : 'Sabit'}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${agent.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    agent.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {agent.status === 'ACTIVE' ? 'Aktif' : agent.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 transition-opacity">
                                                {agent.status === 'PENDING' ? (
                                                    <>
                                                        <button onClick={() => handleAction(agent.id, 'approve')} className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">Onayla</button>
                                                        <button onClick={() => handleAction(agent.id, 'reject')} className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reddet</button>
                                                    </>
                                                ) : (
                                                    <button 
                                                        onClick={() => setEditingCommission({ 
                                                            id: agent.id, 
                                                            type: agent.agentProfile?.commissionType || 'PERCENTAGE', 
                                                            amount: agent.agentProfile?.commissionAmount?.toString() || '10' 
                                                        })} 
                                                        className="px-4 py-2 bg-neutral-900 text-white dark:bg-neutral-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-black/5"
                                                    >
                                                        Komisyonu Düzenle
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* COMMISSION MODAL */}
            {editingCommission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-900 rounded-[40px] p-10 max-w-md w-full shadow-2xl space-y-8 animate-in zoom-in duration-300">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold uppercase tracking-tighter">Komisyon Ayarları</h3>
                            <p className="text-sm text-neutral-500 font-medium mt-1">Acentenin her satıştan bırakacağı tutarı belirleyin.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Komisyon Türü</label>
                                <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                                    <button 
                                        onClick={() => setEditingCommission({ ...editingCommission, type: 'PERCENTAGE' })}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all ${editingCommission.type === 'PERCENTAGE' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500'}`}
                                    >
                                        Yüzde (%)
                                    </button>
                                    <button 
                                        onClick={() => setEditingCommission({ ...editingCommission, type: 'FIXED' })}
                                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all ${editingCommission.type === 'FIXED' ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500'}`}
                                    >
                                        Sabit (₺)
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">Komisyon Tutarı</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl p-4 font-black text-lg focus:ring-2 focus:ring-primary-500 transition-all tabular-nums"
                                        value={editingCommission.amount}
                                        onChange={(e) => setEditingCommission({ ...editingCommission, amount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-neutral-400 text-lg">
                                        {editingCommission.type === 'PERCENTAGE' ? '%' : '₺'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setEditingCommission(null)}
                                className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-colors"
                            >
                                İptal
                            </button>
                            <button 
                                onClick={updateCommission}
                                className="flex-1 py-4 bg-neutral-900 text-white hover:bg-black rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-black/10 transition-all active:scale-95"
                            >
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAgentsPage
