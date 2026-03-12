"use client";
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import TableFilters from '@/components/Admin/TableFilters'
import { ChartBarSquareIcon } from '@heroicons/react/24/outline'

const AdminRevenuePage = () => {
    const [agentEarnings, setAgentEarnings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchEarnings = async () => {
        try {
            const res = await fetch('/api/admin/revenue/agents')
            if (res.ok) {
                const json = await res.json()
                setAgentEarnings(json.data)
            }
        } catch (error) {
            toast.error('Veriler yüklenemedi.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEarnings()
    }, [])

    const filteredEarnings = agentEarnings.filter(item =>
        item.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Kazanç Raporları</h2>
                    <p className="mt-1 text-neutral-500 font-medium">Acentelerin satış performansını ve platform komisyonlarını detaylıca inceleyin.</p>
                </div>
                <div className="bg-neutral-900 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
                    <ChartBarSquareIcon className="size-5 text-primary-400" />
                    <span className="text-xl font-black">{filteredEarnings.length}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Acente</span>
                </div>
            </div>

            <TableFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Acente veya yetkili ismine göre ara..."
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
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Acente</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-center">Satış Adedi</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Brüt Satış</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Platform Payı</th>
                                    <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Acente Hakediş</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700 text-neutral-900 dark:text-white font-medium">
                                {filteredEarnings.map((item) => (
                                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-6 py-6 border-r border-neutral-50 dark:border-neutral-800">
                                            <div className="font-bold mb-0.5">{item.companyName}</div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase">{item.contactName}</div>
                                        </td>
                                        <td className="px-6 py-6 text-center tabular-nums font-black italic">
                                            {item.reservationCount}
                                        </td>
                                        <td className="px-6 py-6 tabular-nums font-bold">
                                            {Number(item.totalSales).toLocaleString('tr-TR')} ₺
                                        </td>
                                        <td className="px-6 py-6 text-primary-600 tabular-nums font-black italic text-base">
                                            {Number(item.adminCommission).toLocaleString('tr-TR')} ₺
                                        </td>
                                        <td className="px-6 py-6 text-green-600 tabular-nums font-black italic text-base">
                                            {Number(item.agentNet).toLocaleString('tr-TR')} ₺
                                        </td>
                                    </tr>
                                ))}
                                {filteredEarnings.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-neutral-500">
                                            Arama sonucuna uygun kazanç verisi bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminRevenuePage
