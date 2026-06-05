import { createClient } from '@/lib/supabase/server'
import GaleriaGrid from '@/components/shared/GaleriaGrid'

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
        <GaleriaGrid fotos={fotos as any} />
      )}
    </div>
  )
}