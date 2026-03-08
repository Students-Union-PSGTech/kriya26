import api from './api';

// API Functions
export const authService = {
    // Send email verification
    sendVerificationEmail: async (data) => {
        const response = await api.post('/api/auth/user/verify-email', data);
        return response.data;
    },

    // Verify email with token
    verifyEmail: async (token) => {
        const response = await api.get(`/api/auth/user/verify-email/${token}`);
        return response.data;
    },

    // Register user
    register: async (data) => {
        const response = await api.post('/api/auth/user/register', data);
        return response.data;
    },

    // Login user
    login: async (data) => {
        const response = await api.post('/api/auth/user/login', data);
        return response.data;
    },

    // Logout user
    logout: async () => {
        const response = await api.post('/api/auth/user/logout');
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/api/auth/user/profile');
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await api.put('/api/auth/user/profile', data);
        return response.data;
    },

    // Forgot password
    forgotPassword: async (data) => {
        const response = await api.post('/api/auth/user/forgot-password', data);
        return response.data;
    },

    // Reset password
    resetPassword: async (data) => {
        const response = await api.post('/api/auth/user/reset-password', data);
        return response.data;
    },

    // Google login
    loginGoogle: async (data) => {
        const response = await api.post('/api/auth/user/login-google', data);
        return response.data;
    },

    // Pre-registration - Send verification code to email
    sendPreRegistrationCode: async (email) => {
        const response = await api.post('/api/events/preregister', { email });
        return response.data;
    },

    // Pre-registration - Verify the code and complete pre-registration
    verifyPreRegistration: async (email, verificationCode) => {
        const response = await api.post('/api/events/preregister/verify', { email, verificationCode });
        return response.data;
    },

    // Upload ID card (multipart/form-data)
    uploadIdCard: async (file) => {
        const formData = new FormData();
        formData.append('idCard', file);
        const response = await api.post('/api/auth/user/id-card', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // View uploaded ID card file as blob
    getIdCardFile: async (idCardUrl) => {
        const response = await api.get(`/api/auth/files/${idCardUrl}`, {
            responseType: 'blob',
        });
        return response;
    },

    // Upload bonafide certificate (multipart/form-data)
    uploadBonafide: async (file) => {
        const formData = new FormData();
        formData.append('bonafide', file);
        const response = await api.post('/api/auth/user/bonafide', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // View uploaded bonafide certificate file as blob
    getBonafideFile: async (bonafideUrl) => {
        const response = await api.get(`/api/auth/files/${bonafideUrl}`, {
            responseType: 'blob',
        });
        return response;
    },

    // College Management APIs
    
    // Get all colleges
    getAllColleges: async () => {
        const response = await api.get('/api/auth/colleges');
        return response.data;
    },

    // Add a single college
    addCollege: async (collegeName) => {
        const response = await api.post('/api/auth/colleges', { name: collegeName });
        return response.data;
    },

    // Delete a college by ID
    deleteCollege: async (collegeId) => {
        const response = await api.delete(`/api/auth/colleges/${collegeId}`);
        return response.data;
    },

    // Bulk insert colleges
    bulkInsertColleges: async (collegeNames) => {
        const response = await api.post('/api/auth/colleges/bulk', { colleges: collegeNames });
        return response.data;
    },
};
