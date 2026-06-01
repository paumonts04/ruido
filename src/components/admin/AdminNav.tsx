'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/entradas', label: 'Entradas' },
  { href: '/admin/mensajes', label: 'Mensajes' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 border-r border-[#1a1a1a] flex flex-col py-8 px-6 shrink-0">
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
  )
}