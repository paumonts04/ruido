import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdmin } from '@/lib/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const nombre = formData.get('nombre') as string

    if (!file || !nombre) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 422 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'El archivo supera los 5MB' }, { status: 422 })
    }

    if (!/^[\w\-. ]+$/.test(nombre)) {
      return NextResponse.json({ error: 'Nombre de archivo inválido' }, { status: 422 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { data, error } = await supabase.storage
      .from('galeria')
      .upload(nombre, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const { data: urlData } = supabase.storage.from('galeria').getPublicUrl(nombre)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch {
    return NextResponse.json({ error: 'Error al subir' }, { status: 500 })
  }
}