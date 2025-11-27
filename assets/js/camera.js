/**
 * Camera Management Module
 * Handle semua operasi terkait kamera dan video
 */

const CameraManager = {
    stream: null,
    videoElement: null,
    
    /**
     * Inisialisasi kamera
     * @returns {Promise<HTMLVideoElement>}
     */
    async start() {
        try {
            debugLog('Starting camera...');
            
            // Request akses kamera
            // Constraints: video only, audio tidak perlu
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'  // Gunakan front camera
                } 
            });
            
            // Get video element
            this.videoElement = document.getElementById('video');
            this.videoElement.srcObject = this.stream;
            
            debugLog('Camera started successfully');
            return this.videoElement;
            
        } catch (err) {
            errorLog('Camera access failed', err);
            throw new Error(CONFIG.MESSAGES.CAMERA_ERROR + ': ' + err.message);
        }
    },
    
    /**
     * Stop kamera dan bersihkan stream
     */
    stop() {
        debugLog('Stopping camera...');
        
        if (this.stream) {
            // Stop semua tracks (video & audio)
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            this.stream = null;
        }
        
        // Remove video detection animation
        if (this.videoElement) {
            this.videoElement.classList.remove('video-detecting');
            this.videoElement.srcObject = null;
        }
        
        debugLog('Camera stopped');
    },
    
    /**
     * Tunggu video element siap
     * @returns {Promise<void>}
     */
    async waitUntilReady() {
        return new Promise((resolve) => {
            this.videoElement.onloadedmetadata = () => {
                this.videoElement.play();
                resolve();
            };
        });
    },
    
    /**
     * Capture foto dari video stream
     * @returns {string} Base64 encoded image
     */
    capturePhoto() {
        debugLog('Capturing photo...');
        
        const canvas = document.getElementById('canvas');
        const video = this.videoElement;
        
        // Set canvas size sama dengan video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame ke canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert ke base64 JPEG
        const photoBase64 = canvas.toDataURL('image/jpeg', CONFIG.PHOTO_QUALITY);
        
        debugLog('Photo captured', { 
            width: canvas.width, 
            height: canvas.height 
        });
        
        return photoBase64;
    },
    
    /**
     * Toggle detection animation pada video
     * @param {boolean} active
     */
    setDetectionAnimation(active) {
        if (active) {
            this.videoElement.classList.add('video-detecting');
        } else {
            this.videoElement.classList.remove('video-detecting');
        }
    },
    
    /**
     * Check apakah kamera sedang aktif
     * @returns {boolean}
     */
    isActive() {
        return this.stream !== null && this.stream.active;
    }
};

// Export untuk digunakan file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CameraManager;
}