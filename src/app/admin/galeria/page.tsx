import { createClient } from '@/lib/supabase/server'
import GaleriaAdmin from '@/components/admin/GaleriaAdmin'

export default async function AdminGaleriaPage() {
  const supabase = await createClient()

  const { data: fotos } = await supabase
    .from('galeria')
    .select('*, eventos(titulo)')
    .order('orden', { ascending: true })

  const { data: eventos } = await supabase
    .from('eventos')
    .select('id, titulo')
    .order('fecha', { ascending: false })

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#F0EAD6] tracking-widest mb-8">
        GALERÍA
      </h1>
      <GaleriaAdmin fotos={fotos ?? []} eventos={eventos ?? []} />
    </div>
  )
}