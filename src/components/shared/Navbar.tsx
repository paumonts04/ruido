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
    <nav className="border-b border-[#1a1a1a] relative">
      <div className="flex items-center justify-between px-4 sm:px-8 py-5">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-3xl text-[#FF5C00] tracking-widest hover:opacity-80 transition-opacity"
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
                  ? 'text-[#FF5C00]'
                  : 'text-[#888] hover:text-[#F0EAD6]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/eventos"
            className="text-[10px] tracking-widest font-bold font-mono text-[#888] px-4 py-2 hover:text-[#FF5C00] transition-colors"
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

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[#1a1a1a] flex flex-col px-4 py-4 gap-5 bg-[#080808]">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-[11px] tracking-widest uppercase font-mono transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[#FF5C00]'
                  : 'text-[#888] hover:text-[#F0EAD6]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
