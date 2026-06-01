import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminEventosPage() {
  const supabase = await createClient()

  const { data: eventos } = await supabase
    .from('eventos')
    .select('*')
    .order('fecha', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest">
          EVENTOS
        </h1>
        <Link
          href="/admin/eventos/nuevo"
          className="bg-[#FF5C00] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase px-4 py-2 hover:bg-[#FFE500] transition-colors"
        >
          + Nuevo evento
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {!eventos || eventos.length === 0 ? (
          <p className="text-[#444] font-mono text-xs tracking-widest">No hay eventos todavía.</p>
        ) : (
          eventos.map(evento => (
            <div key={evento.id} className="flex items-center justify-between bg-[#0f0f0f] border border-[#1a1a1a] px-4 py-3 hover:border-[#FF5C00] transition-colors">
              <div className="flex items-center gap-6">
                <div className={`w-2 h-2 rounded-full ${evento.publicado ? 'bg-[#FFE500]' : 'bg-[#333]'}`} />
                <span className="font-[family-name:var(--font-display)] text-lg text-[#F0EAD6] tracking-widest">
                  {evento.titulo}
                </span>
                <span className="text-[10px] text-[#555] font-mono tracking-widest">
                  {new Date(evento.fecha).toLocaleDateString('es-ES')}
                </span>
                <span className="text-[10px] text-[#555] font-mono tracking-widest">
                  {evento.lugar}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-display)] text-lg text-[#FFE500]">
                  {evento.precio}€
                </span>
                <Link
                  href={`/admin/eventos/${evento.id}`}
                  className="text-[10px] text-[#555] font-mono tracking-widest hover:text-[#FF5C00] transition-colors uppercase"
                >
                  Editar →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}