import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function GaleriaPage() {
  const supabase = await createClient()

  const { data: fotos } = await supabase
    .from('galeria')
    .select('*, eventos(titulo, fecha)')
    .order('orden', { ascending: true })

  return (
    <div className="px-8 py-16">
      <div className="mb-12">
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,8vw,96px)] leading-[0.85] text-[#F0EAD6] tracking-widest mb-4">
          GALERÍA
        </h1>
        <p className="text-xs text-[#555] font-mono tracking-widest uppercase">
          Momentos de nuestros eventos
        </p>
      </div>

      <div className="h-px bg-[#1a1a1a] mb-12" />

      {!fotos || fotos.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-[#0f0f0f] border border-[#1a1a1a] flex items-center justify-center"
            >
              <span className="font-[family-name:var(--font-display)] text-[#1a1a1a] text-4xl tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {fotos.map(foto => (
            <div key={foto.id} className="break-inside-avoid group relative overflow-hidden">
              <img
                src={foto.url}
                alt={foto.descripcion ?? ''}
                className="w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {foto.eventos && (
                <div className="absolute bottom-0 left-0 right-0 bg-[#080808]/80 px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="font-[family-name:var(--font-display)] text-sm text-[#FF5C00] tracking-widest">
                    {(foto.eventos as any).titulo}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}