'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/entradas', label: 'Entradas' },
  { href: '/admin/mensajes', label: 'Mensajes' },
  { href: '/admin/galeria', label: 'Galería' }
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-[#1a1a1a]">
        <span className="font-[family-name:var(--font-display)] text-xl text-[#FF5C00] tracking-widest">
          RUIDO
        </span>
        <button
          className="flex flex-col gap-1.5 p-1 text-[#F0EAD6]"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menú"
        >
          <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden border-b border-[#1a1a1a] flex flex-col px-4 py-4 gap-1">
          {links.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
            const isAdmin = pathname === '/admin' && href === '/admin'
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-[11px] tracking-widest font-mono uppercase px-3 py-2 transition-colors ${
                  active || isAdmin ? 'text-[#FF5C00]' : 'text-[#555] hover:text-[#F0EAD6]'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="text-[11px] tracking-widest font-mono uppercase text-[#444] hover:text-[#FF5C00] transition-colors text-left px-3 py-2 mt-2"
          >
            Cerrar sesión →
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r border-[#1a1a1a] flex-col py-8 px-6 shrink-0">
        <div className="font-[family-name:var(--font-display)] text-2xl text-[#FF5C00] tracking-widest mb-10">
          RUIDO
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(({ href, label, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin'
            const isAdmin = pathname === '/admin' && href === '/admin'
            return (
              <Link
                key={href}
                href={href}
                className={`text-[11px] tracking-widest font-mono uppercase px-3 py-2 transition-colors ${
                  active || isAdmin
                    ? 'text-[#FF5C00] bg-[#0f0f0f]'
                    : 'text-[#555] hover:text-[#F0EAD6]'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="text-[11px] tracking-widest font-mono uppercase text-[#444] hover:text-[#FF5C00] transition-colors text-left px-3 py-2"
        >
          Cerrar sesión →
        </button>
      </aside>
    </>
  )
}
