'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/eventos', label: 'Eventos' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--c-gris-mid)]">
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

      <Link
        href="/eventos"
        className="text-[10px] tracking-widest font-bold font-mono bg-[var(--c-naranja)] text-[var(--c-negro)] px-4 py-2 hover:bg-[var(--c-amarillo)] transition-colors"
      >
        Entradas →
      </Link>
    </nav>
  )
}