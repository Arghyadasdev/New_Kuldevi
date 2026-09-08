import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import { getAuthAdmin } from '@/lib/auth'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL
  if (!url) {
    throw new Error('CLOUDINARY_URL not set in environment')
  }
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/)
  if (!match) {
    throw new Error(`CLOUDINARY_URL format invalid: ${url}`)
  }
  cloudinary.config({ api_key: match[1], api_secret: match[2], cloud_name: match[3] })
}

export async function POST(request) {
  try {
    const { error } = getAuthAdmin(request)
    if (error) return NextResponse.json({ message: error.message }, { status: error.status })

    const formData = await request.formData()
    const file = formData.get('image')

    if (!file) return NextResponse.json({ message: 'No file uploaded' }, { status: 400 })
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ message: 'Only image files allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 })
    }

    configureCloudinary()
    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'kuldevi-stationers', resource_type: 'image' },
        (err, res) => err ? reject(err) : resolve(res)
      )
      Readable.from(buffer).pipe(stream)
    })

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id })
  } catch (error) {
    console.error('[UPLOAD error]', error.message)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
