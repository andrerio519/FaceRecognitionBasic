# Face Recognition Web Application

Aplikasi web untuk registrasi dan pengenalan wajah menggunakan face-api.js, PHP, dan MySQL dengan arsitektur modular dan UI yang responsif.

## Features

- ✅ Registrasi wajah baru dengan capture foto otomatis
- ✅ Pengenalan wajah real-time dari database
- ✅ Deteksi duplikasi wajah saat registrasi
- ✅ Visual feedback dengan face bounding box
- ✅ Loading animations dan progress indicators
- ✅ Penyimpanan face descriptor (128D vector)
- ✅ Akses kamera browser dengan auto-stabilization
- ✅ UI responsif dan user-friendly
- ✅ Arsitektur modular dan maintainable

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Modular)
- **Face Detection:** face-api.js (TinyFaceDetector, FaceLandmark68Net, FaceRecognitionNet)
- **Backend:** PHP 7.4+ (PDO)
- **Database:** MySQL 5.7+
- **Server:** Apache/Nginx (XAMPP/WAMP recommended)

## Prerequisites

- PHP >= 7.4
- MySQL >= 5.7
- Apache/Nginx web server
- Modern browser dengan webcam support
- HTTPS/Localhost (required untuk akses kamera)

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/andrerio519/FaceRecognitionBasic.git
cd FaceRecognitionBasic
```

### 2. Buat Struktur Folder

```bash
mkdir -p api assets/css assets/js assets/libs assets/images model uploads docs
```

### 3. Setup Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE face_recognition_db;
USE face_recognition_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    face_descriptor TEXT NOT NULL,
    photo_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_name ON users(name);
```

### 4. Konfigurasi Database

Copy template konfigurasi:

```bash
cp api/config.example.php api/config.php
```

Edit `api/config.php`:

```php
$host = 'localhost';
$dbname = 'face_recognition_db';
$username = 'root';
$password = 'your_password';
```

### 5. Download Face-API Models

Download model files dan taruh di folder `model/`:

**Via CDN (Recommended):**
```bash
cd model
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/tiny_face_detector_model-weights_manifest.json
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/tiny_face_detector_model-shard1.bin
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_landmark_68_model-weights_manifest.json
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_landmark_68_model-shard1.bin
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_recognition_model-weights_manifest.json
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_recognition_model-shard1.bin
wget https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_recognition_model-shard2.bin
```

Atau download manual dari: https://github.com/vladmandic/face-api/tree/master/model

### 6. Konfigurasi Path

Edit `assets/js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'api/',      // Path ke folder API
    MODEL_PATH: 'model/',      // Path ke folder model
    // ... rest of config
};
```

### 7. Setup Web Server

**XAMPP:**
- Copy project ke `C:/xampp/htdocs/FaceRecognitionBasic/`
- Start Apache dan MySQL
- Akses: `http://localhost/FaceRecognitionBasic/`

**PHP Built-in Server:**
```bash
php -S localhost:8000
```

## Project Structure

```
FaceRecognitionBasic/
├── index.html                    # Main UI (refactored)
├── .gitignore                    # Git ignore rules
├── README.md                     # Documentation
│
├── api/                          # Backend API
│   ├── config.php               # Database config (gitignored)
│   ├── config.example.php       # Config template
│   ├── register.php             # Registrasi API
│   ├── recognize.php            # Pengenalan API
│   └── check_face.php           # Cek duplikasi API
│
├── assets/                       # Frontend assets
│   ├── css/
│   │   ├── main.css            # Main styles
│   │   └── animations.css      # Animations & transitions
│   ├── js/
│   │   ├── config.js           # Global configuration
│   │   ├── camera.js           # Camera management
│   │   ├── api.js              # API calls handler
│   │   ├── ui.js               # UI manipulation
│   │   ├── face-detection.js  # Face detection logic
│   │   └── app.js              # Main application
│   └── libs/
│       └── face-api.js         # Face-API library
│
├── model/                        # Face-API models
│   ├── tiny_face_detector_model-*
│   ├── face_landmark_68_model-*
│   └── face_recognition_model-*
│
├── uploads/                      # User photos (gitignored)
│   ├── .htaccess               # Access protection
│   └── face_*.jpg
│
└── docs/                         # Additional documentation
    └── (optional docs)
```

## Usage

### Registrasi Wajah Baru

1. Buka aplikasi di browser
2. Masukkan nama di form "Registrasi Wajah Baru"
3. Klik "Mulai Registrasi"
4. Izinkan akses kamera browser
5. Posisikan wajah di depan kamera
6. Sistem akan:
   - Mendeteksi wajah dengan kotak hijau
   - Memeriksa duplikasi di database
   - Capture foto dan menyimpan data
7. Notifikasi sukses atau warning jika wajah sudah terdaftar

