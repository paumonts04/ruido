'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Foto = {
  id: number
  url: string
  descripcion: string | null
  eventos: { titulo: string; fecha: string } | null
}

export default function GaleriaGrid({ fotos }: { fotos: Foto[] }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [imgKey, setImgKey] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right'>('left')
  const touchStartX = useRef<number | null>(null)

  const current = selected !== null ? fotos[selected] : null

  const prev = () => {
    setAnimDir('left')
    setSelected(i => (i !== null ? (i - 1 + fotos.length) % fotos.length : null))
    setImgKey(k => k + 1)
  }
  const next = () => {
    setAnimDir('right')
    setSelected(i => (i !== null ? (i + 1) % fotos.length : null))
    setImgKey(k => k + 1)
  }
  const close = () => setSelected(null)

  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected])

  return (
    <>
      <style>{`
        @keyframes slide-from-right { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-from-left  { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {fotos.map((foto, i) => (
          <div
            key={foto.id}
            className="break-inside-avoid group relative overflow-hidden cursor-zoom-in"
            onClick={() => setSelected(i)}
          >
            <div className="relative w-full">
              <Image
                src={foto.url}
                alt={foto.descripcion ?? ''}
                width={600}
                height={400}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
            </div>
            {foto.eventos && (
              <div className="absolute bottom-0 left-0 right-0 bg-[#080808]/80 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="font-[family-name:var(--font-display)] text-sm text-[#FF5C00] tracking-widest">
                  {foto.eventos.titulo}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          selected !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(8,8,8,0.95)' }}
        onClick={close}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return
          const dx = e.changedTouches[0].clientX - touchStartX.current
          if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
          touchStartX.current = null
        }}
      >
        {current && (
          <div
            key={imgKey}
            className="relative max-w-5xl w-full mx-4"
            style={{ animation: `slide-from-${animDir} 0.25s ease` }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.descripcion ?? ''}
              width={1200}
              height={800}
              className="w-full max-h-[80vh] object-contain"
              priority
            />
            {current.eventos && (
              <div className="mt-3 font-[family-name:var(--font-display)] text-sm text-[#FF5C00] tracking-widest">
                {current.eventos.titulo}
              </div>
            )}
            {current.descripcion && (
              <div className="mt-1 text-[11px] text-[#555] font-mono tracking-widest uppercase">
                {current.descripcion}
              </div>
            )}
          </div>
        )}

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F0EAD6] hover:text-[#FF5C00] transition-colors text-3xl font-mono p-2"
          onClick={e => { e.stopPropagation(); prev() }}
          aria-label="Anterior"
        >
          ←
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F0EAD6] hover:text-[#FF5C00] transition-colors text-3xl font-mono p-2"
          onClick={e => { e.stopPropagation(); next() }}
          aria-label="Siguiente"
        >
          →
        </button>

        <button
          className="absolute top-4 right-4 text-[#F0EAD6] hover:text-[#FF5C00] transition-colors text-2xl font-mono p-2"
          onClick={close}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {selected !== null && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-[#555] font-mono tracking-widest">
            {selected + 1} / {fotos.length}
          </div>
        )}
      </div>
    </>
  )
}