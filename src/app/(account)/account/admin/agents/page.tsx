'use client'

import React, { useEffect, useState } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonThird from '@/shared/ButtonThird'
import toast from 'react-hot-toast'
import { Badge } from '@/shared/Badge' // Assuming Badge exists or similar

const AdminAgentsPage = () => {
    const [agents, setAgents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

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

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">Acente Yönetimi</h2>
                <p className="mt-2 text-neutral-500 dark:text-neutral-400">Yeni acente başvurularını onaylayın veya mevcutları yönetin.</p>
            </div>

            {loading ? (
                <div>Yükleniyor...</div>
            ) : (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Şirket / Yetkili</th>
                                    <th className="px-6 py-4 font-semibold">TÜRSAB No</th>
                                    <th className="px-6 py-4 font-semibold">Durum</th>
                                    <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                                {agents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-neutral-900 dark:text-white">{agent.agentProfile?.companyName}</div>
                                            <div className="text-neutral-500">{agent.agentProfile?.contactName}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{agent.agentProfile?.tursabNumber}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${agent.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    agent.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {agent.status === 'ACTIVE' ? 'Aktif' : agent.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {agent.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(agent.id, 'approve')}
                                                        className="text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        Onayla
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(agent.id, 'reject')}
                                                        className="text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Reddet
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminAgentsPage
