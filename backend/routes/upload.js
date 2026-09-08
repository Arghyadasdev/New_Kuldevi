import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import requireAuth from '../middleware/auth.js'

const router = express.Router()

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'))
    }
    cb(null, true)
  }
})

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    configureCloudinary()
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'kuldevi-stationers', resource_type: 'image' },
        (error, result) => error ? reject(error) : resolve(result)
      )
      Readable.from(req.file.buffer).pipe(stream)
    })

    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (error) {
    console.error('[UPLOAD error]', error.message)
    res.status(500).json({ message: error.message })
  }
})

export default router
