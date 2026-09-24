import path from 'path'
import fs   from 'fs'
import { prisma } from '../lib/prisma.js'

/* ────────────────────────────────────────────────────────────
   AI MODEL INFERENCE (Mock + Real bridge)

   NOTE: Ganti fungsi `runAIModel` ini dengan implementasi model
   nyata Anda. Opsi:
   1. HTTP call ke Python FastAPI service yang load EfficientNet-B0
   2. ONNX Runtime node: `import * as ort from 'onnxruntime-node'`
   3. TensorFlow.js: `import * as tf from '@tensorflow/tfjs-node'`
   ─────────────────────────────────────────────────────────── */

async function runAIModel(imagePath) {
  const start = Date.now()

  // ── Option 1: Call Python ML Service ──────────────────────
  // Uncomment jika Anda punya Python FastAPI service
  /*
  const { default: axios } = await import('axios')
  const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'
  const formData = new FormData()
  const imageBuffer = fs.readFileSync(imagePath)
  const blob = new Blob([imageBuffer])
  formData.append('file', blob, path.basename(imagePath))

  const { data } = await axios.post(`${AI_SERVICE_URL}/predict`, formData)
  return {
    ...data,
    processingTime: Date.now() - start,
  }
  */

  // ── Mock AI Response (for development) ────────────────────
  // Simulasi delay inference
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200))

  const verdicts    = ['LEGIT', 'FAKE', 'SUSPICIOUS']
  const categories  = ['Sneaker', 'Tas', 'Kaos', 'Jaket', 'Celana', 'Hoodie', 'Topi']
  const brands      = ['Nike', 'Adidas', 'Supreme', 'Off-White', 'Gucci', 'Bape', 'Louis Vuitton']

  const verdict    = verdicts[Math.floor(Math.random() * verdicts.length)]
  const confidence = verdict === 'LEGIT'
    ? 0.75 + Math.random() * 0.24
    : verdict === 'FAKE'
    ? 0.70 + Math.random() * 0.28
    : 0.45 + Math.random() * 0.25

  const category = categories[Math.floor(Math.random() * categories.length)]
  const brand    = brands[Math.floor(Math.random() * brands.length)]

  const LEGIT_POINTS = [
    'Jahitan konsisten dan rapi di seluruh bagian',
    'Logo terdeteksi dengan proporsi yang benar',
    'Material terlihat sesuai spesifikasi original',
    'Tag dan label dengan font yang tepat',
    'Warna konsisten dengan koleksi resmi',
  ]
  const FAKE_POINTS = [
    'Jahitan tidak rata terdeteksi di beberapa bagian',
    'Proporsi logo tidak sesuai standar brand',
    'Tekstur material berbeda dari spesifikasi original',
    'Font pada label tidak konsisten',
    'Warna sedikit berbeda dari referensi original',
  ]
  const SUSP_POINTS = [
    'Gambar kurang jelas untuk analisis detail',
    'Beberapa elemen sesuai, beberapa perlu dicek',
    'Rekomendasikan foto dari sudut berbeda',
    'Kualitas foto mempengaruhi akurasi analisis',
  ]

  const allPoints = verdict === 'LEGIT' ? LEGIT_POINTS
                  : verdict === 'FAKE'   ? FAKE_POINTS
                  : SUSP_POINTS

  const points = allPoints.slice(0, 3 + Math.floor(Math.random() * 2))

  const recommendations = {
    LEGIT:      'Produk ini terdeteksi sebagai original. Aman untuk dibeli atau dijual.',
    FAKE:       'Produk ini terdeteksi sebagai palsu. Hindari transaksi dan laporkan ke komunitas.',
    SUSPICIOUS: 'Hasil tidak konklusif. Coba upload foto yang lebih jelas atau dari sudut berbeda untuk hasil akurat.',
  }

  return {
    verdict,
    confidence,
    category,
    brand,
    model: 'EfficientNet-B0 (Mock)',
    processingTime: Date.now() - start,
    points,
    recommendation: recommendations[verdict],
  }
}

/* ── POST /api/verify ────────────────────────────────────── */
export async function verifyFashion(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'Gambar wajib diupload.' })
  }

  const imagePath = req.file.path
  const imageName = req.file.filename

  try {
    // Run AI model
    const aiResult = await runAIModel(imagePath)

    // Build image URL
    const imageUrl = `/uploads/${imageName}`

    // Save to database
    const verification = await prisma.verification.create({
      data: {
        userId:         req.user?.id || null,
        imageUrl,
        imageName,
        verdict:        aiResult.verdict,
        confidence:     aiResult.confidence,
        category:       aiResult.category,
        brand:          aiResult.brand,
        modelUsed:      aiResult.model || 'EfficientNet-B0',
        processingTime: aiResult.processingTime,
        points:         aiResult.points || [],
        recommendation: aiResult.recommendation,
        rawResult:      aiResult,
      },
    })

    return res.json({
      message: 'Verifikasi berhasil!',
      result: {
        id:             verification.id,
        verdict:        verification.verdict,
        confidence:     verification.confidence,
        category:       verification.category,
        brand:          verification.brand,
        model:          verification.modelUsed,
        processingTime: verification.processingTime,
        points:         verification.points,
        recommendation: verification.recommendation,
        imageUrl:       verification.imageUrl,
        createdAt:      verification.createdAt,
      },
    })
  } catch (err) {
    console.error('[verifyFashion]', err)
    // Clean up uploaded file on error
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
    return res.status(500).json({ message: 'Verifikasi gagal. Coba lagi.' })
  }
}

/* ── GET /api/verify/history ─────────────────────────────── */
export async function getHistory(req, res) {
  try {
    const history = await prisma.verification.findMany({
      where:   { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take:    50,
      select: {
        id:             true,
        imageUrl:       true,
        verdict:        true,
        confidence:     true,
        category:       true,
        brand:          true,
        modelUsed:      true,
        processingTime: true,
        points:         true,
        recommendation: true,
        createdAt:      true,
      },
    })

    return res.json({ history })
  } catch (err) {
    console.error('[getHistory]', err)
    return res.status(500).json({ message: 'Gagal mengambil riwayat.' })
  }
}

/* ── GET /api/verify/:id ─────────────────────────────────── */
export async function getVerification(req, res) {
  try {
    const item = await prisma.verification.findUnique({
      where: { id: req.params.id },
    })

    if (!item) return res.status(404).json({ message: 'Data tidak ditemukan.' })

    // Optional: only owner can view
    if (item.userId && item.userId !== req.user?.id) {
      return res.status(403).json({ message: 'Akses ditolak.' })
    }

    return res.json({ verification: item })
  } catch (err) {
    console.error('[getVerification]', err)
    return res.status(500).json({ message: 'Gagal mengambil data.' })
  }
}
