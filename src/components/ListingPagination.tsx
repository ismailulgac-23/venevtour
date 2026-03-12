'use client'

import React from 'react'
import {
  Pagination,
  PaginationList,
  PaginationPage,
  PaginationPrevious,
  PaginationNext,
  PaginationGap,
} from '@/shared/Pagination'
import { usePathname, useSearchParams } from 'next/navigation'

interface Props {
  totalPages: number
}

export const ListingPagination = ({ totalPages }: Props) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  // Helper to generate page numbers with gaps
  const getPages = () => {
    const pages: (number | string)[] = []
    const showMax = 5

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('gap')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('gap')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    return pages
  }

  return (
    <Pagination>
      <PaginationPrevious 
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : null}
        scroll={true}
      />
      <PaginationList>
        {getPages().map((page, index) => {
          if (page === 'gap') {
            return <PaginationGap key={`gap-${index}`} />
          }
          return (
            <PaginationPage
              key={page}
              href={createPageUrl(page)}
              current={page === currentPage}
              scroll={true}
            >
              {page}
            </PaginationPage>
          )
        })}
      </PaginationList>
      <PaginationNext 
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : null}
        scroll={true}
      />
    </Pagination>
  )
}
