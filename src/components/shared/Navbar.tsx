'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="border-b border-[var(--c-gris-mid)] relative">
      <div className="flex items-center justify-between px-4 sm:px-8 py-5">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-3xl text-[var(--c-naranja)] tracking-widest hover:opacity-80 transition-opacity"
        >
          RUIDO
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[10px] tracking-widest uppercase font-mono transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[var(--c-naranja)]'
                  : 'text-[var(--c-texto)] hover:text-[var(--c-crema)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/eventos"
            className="text-[10px] tracking-widest font-bold font-mono bg-[var(--c-naranja)] text-[var(--c-negro)] px-4 py-2 hover:bg-[var(--c-amarillo)] transition-colors"
          >
            Entradas →
          </Link>
          <button
            className="md:hidden flex flex-col gap-1.5 p-1 text-[#F0EAD6]"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
          >
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--c-gris-mid)] flex flex-col px-4 py-4 gap-5 bg-[#080808]">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[11px] tracking-widest uppercase font-mono transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[var(--c-naranja)]'
                  : 'text-[var(--c-texto)] hover:text-[var(--c-crema)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
