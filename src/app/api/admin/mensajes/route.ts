import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth'
import { mensajeLeidoSchema } from '@/lib/schemas'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  try {
    const body = await req.json()
    const parsed = mensajeLeidoSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('mensajes_contacto')
      .update({ leido: parsed.data.leido })
      .eq('id', parsed.data.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}