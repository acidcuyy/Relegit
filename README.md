# Relegit — AI Fashion Authentication Platform

Platform autentikasi keaslian fashion berbasis AI untuk komunitas fashion Indonesia.

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| AI Model | EfficientNet-B0 (rekomendasi) |

---

## 🚀 Cara Menjalankan

### 1. Clone & Setup

```bash
# Sudah ada di direktori ini
```

### 2. Database (PostgreSQL)

Pastikan PostgreSQL sudah terinstall dan berjalan. Buat database:

```sql
CREATE DATABASE relegit_db;
```

### 3. Backend

```bash
cd backend
npm install

# Edit .env — sesuaikan DATABASE_URL dengan credentials PostgreSQL Anda

# Jalankan migrasi database
npm run db:push

# Generate Prisma client
npm run db:generate

# Jalankan server (development)
npm run dev
```

Backend akan berjalan di: `http://localhost:5000`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

---

## 📁 Struktur Proyek

```
WEBBB/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx  # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx    # Landing page
│   │   │   ├── Auth.jsx    # Login & Register
│   │   │   ├── Verify.jsx  # Upload & AI result
│   │   │   ├── History.jsx # Verification history
│   │   │   └── About.jsx   # About & tech info
│   │   ├── App.jsx         # Router
│   │   └── index.css       # Design system
│   └── .env
│
└── backend/                # Express.js
    ├── prisma/
    │   └── schema.prisma   # Database schema
    ├── src/
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   └── verifyController.js  ← AI bridge here
    │   ├── middleware/
    │   │   ├── auth.js     # JWT middleware
    │   │   └── upload.js   # Multer middleware
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   └── verifyRoutes.js
    │   ├── lib/
    │   │   └── prisma.js   # Prisma client
    │   └── server.js       # Entry point
    └── .env
```

---

## 🧠 AI Model Integration

Buka file `backend/src/controllers/verifyController.js` dan cari fungsi `runAIModel()`.

### Option A: Python FastAPI Service (Rekomendasi)

1. Buat Python service dengan FastAPI yang load model EfficientNet-B0
2. Set `AI_SERVICE_URL` di `.env` backend
3. Uncomment kode HTTP call di `runAIModel()`

### Option B: ONNX Runtime Node.js

```bash
npm install onnxruntime-node
```

```js
import * as ort from 'onnxruntime-node'
const session = await ort.InferenceSession.create('./model.onnx')
```

### Option C: TensorFlow.js

```bash
npm install @tensorflow/tfjs-node
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registrasi user |
| POST | `/api/auth/login` | ❌ | Login, dapat JWT |
| GET | `/api/auth/me` | ✅ | Data user |
| POST | `/api/verify` | Optional | Upload & verifikasi |
| GET | `/api/verify/history` | ✅ | Riwayat verifikasi |
| GET | `/api/verify/:id` | Optional | Detail verifikasi |
| GET | `/api/health` | ❌ | Health check |

---

## 🎨 Design System

- **Main color**: Purple (`#8b5cf6`, `#7c3aed`)
- **Secondary**: White
- **Font display**: Outfit (Google Fonts)
- **Font body**: Inter (Google Fonts)
- **Style**: Glassmorphism + dark mode

---

## 📱 Arsitektur AI — EfficientNet-B0

| Arsitektur | Params | Size | Akurasi | Mobile |
|---|---|---|---|---|
| MobileNetV2 | 3.4M | 14MB | 72% | ✅ |
| **EfficientNet-B0** | **5.3M** | **20MB** | **77%** | **✅** |
| ResNet-50 | 25M | 98MB | 76% | ⚠️ |
| DINOv2 (ViT-S) | 21M | 84MB | 81% | ⚠️ |

**EfficientNet-B0 dipilih** karena memberikan sweet spot terbaik antara akurasi dan efisiensi untuk deployment web (mobile + laptop).
