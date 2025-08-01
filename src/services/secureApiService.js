import axios from 'axios';
import { 
  encryption, 
  validation, 
  sanitization, 
  rateLimiting, 
  sessionManagement, 
  auditLog,
  securityHeaders 
} from '../utils/security';

// Create axios instance with security defaults
const secureApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    ...securityHeaders
  }
});

// Request interceptor for security
secureApi.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID();

    // Rate limiting check
    const identifier = token || config.headers['X-Request-ID'];
    if (!rateLimiting.isAllowed(identifier)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Sanitize request data
    if (config.data) {
      config.data = sanitization.sanitizeObject(config.data);
    }

    // Log request
    auditLog.add('API_REQUEST', token ? 'authenticated' : 'anonymous', {
      method: config.method,
      url: config.url,
      requestId: config.headers['X-Request-ID']
    });

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for security
secureApi.interceptors.response.use(
  (response) => {
    // Log successful response
    auditLog.add('API_RESPONSE_SUCCESS', response.config.headers.Authorization ? 'authenticated' : 'anonymous', {
      method: response.config.method,
      url: response.config.url,
      status: response.status,
      requestId: response.config.headers['X-Request-ID']
    });

    return response;
  },
  (error) => {
    // Log error response
    auditLog.add('API_RESPONSE_ERROR', error.config?.headers?.Authorization ? 'authenticated' : 'anonymous', {
      method: error.config?.method,
      url: error.config?.url,
      status: error.response?.status,
      error: error.message,
      requestId: error.config?.headers['X-Request-ID']
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      sessionManagement.destroySession(localStorage.getItem('sessionId'));
      localStorage.removeItem('sessionId');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Secure API methods
export const secureApiService = {
  // Authentication
  auth: {
    // Login with security measures
    login: async (email, password) => {
      // Validate input
      if (!validation.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!validation.isValidPassword(password)) {
        throw new Error('Password does not meet security requirements');
      }

      // Check login attempts
      const loginCheck = loginAttempts.isAllowed(email);
      if (!loginCheck.allowed) {
        throw new Error(loginCheck.error);
      }

      try {
        const response = await secureApi.post('/auth/login', {
          email: sanitization.sanitizeText(email),
          password: encryption.hashPassword(password)
        });

        // Record successful login
        loginAttempts.recordAttempt(email, true);

        // Store secure session
        const sessionId = sessionManagement.createSession(response.data.user.id, {
          ip: response.data.ip || 'unknown',
          userAgent: navigator.userAgent
        });

        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('authToken', response.data.token);

        return response.data;
      } catch (error) {
        // Record failed login
        loginAttempts.recordAttempt(email, false);
        throw error;
      }
    },

    // Register with security measures
    register: async (userData) => {
      // Validate all input fields
      const validationErrors = [];

      if (!validation.isValidEmail(userData.email)) {
        validationErrors.push('Invalid email format');
      }

      if (!validation.isValidPassword(userData.password)) {
        validationErrors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      }

      if (!validation.isValidName(userData.name)) {
        validationErrors.push('Invalid name format');
      }

      if (userData.phone && !validation.isValidPhone(userData.phone)) {
        validationErrors.push('Invalid phone number');
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Sanitize and encrypt sensitive data
      const sanitizedData = {
        ...userData,
        email: sanitization.sanitizeText(userData.email),
        name: sanitization.sanitizeText(userData.name),
        phone: userData.phone ? sanitization.sanitizeText(userData.phone) : null,
        password: encryption.hashPassword(userData.password)
      };

      const response = await secureApi.post('/auth/register', sanitizedData);
      return response.data;
    },

    // Logout with cleanup
    logout: async () => {
      try {
        await secureApi.post('/auth/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clean up local storage
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          sessionManagement.destroySession(sessionId);
        }
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userData');
      }
    },

    // Refresh token
    refreshToken: async () => {
      const response = await secureApi.post('/auth/refresh');
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    }
  },

  // User management
  users: {
    // Get user profile
    getProfile: async (userId) => {
      const response = await secureApi.get(`/users/${userId}/profile`);
      return response.data;
    },

    // Update user profile with validation
    updateProfile: async (userId, updates) => {
      // Validate updates
      const validationErrors = [];

      if (updates.email && !validation.isValidEmail(updates.email)) {
        validationErrors.push('Invalid email format');
      }

      if (updates.phone && !validation.isValidPhone(updates.phone)) {
        validationErrors.push('Invalid phone number');
      }

      if (updates.name && !validation.isValidName(updates.name)) {
        validationErrors.push('Invalid name format');
      }

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Sanitize updates
      const sanitizedUpdates = sanitization.sanitizeObject(updates);

      const response = await secureApi.put(`/users/${userId}/profile`, sanitizedUpdates);
      return response.data;
    },

    // Delete user account
    deleteAccount: async (userId) => {
      const response = await secureApi.delete(`/users/${userId}`);
      
      // Clean up local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userData');
      
      return response.data;
    }
  },

  // Payment processing with security
  payments: {
    // Create payment intent
    createPaymentIntent: async (paymentData) => {
      // Validate payment data
      if (!validation.isValidAmount(paymentData.amount)) {
        throw new Error('Invalid payment amount');
      }

      if (!validation.isValidEmail(paymentData.email)) {
        throw new Error('Invalid email format');
      }

      // Sanitize payment data
      const sanitizedData = sanitization.sanitizeObject(paymentData);

      const response = await secureApi.post('/payments/create-intent', sanitizedData);
      return response.data;
    },

    // Process payment
    processPayment: async (paymentId, paymentMethod) => {
      const response = await secureApi.post(`/payments/${paymentId}/process`, {
        paymentMethod: sanitization.sanitizeText(paymentMethod)
      });
      return response.data;
    },

    // Get payment history
    getPaymentHistory: async (userId) => {
      const response = await secureApi.get(`/payments/history/${userId}`);
      return response.data;
    }
  },

  // File upload with security
  files: {
    // Upload file with validation
    uploadFile: async (file, type) => {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type not allowed');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await secureApi.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    },

    // Delete file
    deleteFile: async (fileId) => {
      const response = await secureApi.delete(`/files/${fileId}`);
      return response.data;
    }
  },

  // Messaging with security
  messaging: {
    // Send message
    sendMessage: async (dealId, message) => {
      // Sanitize message content
      const sanitizedMessage = sanitization.sanitizeHtml(message);

      const response = await secureApi.post(`/messages/${dealId}`, {
        content: sanitizedMessage
      });

      return response.data;
    },

    // Get messages
    getMessages: async (dealId) => {
      const response = await secureApi.get(`/messages/${dealId}`);
      return response.data;
    }
  },

  // Deals with security
  deals: {
    // Create deal
    createDeal: async (dealData) => {
      // Validate deal data
      if (!validation.isValidAmount(dealData.amount)) {
        throw new Error('Invalid deal amount');
      }

      if (!validation.isValidBusinessName(dealData.title)) {
        throw new Error('Invalid deal title');
      }

      // Sanitize deal data
      const sanitizedData = sanitization.sanitizeObject(dealData);

      const response = await secureApi.post('/deals', sanitizedData);
      return response.data;
    },

    // Get deals
    getDeals: async (filters = {}) => {
      const response = await secureApi.get('/deals', { params: filters });
      return response.data;
    },

    // Update deal
    updateDeal: async (dealId, updates) => {
      const sanitizedUpdates = sanitization.sanitizeObject(updates);
      const response = await secureApi.put(`/deals/${dealId}`, sanitizedUpdates);
      return response.data;
    }
  },

  // GDPR compliance
  gdpr: {
    // Export user data
    exportData: async (userId) => {
      const response = await secureApi.get(`/gdpr/export/${userId}`);
      return response.data;
    },

    // Delete user data
    deleteData: async (userId) => {
      const response = await secureApi.delete(`/gdpr/delete/${userId}`);
      return response.data;
    }
  }
};

// Utility functions
export const apiUtils = {
  // Get user IP (for security logging)
  getUserIP: async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      return 'unknown';
    }
  },

  // Validate session
  validateSession: () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return false;

    const sessionCheck = sessionManagement.validateSession(sessionId);
    return sessionCheck.valid;
  },

  // Get security headers
  getSecurityHeaders: () => securityHeaders
};

export default secureApiService; 