### Pengenalan Wajah

1. Klik "Mulai Pengenalan"
2. Izinkan akses kamera
3. Posisikan wajah di depan kamera
4. Sistem akan:
   - Mendeteksi wajah dengan kotak hijau
   - Mencocokkan dengan database
   - Menampilkan hasil dengan confidence level

## API Endpoints

### POST /api/check_face.php

Cek apakah wajah sudah terdaftar.

**Request:**
```json
{
  "descriptor": [0.234, -0.891, ...]
}
```

**Response:**
```json
{
  "success": true,
  "exists": true,
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "distance": 0.3452
}
```

### POST /api/register.php

Registrasi wajah baru.

**Request:**
```json
{
  "name": "John Doe",
  "descriptor": [0.234, -0.891, ...], 
  "photo": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "id": 1,
  "photo_path": "uploads/face_xxx.jpg"
}
```

### POST /api/recognize.php

Kenali wajah dari descriptor.

**Request:**
```json
{
  "descriptor": [0.234, -0.891, ...]
}
```

**Response:**
```json
{
  "success": true,
  "match": true,
  "user": {
    "id": 1,
    "name": "John Doe"
  },
  "distance": 0.3452
}
```

## How It Works

### Face Descriptor

Aplikasi menyimpan representasi numerik wajah (128-dimensional vector) bukan foto mentah:

```javascript
// Contoh face descriptor
[0.234, -0.891, 0.456, ..., 0.123] // 128 float values
```

### Matching Algorithm

Menggunakan **Euclidean Distance** untuk mencocokkan wajah:

```php
distance = sqrt(Σ(descriptor1[i] - descriptor2[i])²)
```

**Threshold:**
- Distance < 0.6 → Match ✅
- Distance ≥ 0.6 → No Match ❌

### Application Flow

**Registrasi:**
```
Input Nama → Start Camera → Detect Face → 
Check Duplicate → [Duplicate? → Warning] → 
[New? → Capture Photo → Save to DB]
```

**Pengenalan:**
```
Start Camera → Detect Face → Draw Bounding Box → 
Extract Descriptor → Match with DB → Show Result
```

## Configuration

### Global Settings

Edit `assets/js/config.js`:

```javascript
const CONFIG = {
    // Threshold matching (0-1, lebih kecil = lebih ketat)
    MATCH_THRESHOLD: 0.6,
    
    // Detector options
    DETECTOR_OPTIONS: {
        inputSize: 416,        // 128, 160, 224, 320, 416, 512, 608
        scoreThreshold: 0.5    // 0.1 - 0.9
    },
    
    // Camera stabilization delay (ms)
    CAMERA_STABILIZATION_DELAY: 1000,
    
    // Photo quality (0-1)
    PHOTO_QUALITY: 0.8,
    
    // Debug mode
    DEBUG: true  // Set false untuk production
};
```

### PHP Backend

Edit `api/recognize.php` atau `api/check_face.php`:

```php
$threshold = 0.6; // Default: 0.6
```

## Module Documentation

### Camera Module (`assets/js/camera.js`)

Mengelola akses kamera, video stream, dan capture foto.

**Methods:**
- `start()` - Inisialisasi kamera
- `stop()` - Stop kamera dan cleanup
- `capturePhoto()` - Capture frame dari video
- `waitUntilReady()` - Tunggu video ready
- `setDetectionAnimation(active)` - Toggle detection animation

### Face Detection Module (`assets/js/face-detection.js`)

Handle deteksi wajah dengan face-api.js.

**Methods:**
- `loadModels()` - Load model face-api.js
- `detectSingleFace(video)` - Deteksi 1 wajah dari video
- `isReady()` - Check apakah models loaded
- `descriptorToArray(descriptor)` - Convert descriptor ke array

### UI Module (`assets/js/ui.js`)

Manipulasi DOM dan tampilan.

**Methods:**
- `showLoading(elementId, message)` - Show loading spinner
- `showSuccess(elementId, message)` - Show success message
- `showError(elementId, message)` - Show error message
- `showWarning(elementId, message)` - Show warning message
- `drawFaceBox(video, detection)` - Draw bounding box di wajah
- `formatConfidence(distance)` - Format confidence percentage

### API Module (`assets/js/api.js`)

Handle komunikasi dengan backend.

**Methods:**
- `checkFace(descriptor)` - Cek duplikasi wajah
- `register(name, descriptor, photo)` - Registrasi wajah
- `recognize(descriptor)` - Recognize wajah

## Troubleshooting

### Kamera Tidak Muncul
- Pastikan menggunakan HTTPS atau localhost
- Check browser permission untuk akses kamera
- Gunakan browser modern (Chrome/Firefox)
- Check console untuk error message

