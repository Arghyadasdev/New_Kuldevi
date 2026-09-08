import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/supabaseServer'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const BUCKET = 'product-images'

export async function POST(request) {
  try {
    const { error: authError } = await requireAdmin(request)
    if (authError) return NextResponse.json({ message: authError.message }, { status: authError.status })

    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name?.split('.').pop() || 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`

    const storage = supabaseAdmin()
    const { error: uploadError } = await storage.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = storage.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ url: publicUrl, public_id: path })
  } catch (error) {
    console.error('[UPLOAD error]', error.message)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
