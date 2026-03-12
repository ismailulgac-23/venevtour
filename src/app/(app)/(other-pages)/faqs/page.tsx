'use client'

import React, { useEffect, useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import BgGlassmorphism from '@/components/BgGlassmorphism'

const FAQPage = () => {
    const [faqs, setFaqs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        fetchFaqs()
    }, [])

    return (
        <div className="relative overflow-hidden min-h-screen">
            <BgGlassmorphism />
            <div className="container py-16 lg:py-24 space-y-16">
                <div className="max-w-2xl">
                    <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white uppercase italic">Sıkça Sorulan Sorular</h2>
                    <p className="mt-4 text-lg text-neutral-500 font-medium">Seyahatinizle ilgili merak ettiğiniz tüm soruların cevaplarını burada bulabilirsiniz.</p>
                </div>

                <div className="max-w-3xl space-y-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-20 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-3xl" />
                        ))
                    ) : faqs.length > 0 ? (
                        faqs.map((item) => (
                            <Disclosure key={item.id} as="div" className="bg-white dark:bg-neutral-800 rounded-[32px] border border-neutral-100 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <DisclosureButton className="group flex w-full items-center justify-between p-6 text-left focus:outline-none">
                                    <span className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">{item.question}</span>
                                    <ChevronDownIcon className="size-5 text-neutral-500 group-data-[open]:rotate-180 transition-transform" />
                                </DisclosureButton>
                                <DisclosurePanel className="px-6 pb-6 text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                                    {item.answer}
                                </DisclosurePanel>
                            </Disclosure>
                        ))
                    ) : (
                        <p className="text-neutral-500">Henüz soru eklenmemiş.</p>
                    )}
                </div>

                <div className="p-10 bg-primary-600 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary-600/20">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold uppercase italic">Hala sorunuz mu var?</h3>
                        <p className="text-primary-100 font-medium italic opacity-80 uppercase tracking-widest text-xs">Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
                    </div>
                    <a href="/contact" className="px-10 py-4 bg-white text-primary-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-neutral-50 transition-colors shadow-lg shadow-black/10">BİZE ULAŞIN</a>
                </div>
            </div>
        </div>
    )
}

export default FAQPage
