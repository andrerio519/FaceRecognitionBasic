/**
 * UI Module
 * Handle semua manipulasi DOM dan tampilan
 */

const UI = {
    /**
     * Show loading indicator dengan spinner dan progress bar
     * @param {string} elementId - ID element target
     * @param {string} message - Loading message
     */
    showLoading(elementId, message) {
        const element = document.getElementById(elementId);
        element.innerHTML = `
            <div class="loading fade-in">
                <span class="spinner"></span>${message}
            </div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
        `;
    },

    /**
     * Show success message
     * @param {string} elementId - ID element target
     * @param {string} message - Success message (HTML supported)
     */
    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        element.innerHTML = `<div class="success bounce">${message}</div>`;
    },

    /**
     * Show error message
     * @param {string} elementId - ID element target
     * @param {string} message - Error message
     */
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        element.innerHTML = `<div class="error shake">❌ ${message}</div>`;
    },

    /**
     * Show warning message
     * @param {string} elementId - ID element target
     * @param {string} message - Warning message (HTML supported)
     */
    showWarning(elementId, message) {
        const element = document.getElementById(elementId);
        element.innerHTML = `<div class="warning fade-in">${message}</div>`;
    },

    /**
     * Clear result message
     * @param {string} elementId - ID element target
     */
    clearResult(elementId) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
    },

    /**
     * Toggle button state
     * @param {string} buttonId - ID button element
     * @param {boolean} disabled - State disabled
     */
    toggleButton(buttonId, disabled) {
        const button = document.getElementById(buttonId);
        button.disabled = disabled;
    },

    /**
     * Draw face detection box dan landmarks
     * @param {HTMLVideoElement} video - Video element
     * @param {object} detection - Face detection result dari face-api.js
     */
    drawFaceBox(video, detection) {
        const canvas = document.getElementById('overlay');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
            const box = detection.detection.box;

            // Draw bounding box (kotak hijau)
            ctx.strokeStyle = '#28a745';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Draw corner markers (sudut kotak)
            const cornerLength = 20;
            ctx.lineWidth = 4;

            // Top-left corner
            ctx.beginPath();
            ctx.moveTo(box.x, box.y + cornerLength);
            ctx.lineTo(box.x, box.y);
            ctx.lineTo(box.x + cornerLength, box.y);
            ctx.stroke();

            // Top-right corner
            ctx.beginPath();
            ctx.moveTo(box.x + box.width - cornerLength, box.y);
            ctx.lineTo(box.x + box.width, box.y);
            ctx.lineTo(box.x + box.width, box.y + cornerLength);
            ctx.stroke();

            // Bottom-left corner
            ctx.beginPath();
            ctx.moveTo(box.x, box.y + box.height - cornerLength);
            ctx.lineTo(box.x, box.y + box.height);
            ctx.lineTo(box.x + cornerLength, box.y + box.height);
            ctx.stroke();

            // Bottom-right corner
            ctx.beginPath();
            ctx.moveTo(box.x + box.width - cornerLength, box.y + box.height);
            ctx.lineTo(box.x + box.width, box.y + box.height);
            ctx.lineTo(box.x + box.width, box.y + box.height - cornerLength);
            ctx.stroke();

            // Draw landmarks (titik-titik wajah)
            if (detection.landmarks) {
                ctx.fillStyle = '#28a745';
                detection.landmarks.positions.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
                    ctx.fill();
                });
            }
        }
    },

    /**
     * Clear overlay canvas
     */
    clearOverlay() {
        const canvas = document.getElementById('overlay');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * Format confidence percentage untuk tampilan
     * @param {number} distance - Euclidean distance (0-1)
     * @returns {string} Formatted percentage
     */
    formatConfidence(distance) {
        const confidence = ((1 - distance) * 100).toFixed(1);
        return `${confidence}%`;
    }
};

// Export untuk digunakan file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}