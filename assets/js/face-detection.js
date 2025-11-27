/**
 * Face Detection Module
 * Handle semua operasi face detection dengan face-api.js
 */

const FaceDetection = {
    modelsLoaded: false,

    /**
     * Load semua model yang diperlukan
     * @returns {Promise<void>}
     */
    async loadModels() {
        try {
            debugLog('Loading face-api.js models...');

            // Load 3 model yang diperlukan:
            // 1. TinyFaceDetector - untuk deteksi wajah (cepat, ringan)
            // 2. FaceLandmark68Net - untuk deteksi 68 titik landmark wajah
            // 3. FaceRecognitionNet - untuk ekstrak descriptor (128D vector)
            await faceapi.nets.tinyFaceDetector.loadFromUri(CONFIG.MODEL_PATH);
            await faceapi.nets.faceLandmark68Net.loadFromUri(CONFIG.MODEL_PATH);
            await faceapi.nets.faceRecognitionNet.loadFromUri(CONFIG.MODEL_PATH);

            this.modelsLoaded = true;
            debugLog('Models loaded successfully');

        } catch (err) {
            errorLog('Failed to load models', err);
            throw new Error('Gagal memuat model. Periksa koneksi dan path model.');
        }
    },

    /**
     * Deteksi wajah tunggal dari video element
     * @param {HTMLVideoElement} video - Video element
     * @returns {Promise<object|null>} Detection result atau null jika tidak ada wajah
     */
    async detectSingleFace(video) {
        try {
            debugLog('Detecting face...');

            // Proses deteksi dengan chain:
            // 1. detectSingleFace - deteksi 1 wajah saja (bukan multiple faces)
            // 2. withFaceLandmarks - tambahkan landmark detection
            // 3. withFaceDescriptor - ekstrak 128D descriptor vector
            const detection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions(CONFIG.DETECTOR_OPTIONS))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detection) {
                debugLog('Face detected', {
                    box: detection.detection.box,
                    score: detection.detection.score,
                    descriptorLength: detection.descriptor.length
                });
            } else {
                debugLog('No face detected');
            }

            return detection;

        } catch (err) {
            errorLog('Face detection failed', err);
            throw err;
        }
    },

    /**
     * Check apakah models sudah loaded
     * @returns {boolean}
     */
    isReady() {
        return this.modelsLoaded;
    },

    /**
     * Convert descriptor ke array biasa (untuk JSON serialization)
     * @param {Float32Array} descriptor - Face descriptor
     * @returns {Array<number>}
     */
    descriptorToArray(descriptor) {
        return Array.from(descriptor);
    },

    /**
     * Hitung Euclidean distance antara 2 descriptor
     * Fungsi ini bisa digunakan untuk testing di client-side
     * @param {Array<number>} desc1 - Descriptor pertama
     * @param {Array<number>} desc2 - Descriptor kedua
     * @returns {number} Distance (0-1, semakin kecil semakin mirip)
     */
    calculateDistance(desc1, desc2) {
        let sum = 0;
        for (let i = 0; i < desc1.length; i++) {
            sum += Math.pow(desc1[i] - desc2[i], 2);
        }
        return Math.sqrt(sum);
    }
};

// Export untuk digunakan file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaceDetection;
}