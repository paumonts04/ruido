import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ session_id?: string }>
}

export default async function ConfirmacionPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { session_id } = await searchParams

  if (!session_id) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-[#555] font-mono text-sm">Sesión no válida.</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-24 max-w-2xl mx-auto text-center">

      {/* Icono */}
      <div className="w-20 h-20 border-2 border-[#FFE500] flex items-center justify-content center mx-auto mb-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="font-[family-name:var(--font-display)] text-4xl text-[#FFE500]">✓</span>
      </div>

      {/* Título */}
      <h1 className="font-[family-name:var(--font-display)] text-[clamp(48px,8vw,80px)] leading-[0.9] text-[#F0EAD6] tracking-widest mb-6">
        ENTRADA<br />
        <span className="text-[#FFE500]">CONFIRMADA</span>
      </h1>

      <p className="text-sm text-[#888] font-mono leading-relaxed mb-4">
        Tu pago se ha procesado correctamente.<br />
        Recibirás un email con los detalles de tu entrada.
      </p>

      <p className="text-[10px] text-[#444] font-mono tracking-widest mb-12">
        REF: {session_id.slice(-12).toUpperCase()}
      </p>

      <div className="h-px bg-[#1a1a1a] mb-12" />

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/eventos"
          className="bg-[#FF5C00] text-[#080808] font-mono font-bold text-xs tracking-widest uppercase px-6 py-3 hover:bg-[#FFE500] transition-colors"
        >
          Ver más eventos →
        </Link>
        <Link
          href={`/eventos/${slug}`}
          className="border border-[#333] text-[#888] font-mono text-xs tracking-widest uppercase px-6 py-3 hover:border-[#FF5C00] hover:text-[#F0EAD6] transition-colors"
        >
          Volver al evento
        </Link>
      </div>

    </div>
  )
}