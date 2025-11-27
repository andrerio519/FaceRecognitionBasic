/**
 * API Module
 * Handle semua komunikasi dengan backend API
 */

const API = {
    /**
     * Generic fetch dengan error handling
     * @param {string} endpoint - API endpoint
     * @param {object} data - Data yang akan dikirim
     * @returns {Promise<object>}
     */
    async request(endpoint, data) {
        try {
            debugLog(`API Request: ${endpoint}`, data);

            const response = await fetch(CONFIG.API_BASE_URL + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Check HTTP status
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            debugLog(`API Response: ${endpoint}`, result);

            return result;

        } catch (err) {
            errorLog(`API Error: ${endpoint}`, err);
            throw err;
        }
    },

    /**
     * Check apakah wajah sudah terdaftar
     * @param {Array<number>} descriptor - Face descriptor array
     * @returns {Promise<object>}
     */
    async checkFace(descriptor) {
        return await this.request('check_face.php', { descriptor });
    },

    /**
     * Registrasi wajah baru
     * @param {string} name - Nama user
     * @param {Array<number>} descriptor - Face descriptor array
     * @param {string} photo - Base64 encoded photo
     * @returns {Promise<object>}
     */
    async register(name, descriptor, photo) {
        return await this.request('register.php', {
            name,
            descriptor,
            photo
        });
    },

    /**
     * Recognize wajah dari descriptor
     * @param {Array<number>} descriptor - Face descriptor array
     * @returns {Promise<object>}
     */
    async recognize(descriptor) {
        return await this.request('recognize.php', { descriptor });
    }
};

// Export untuk digunakan file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}