### Wajah Tidak Terdeteksi
- Pastikan pencahayaan cukup
- Jarak wajah 30-100 cm dari kamera
- Wajah menghadap ke depan
- Turunkan `scoreThreshold` untuk sensitivitas lebih tinggi
- Check console: `[DEBUG] Face detected`

### Model Not Loaded
- Periksa path di `CONFIG.MODEL_PATH`
- Download ulang model files
- Pastikan semua file model ada (manifest + shard)
- Check console: `[DEBUG] Models loaded successfully`

### API Error / 404
- Periksa `CONFIG.API_BASE_URL` di config.js
- Pastikan file PHP ada di folder `api/`
- Check file permissions (755 untuk folders, 644 untuk files)
- Test API endpoint langsung via Postman

### Database Connection Failed
- Periksa kredensial di `api/config.php`
- Pastikan MySQL service running
- Cek database sudah dibuat dengan nama yang benar
- Test koneksi: `php -r "new PDO('mysql:host=localhost', 'root', '');"`

### Loading Terus Menerus
- Clear browser cache
- Check console untuk JavaScript errors
- Pastikan semua file JS terload dengan benar
- Periksa network tab untuk failed requests

## Security Considerations

- ⚠️ **HTTPS Required:** Gunakan SSL certificate untuk production
- ⚠️ **Input Validation:** Validasi nama, photo size, descriptor length
- ⚠️ **File Upload Security:** Validasi file type dan size limit
- ⚠️ **SQL Injection:** Gunakan prepared statements (sudah implemented)
- ⚠️ **XSS Protection:** Sanitize output di UI
- ⚠️ **CSRF Protection:** Implementasi token untuk production
- ⚠️ **Rate Limiting:** Batasi request per IP
- ⚠️ **Privacy:** Enkripsi face descriptor untuk data sensitif
- ⚠️ **Access Control:** Proteksi folder uploads dengan .htaccess

## Performance Optimization

### Frontend
- Lazy load face-api.js models
- Debounce camera operations
- Optimize canvas rendering
- Compress photos before upload

### Backend
- Index database columns (name, created_at)
- Implement caching untuk matching results
- Use connection pooling
- Optimize SQL queries

### Large Scale (1000+ users)
- Implementasi FAISS/Annoy untuk vector search
- Sharding database berdasarkan hash
- CDN untuk static assets
- Load balancing untuk multiple servers

## Future Improvements

- [ ] Multiple face registration per user (3-5 angles)
- [ ] Liveness detection (anti-spoofing dengan blink detection)
- [ ] Face quality assessment sebelum registrasi
- [ ] Export/import database (JSON/CSV)
- [ ] Admin dashboard dengan statistik
- [ ] REST API dengan JWT authentication
- [ ] Face clustering dan analytics
- [ ] Mobile app support (React Native/Flutter)
- [ ] Batch recognition (multiple faces)
- [ ] Face mask detection
- [ ] Age/gender estimation
- [ ] Emotion recognition

## Browser Compatibility

| Browser | Version | Supported |
|---------|---------|-----------|
| Chrome  | 90+     | ✅ Full    |
| Firefox | 88+     | ✅ Full    |
| Safari  | 14+     | ✅ Full    |
| Edge    | 90+     | ✅ Full    |
| Opera   | 76+     | ✅ Full    |
| IE 11   | -       | ❌ No      |

## License

MIT License - feel free to use for personal/commercial projects

## Credits

- [face-api.js](https://github.com/vladmandic/face-api) by Vladimir Mandic
- Based on TensorFlow.js and FaceNet models
- Inspired by modern face recognition systems

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

**Coding Standards:**
- Follow existing code style
- Add comments untuk logic kompleks
- Update README untuk fitur baru
- Test thoroughly sebelum submit PR

## Changelog

### v2.0.0 (Current)
- ✨ Arsitektur modular dengan separation of concerns
- ✨ Duplicate face detection saat registrasi
- ✨ Visual feedback dengan bounding box dan landmarks
- ✨ Loading animations dan progress indicators
- ✨ Improved error handling dan user messages
- ✨ Comprehensive documentation dan inline comments
- 🔧 Refactored CSS dengan CSS variables
- 🔧 Modular JavaScript dengan clear responsibilities
- 🔧 Security improvements (.htaccess, gitignore)

### v1.0.0
- 🎉 Initial release
- Basic face registration dan recognition
- Simple UI dengan inline CSS/JS

## Support

Jika ada pertanyaan atau issue:
- 📫 Email: andrerio519@gmail.com
- 🐛 GitHub Issues: [Create Issue](https://github.com/andrerio519/FaceRecognitionBasic/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/andrerio519/FaceRecognitionBasic/discussions)

## Acknowledgments

Terima kasih kepada:
- Vladimir Mandic untuk face-api.js
- TensorFlow.js team
- Open source community

---

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [andrerio519](https://github.com/andrerio519)