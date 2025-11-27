/**
 * Configuration File
 * Semua konfigurasi global aplikasi
 */

const CONFIG = {
    // Base URL untuk API
    API_BASE_URL: 'api/',
    
    // Path model face-api.js
    MODEL_PATH: 'model/',
    
    // Threshold untuk face matching (0-1)
    // Semakin kecil = semakin ketat matching
    MATCH_THRESHOLD: 0.6,
    
    // Opsi untuk TinyFaceDetector
    DETECTOR_OPTIONS: {
        inputSize: 416,        // 128, 160, 224, 320, 416, 512, 608
        scoreThreshold: 0.5    // 0.1 - 0.9 (confidence minimum)
    },
    
    // Delay untuk stabilisasi kamera (ms)
    CAMERA_STABILIZATION_DELAY: 10000,
    
    // Quality untuk JPEG compression (0-1)
    PHOTO_QUALITY: 0.8,
    
    // Timeout untuk operasi API (ms)
    API_TIMEOUT: 10000,
    
    // Messages
    MESSAGES: {
        CAMERA_ERROR: 'Error accessing camera',
        MODEL_LOADING: 'Model masih loading, tunggu sebentar...',
        NO_FACE_DETECTED: 'Wajah tidak terdeteksi. Pastikan wajah Anda terlihat jelas.',
        DUPLICATE_FACE: 'Wajah sudah terdaftar!',
        REGISTRATION_SUCCESS: 'Registrasi berhasil!',
        RECOGNITION_SUCCESS: 'Wajah dikenali!',
        NO_MATCH: 'Wajah tidak dikenali dalam database.',
    },
    
    // Debug mode (set false untuk production)
    DEBUG: true
};

/**
 * Helper function untuk logging (hanya jalan jika DEBUG = true)
 */
function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

/**
 * Helper function untuk error logging
 */
function errorLog(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
}

// Export CONFIG untuk digunakan file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, debugLog, errorLog };
}