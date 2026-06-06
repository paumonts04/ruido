import { createClient } from '@/lib/supabase/server'
import FiltroEntradas from '@/components/admin/FiltroEntradas'

type Props = {
  searchParams: Promise<{ evento?: string }>
}

export default async function AdminEntradasPage({ searchParams }: Props) {
  const { evento } = await searchParams
  const supabase = await createClient()

  // Fetch eventos that have at least one entrada
  const { data: eventosConEntradas } = await supabase
    .from('entradas')
    .select('evento_id, eventos(id, titulo)')
    .not('evento_id', 'is', null)

  const eventosUnicos = Array.from(
    new Map(
      (eventosConEntradas ?? [])
        .map(e => (e.eventos as any))
        .filter(Boolean)
        .map((ev: { id: string; titulo: string }) => [ev.id, ev])
    ).values()
  ) as { id: string; titulo: string }[]

  let query = supabase
    .from('entradas')
    .select('*, eventos(titulo)')
    .order('created_at', { ascending: false })

  if (evento) query = query.eq('evento_id', evento)

  const { data: entradas } = await query

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest mb-8">
        ENTRADAS
      </h1>

      <FiltroEntradas eventos={eventosUnicos} eventoActual={evento ?? 'todos'} />

      <div className="flex flex-col gap-2 mt-6">
        {!entradas || entradas.length === 0 ? (
          <p className="text-[#444] font-mono text-xs tracking-widest">No hay entradas todavía.</p>
        ) : (
          entradas.map(entrada => (
            <div key={entrada.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#0f0f0f] border border-[#1a1a1a] px-4 py-3 gap-2 sm:gap-0">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className={`w-2 h-2 rounded-full shrink-0 ${entrada.estado === 'completada' ? 'bg-[#FFE500]' : entrada.estado === 'cancelada' ? 'bg-[#FF5C00]' : 'bg-[#333]'}`} />
                <div>
                  <div className="font-[family-name:var(--font-display)] text-base sm:text-lg text-[#F0EAD6] tracking-widest">
                    {entrada.nombre}
                  </div>
                  <div className="text-[10px] text-[#555] font-mono tracking-widest">
                    {entrada.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8 flex-wrap pl-6 sm:pl-0">
                <div className="text-[10px] text-[#555] font-mono tracking-widest">
                  {(entrada.eventos as any)?.titulo}
                </div>
                <div className="text-[10px] text-[#555] font-mono tracking-widest">
                  {entrada.cantidad} {entrada.cantidad === 1 ? 'entrada' : 'entradas'}
                </div>
                <div className="text-[10px] text-[#555] font-mono tracking-widest">
                  {new Date(entrada.created_at!).toLocaleDateString('es-ES')}
                </div>
                <div className={`text-[10px] font-mono tracking-widest uppercase ${entrada.estado === 'completada' ? 'text-[#FFE500]' : entrada.estado === 'cancelada' ? 'text-[#FF5C00]' : 'text-[#555]'}`}>
                  {entrada.estado}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
