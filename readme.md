# Face Recognition Web Application

Aplikasi web sederhana untuk registrasi dan pengenalan wajah menggunakan face-api.js, PHP, dan MySQL.

## Features

- ✅ Registrasi wajah baru dengan capture foto
- ✅ Pengenalan wajah real-time dari database
- ✅ Penyimpanan face descriptor (128D vector)
- ✅ Akses kamera browser
- ✅ UI responsif dan mudah digunakan

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Face Detection:** face-api.js (TinyFaceDetector, FaceLandmark68Net, FaceRecognitionNet)
- **Backend:** PHP 7.4+
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

### 2. Setup Database

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

### 3. Konfigurasi Database

Edit `config.php`:

```php
$host = 'localhost';
$dbname = 'face_recognition_db';
$username = 'root';
$password = 'your_password';
```

### 4. Download Face-API Models

Download model files dan taruh di folder `model/`:

- [tiny_face_detector_model.bin](https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/tiny_face_detector_model-weights_manifest.json)
- [face_landmark_68_model.bin](https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_landmark_68_model-weights_manifest.json)
- [face_recognition_model.bin](https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.15/model/face_recognition_model-weights_manifest.json)

Atau download semua model dari: https://github.com/vladmandic/face-api/tree/master/model

### 5. Buat Folder Uploads

```bash
mkdir uploads
chmod 777 uploads
```

### 6. Setup Web Server

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
├── index.html              # Main UI
├── config.php              # Database configuration
├── register.php            # API registrasi wajah
├── recognize.php           # API pengenalan wajah
├── face-api.js             # Face-API library
├── model/                  # Face-API model files
│   ├── tiny_face_detector_model-*
│   ├── face_landmark_68_model-*
│   └── face_recognition_model-*
├── uploads/                # Folder penyimpanan foto
│   └── face_*.jpg
└── README.md
```

## Usage

### Registrasi Wajah Baru

1. Buka aplikasi di browser
2. Masukkan nama di form "Registrasi Wajah Baru"
3. Klik "Mulai Registrasi"
4. Izinkan akses kamera
5. Posisikan wajah di depan kamera
6. Sistem akan mendeteksi dan menyimpan data wajah

### Pengenalan Wajah

1. Klik "Mulai Pengenalan"
2. Posisikan wajah di depan kamera
3. Sistem akan mencocokkan dengan database
4. Hasil akan menampilkan nama, ID, dan tingkat kecocokan

## API Endpoints

### POST /register.php

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

### POST /recognize.php

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

- Distance < 0.6 → Match ✅
- Distance ≥ 0.6 → No Match ❌

## Configuration

### Threshold Pengenalan

Edit di `recognize.php`:

```php
$threshold = 0.6; // Default: 0.6 (lebih kecil = lebih ketat)
```

### Detector Sensitivity

Edit di `index.html`:

```javascript
new faceapi.TinyFaceDetectorOptions({ 
    inputSize: 416,        // 128, 160, 224, 320, 416, 512, 608
    scoreThreshold: 0.5    // 0.1 - 0.9 (lebih tinggi = lebih ketat)
})
```

## Troubleshooting

### Kamera Tidak Muncul
- Pastikan menggunakan HTTPS atau localhost
- Check browser permission untuk akses kamera
- Gunakan browser modern (Chrome/Firefox)

### Wajah Tidak Terdeteksi
- Pastikan pencahayaan cukup
- Jarak wajah tidak terlalu jauh/dekat
- Wajah menghadap ke depan
- Turunkan `scoreThreshold` untuk sensitivitas lebih tinggi

### Model Not Loaded
- Periksa path model di `loadModels()`
- Download ulang model files
- Check console browser untuk error

### Database Connection Failed
- Periksa kredensial di `config.php`
- Pastikan MySQL service running
- Cek database sudah dibuat

## Security Considerations

- ⚠️ **HTTPS Required:** Gunakan SSL untuk production
- ⚠️ **Validate Input:** Implementasi input validation tambahan
- ⚠️ **File Upload Security:** Validasi tipe dan ukuran file
- ⚠️ **SQL Injection:** Gunakan prepared statements (sudah implemented)
- ⚠️ **Privacy:** Enkripsi face descriptor untuk data sensitif

## Performance Optimization

- Gunakan FAISS/Annoy untuk database > 1000 users
- Implement caching untuk hasil matching
- Compress foto sebelum simpan
- Index database untuk query cepat

## Future Improvements

- [ ] Multiple face registration per user
- [ ] Liveness detection (anti-spoofing)
- [ ] Export/import database
- [ ] Admin dashboard
- [ ] REST API authentication
- [ ] Face clustering dan analytics
- [ ] Mobile app support

## License

MIT License - feel free to use for personal/commercial projects

## Credits

- [face-api.js](https://github.com/vladmandic/face-api) by Vladimir Mandic
- Based on TensorFlow.js models

## Contributing

Pull requests are welcome. For major changes, please open an issue first.



## Support

Jika ada pertanyaan atau issue:
- Open GitHub Issue
- Email: andrerio519@gmail.com

---

**⭐ Star this repo if you find it useful!**