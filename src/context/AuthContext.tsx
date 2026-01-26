'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
    id: string
    email: string
    role: 'ADMIN' | 'AGENT' | 'CUSTOMER'
    status: string
    avatarUrl?: string
    customerProfile?: any
    agentProfile?: any
}

interface AuthContextType {
    user: User | null
    loading: boolean
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me')
            if (res.ok) {
                const json = await res.json()
                setUser(json.data)
            } else {
                setUser(null)
            }
        } catch (e) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
