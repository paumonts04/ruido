'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-5xl text-[#FF5C00] tracking-widest mb-2">
            RUIDO
          </h1>
          <p className="text-[10px] text-[#444] font-mono tracking-widest uppercase">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#1a1a1a] text-[#F0EAD6] font-mono text-xs px-4 py-3 pr-12 outline-none focus:border-[#FF5C00] transition-colors tracking-wide placeholder:text-[#444]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#FF5C00] transition-colors font-mono text-[10px] tracking-widest uppercase"
            >
              {showPassword ? 'ocultar' : 'ver'}
            </button>
          </div>

          {error && (
            <p className="text-[11px] text-[#FF5C00] font-mono tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF5C00] disabled:bg-[#333] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase py-4 hover:bg-[#FFE500] disabled:cursor-not-allowed transition-colors mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar →'}
          </button>
        </form>
      </div>
    </div>
  )
}