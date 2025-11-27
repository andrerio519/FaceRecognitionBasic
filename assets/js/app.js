/**
 * Main Application
 * Orchestrate semua module dan handle user interactions
 */

const App = {
    /**
     * Initialize aplikasi saat DOM ready
     */
    async init() {
        debugLog('Initializing application...');

        try {
            // Load face-api.js models
            await FaceDetection.loadModels();
            debugLog('Application ready');
        } catch (err) {
            errorLog('Initialization failed', err);
            alert('Gagal memuat aplikasi. Refresh halaman.');
        }
    },

    /**
     * Handle registrasi wajah baru
     */
    async handleRegister() {
        // 1. Validasi input nama
        const name = document.getElementById('registerName').value.trim();
        if (!name) {
            alert('Masukkan nama terlebih dahulu');
            return;
        }

        // 2. Check apakah models sudah ready
        if (!FaceDetection.isReady()) {
            alert(CONFIG.MESSAGES.MODEL_LOADING);
            return;
        }

        // 3. Disable button untuk prevent double-click
        UI.toggleButton('registerBtn', true);
        UI.showLoading('registerResult', 'Memulai kamera...');

        try {
            // 4. Start kamera
            const video = await CameraManager.start();
            CameraManager.setDetectionAnimation(true);

            // 5. Tunggu video ready
            await CameraManager.waitUntilReady();

            // 6. Stabilisasi kamera
            await new Promise(resolve =>
                setTimeout(resolve, CONFIG.CAMERA_STABILIZATION_DELAY)
            );

            // 7. Deteksi wajah
            UI.showLoading('registerResult', 'Mendeteksi wajah...');
            const detection = await FaceDetection.detectSingleFace(video);

            if (!detection) {
                // Tidak ada wajah terdeteksi
                CameraManager.stop();
                UI.showError('registerResult', CONFIG.MESSAGES.NO_FACE_DETECTED);
                UI.toggleButton('registerBtn', false);
                return;
            }

            // 8. Draw face box untuk visual feedback
            UI.drawFaceBox(video, detection);

            // 9. Check duplikasi wajah
            UI.showLoading('registerResult', 'Memeriksa duplikasi wajah...');
            const descriptor = FaceDetection.descriptorToArray(detection.descriptor);
            const checkResult = await API.checkFace(descriptor);

            if (checkResult.success && checkResult.exists) {
                // Wajah sudah terdaftar
                CameraManager.stop();
                UI.showWarning('registerResult', `
                    ⚠️ <strong>Wajah Sudah Terdaftar!</strong><br>
                    Nama: <strong>${checkResult.user.name}</strong><br>
                    ID: ${checkResult.user.id}<br>
                    Similarity: ${UI.formatConfidence(checkResult.distance)}
                `);
                UI.toggleButton('registerBtn', false);
                return;
            }

            // 10. Capture foto
            const photo = CameraManager.capturePhoto();
            CameraManager.stop();

            // 11. Simpan ke database
            UI.showLoading('registerResult', 'Menyimpan data...');
            const result = await API.register(name, descriptor, photo);

            if (result.success) {
                // Registrasi berhasil
                UI.showSuccess('registerResult', `
                    ✅ <strong>Registrasi Berhasil!</strong><br>
                    ID: ${result.id}<br>
                    Nama: ${name}<br>
                    Foto: ${result.photo_path}
                `);

                // Clear input
                document.getElementById('registerName').value = '';
            } else {
                // Registrasi gagal
                UI.showError('registerResult', result.message);
            }

        } catch (err) {
            errorLog('Registration error', err);
            CameraManager.stop();
            UI.showError('registerResult', err.message);
        } finally {
            // 12. Re-enable button
            UI.toggleButton('registerBtn', false);
        }
    },

    /**
     * Handle pengenalan wajah
     */
    async handleRecognize() {
        // 1. Check apakah models sudah ready
        if (!FaceDetection.isReady()) {
            alert(CONFIG.MESSAGES.MODEL_LOADING);
            return;
        }

        // 2. Disable button
        UI.toggleButton('recognizeBtn', true);
        UI.showLoading('recognizeResult', 'Memulai kamera...');

        try {
            // 3. Start kamera
            const video = await CameraManager.start();
            CameraManager.setDetectionAnimation(true);

            // 4. Tunggu video ready
            await CameraManager.waitUntilReady();

            // 5. Stabilisasi kamera
            await new Promise(resolve =>
                setTimeout(resolve, CONFIG.CAMERA_STABILIZATION_DELAY)
            );

            // 6. Deteksi wajah
            UI.showLoading('recognizeResult', 'Mendeteksi wajah...');
            const detection = await FaceDetection.detectSingleFace(video);

            if (!detection) {
                // Tidak ada wajah terdeteksi
                CameraManager.stop();
                UI.showError('recognizeResult', CONFIG.MESSAGES.NO_FACE_DETECTED);
                UI.toggleButton('recognizeBtn', false);
                return;
            }

            // 7. Draw face box
            UI.drawFaceBox(video, detection);

            // 8. Recognize wajah
            UI.showLoading('recognizeResult', 'Mengenali wajah...');

            // Delay untuk animasi
            await new Promise(resolve => setTimeout(resolve, 5000));

            CameraManager.stop();

            const descriptor = FaceDetection.descriptorToArray(detection.descriptor);
            const result = await API.recognize(descriptor);

            if (result.success && result.match) {
                // Wajah dikenali
                UI.showSuccess('recognizeResult', `
                    ✅ <strong>Wajah Dikenali!</strong><br>
                    Nama: <strong>${result.user.name}</strong><br>
                    ID: ${result.user.id}<br>
                    Confidence: ${UI.formatConfidence(result.distance)}<br>
                    Distance: ${result.distance.toFixed(4)}
                `);
            } else if (result.success && !result.match) {
                // Wajah tidak dikenali
                UI.showError('recognizeResult', CONFIG.MESSAGES.NO_MATCH);
            } else {
                // Error
                UI.showError('recognizeResult', result.message);
            }

        } catch (err) {
            errorLog('Recognition error', err);
            CameraManager.stop();
            UI.showError('recognizeResult', err.message);
        } finally {
            // 9. Re-enable button
            UI.toggleButton('recognizeBtn', false);
        }
    }
};

// Initialize app saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}