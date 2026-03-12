'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { 
    BanknotesIcon, 
    ArrowTrendingUpIcon, 
    ShoppingCartIcon, 
    PercentBadgeIcon,
    CalendarDaysIcon,
    FunnelIcon,
    DocumentArrowDownIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline'
import DatePicker, { registerLocale } from 'react-datepicker'
import tr from 'date-fns/locale/tr'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import DatePickerCustomDay from '@/components/DatePickerCustomDay'
import DatePickerCustomHeaderTwoMonth from '@/components/DatePickerCustomHeaderTwoMonth'
import { Fragment } from 'react'

registerLocale('tr', tr)

const AgentRevenuePage = () => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [endDate, setEndDate] = useState<Date | null>(new Date())

    const fetchRevenue = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (startDate) params.append('startDate', startDate.toISOString())
            if (endDate) params.append('endDate', endDate.toISOString())

            const res = await fetch(`/api/agent/revenue?${params.toString()}`)
            if (res.ok) {
                const json = await res.json()
                setData(json.data)
            } else {
                toast.error('Veriler getirilemedi.')
            }
        } catch (error) {
            console.error(error)
            toast.error('Hata oluştu.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRevenue()
    }, [startDate, endDate])

    const summary = data?.summary
    const history = data?.history || []

    return (
        <div className="space-y-10 pb-24">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase italic">Kazanç & Analiz Raporu</h2>
                    <p className="mt-2 text-neutral-500 font-medium tracking-tight">Satış performansınızı ve hakedişlerinizi anlık olarak takip edin.</p>
                </div>
                
                <div className="relative group">
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <PopoverButton
                                    className={clsx(
                                        "flex items-center gap-3 bg-white dark:bg-neutral-800 p-2 pl-6 pr-2 rounded-[30px] border border-neutral-100 dark:border-neutral-700 shadow-sm focus:outline-none transition-all",
                                        open && "ring-2 ring-primary-600 border-transparent shadow-xl"
                                    )}
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none mb-1">Tarih Aralığı</span>
                                        <span className="text-sm font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">
                                            {startDate?.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                                            {" - "}
                                            {endDate?.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="size-12 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white rounded-[20px] flex items-center justify-center">
                                        <CalendarDaysIcon className="size-5" />
                                    </div>
                                </PopoverButton>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <PopoverPanel className="absolute right-0 z-50 mt-4 w-screen max-w-3xl bg-white dark:bg-neutral-800 rounded-[40px] shadow-2xl border border-neutral-100 dark:border-neutral-700 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h4 className="text-xl font-black uppercase italic tracking-tighter">Analiz Periyodu</h4>
                                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Lütfen tarih aralığı seçin</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const now = new Date();
                                                        setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
                                                        setEndDate(new Date());
                                                    }}
                                                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                                                >
                                                    Bu Ay
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        const now = new Date();
                                                        setStartDate(new Date(now.getFullYear(), 0, 1));
                                                        setEndDate(new Date());
                                                    }}
                                                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                                                >
                                                    Bu Yıl
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-center overflow-x-auto">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(dates: [Date | null, Date | null]) => {
                                                    const [start, end] = dates;
                                                    setStartDate(start);
                                                    setEndDate(end);
                                                }}
                                                startDate={startDate}
                                                endDate={endDate}
                                                selectsRange
                                                monthsShown={2}
                                                showPopperArrow={false}
                                                inline
                                                locale="tr"
                                                renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
                                                renderDayContents={(day, date) => <DatePickerCustomDay dayOfMonth={day} date={date} />}
                                            />
                                        </div>
                                    </PopoverPanel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: 'TOPLAM SATIŞ', 
                        value: summary?.totalSales || 0, 
                        icon: ShoppingCartIcon, 
                        color: 'blue',
                        label: 'Brüt Kazanç'
                    },
                    { 
                        title: 'PLATFORM PAYI', 
                        value: summary?.adminCommission || 0, 
                        icon: PercentBadgeIcon, 
                        color: 'amber',
                        label: 'Giden Komisyon'
                    },
                    { 
                        title: 'NET HAKEDİŞ', 
                        value: summary?.agentNet || 0, 
                        icon: BanknotesIcon, 
                        color: 'emerald',
                        label: 'Net Kazanç',
                        primary: true
                    },
                    { 
                        title: 'REZERVASYON', 
                        value: summary?.reservationCount || 0, 
                        icon: ArrowTrendingUpIcon, 
                        color: 'rose',
                        label: 'Toplam Adet',
                        isCount: true
                    }
                ].map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={card.title}
                        className={clsx(
                            "relative overflow-hidden group p-8 rounded-[40px] border border-neutral-100 dark:border-neutral-800 shadow-sm",
                            card.primary ? "bg-neutral-900 border-neutral-900 text-white shadow-2xl shadow-emerald-900/10" : "bg-white dark:bg-neutral-900"
                        )}
                    >
                        <div className="relative z-10">
                            <div className={clsx(
                                "size-12 rounded-2xl flex items-center justify-center mb-6",
                                card.primary ? "bg-emerald-500/20 text-emerald-400" : `bg-${card.color}-50 dark:bg-${card.color}-900/20 text-${card.color}-600`
                            )}>
                                <card.icon className="size-6" />
                            </div>
                            <h3 className={clsx("text-[10px] font-black uppercase tracking-widest opacity-60", card.primary ? "text-white" : "text-neutral-400")}>{card.title}</h3>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-3xl font-black tabular-nums">
                                    {card.isCount ? card.value : Number(card.value).toLocaleString('tr-TR')}
                                </span>
                                {!card.isCount && <span className="text-sm font-bold opacity-60">₺</span>}
                            </div>
                            <p className={clsx("mt-4 text-[10px] font-bold uppercase tracking-widest", card.primary ? "text-emerald-400" : "text-neutral-500")}>
                                {card.label}
                            </p>
                        </div>
                        {/* Decorative Gradient Overlay */}
                        <div className={clsx(
                            "absolute -right-4 -bottom-4 size-32 rounded-full blur-[60px] opacity-10 transition-transform group-hover:scale-150 duration-700",
                            `bg-${card.color}-500`
                        )}></div>
                    </motion.div>
                ))}
            </div>

            {/* CHART-LIKE VISUALIZATION (SIMPLE) */}
            <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 p-10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-extrabold uppercase italic tracking-tighter">Kazanç Dağılım Grafiği</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Net Hakediş</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-amber-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Komisyon</span>
                        </div>
                    </div>
                </div>
                
                {history.length > 0 ? (
                    <div className="space-y-8">
                        {history.slice(-10).reverse().map((day: any) => {
                            const total = day.sales;
                            const netWidth = (day.net / total) * 100;
                            const commWidth = (day.commission / total) * 100;

                            return (
                                <div key={day.date} className="group">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black uppercase tracking-tighter text-neutral-400">
                                            {new Date(day.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'short' })}
                                        </span>
                                        <div className="flex gap-4">
                                            <span className="text-xs font-bold text-neutral-900 dark:text-white">{Number(day.net).toLocaleString('tr-TR')} ₺</span>
                                            <span className="text-xs font-bold text-neutral-300">/</span>
                                            <span className="text-xs font-bold text-neutral-400">{Number(day.sales).toLocaleString('tr-TR')} ₺</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${netWidth}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            className="h-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors"
                                        ></motion.div>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${commWidth}%` }}
                                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                            className="h-full bg-amber-500 group-hover:bg-amber-400 transition-colors"
                                        ></motion.div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs">
                        Bu tarih aralığında veri bulunamadı.
                    </div>
                )}
            </div>

            {/* DETAILED HISTORY TABLE */}
            <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 overflow-hidden shadow-sm">
                <div className="p-8 border-b dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 italic">Günlük Detaylar</h3>
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-primary-600 transition-colors">
                        <DocumentArrowDownIcon className="size-4" />
                        Excel İndir
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b dark:border-neutral-800">
                            <tr>
                                <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Tarih</th>
                                <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-center">İşlem</th>
                                <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Brüt Satış</th>
                                <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400">Komisyon</th>
                                <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-neutral-400 text-right">Net Hakediş</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-900 dark:text-white">
                            {history.slice().reverse().map((row: any) => (
                                <tr key={row.date} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors font-medium">
                                    <td className="px-8 py-6 font-bold uppercase tracking-tighter text-neutral-500 group-hover:text-neutral-900">
                                        {new Date(row.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-center tabular-nums">
                                        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 font-bold text-xs italic">
                                            {row.count}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 tabular-nums font-bold">
                                        {Number(row.sales).toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td className="px-8 py-6 text-amber-600 tabular-nums text-xs italic">
                                        - {Number(row.commission).toLocaleString('tr-TR')} ₺
                                    </td>
                                    <td className="px-8 py-6 text-right tabular-nums text-emerald-600 font-black italic text-lg">
                                        {Number(row.net).toLocaleString('tr-TR')} ₺
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-neutral-400 font-bold uppercase tracking-widest text-xs">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AgentRevenuePage
