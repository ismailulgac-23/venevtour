"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/shared/Logo'

const Page = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const json = await res.json()
        const user = json.data

        if (user.role === 'AGENT') {
          router.push('/account/agent')
        } else if (user.role === 'ADMIN') {
          router.push('/account/admin')
        } else {
          router.push('/account/customer')
        }
      } catch (e) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Logo className="w-24 animate-pulse" />
          <p className="text-neutral-500">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return null
}

export default Page
