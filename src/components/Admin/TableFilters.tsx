'use client'

import React, { FC } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

interface FilterOption {
    label: string
    value: string
}

interface TableFiltersProps {
    searchTerm: string
    onSearchChange: (val: string) => void
    filters?: {
        label: string
        name: string
        options: FilterOption[]
        value: string
        onChange: (val: string) => void
    }[]
    placeholder?: string
}

const TableFilters: FC<TableFiltersProps> = ({ 
    searchTerm, 
    onSearchChange, 
    filters = [], 
    placeholder = "Ara..." 
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[20px] shadow-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm"
                />
            </div>

            {/* Custom Filters */}
            {filters.map((filter, i) => (
                <div key={i} className="min-w-[180px] relative">
                    <select
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="w-full pl-4 pr-10 py-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-[20px] shadow-sm focus:ring-2 focus:ring-primary-500 appearance-none transition-all font-bold text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-300 cursor-pointer"
                    >
                        <option value="">{filter.label} (Hepsi)</option>
                        {filter.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                        <FunnelIcon className="size-4" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TableFilters
