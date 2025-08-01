import CryptoJS from 'crypto-js';
import validator from 'validator';
import sanitizeHtml from 'sanitize-html';
import xss from 'xss';

// Security configuration
const SECURITY_CONFIG = {
  ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY || 'your-fallback-encryption-key-2024',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  PASSWORD_MIN_LENGTH: 8,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100
};

// Data encryption utilities
export const encryption = {
  // Encrypt sensitive data
  encrypt: (data) => {
    try {
      const stringData = typeof data === 'string' ? data : JSON.stringify(data);
      return CryptoJS.AES.encrypt(stringData, SECURITY_CONFIG.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  },

  // Decrypt sensitive data
  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECURITY_CONFIG.ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },

  // Hash passwords
  hashPassword: (password) => {
    return CryptoJS.SHA256(password + SECURITY_CONFIG.ENCRYPTION_KEY).toString();
  },

  // Verify password hash
  verifyPassword: (password, hash) => {
    const hashedPassword = CryptoJS.SHA256(password + SECURITY_CONFIG.ENCRYPTION_KEY).toString();
    return hashedPassword === hash;
  }
};

// Input validation utilities
export const validation = {
  // Validate email
  isValidEmail: (email) => {
    return validator.isEmail(email) && email.length <= 254;
  },

  // Validate password strength
  isValidPassword: (password) => {
    const minLength = SECURITY_CONFIG.PASSWORD_MIN_LENGTH;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  // Validate phone number
  isValidPhone: (phone) => {
    return validator.isMobilePhone(phone, 'any') && phone.length <= 20;
  },

  // Validate URL
  isValidUrl: (url) => {
    return validator.isURL(url, { protocols: ['http', 'https'] });
  },

  // Validate name
  isValidName: (name) => {
    return validator.isLength(name, { min: 2, max: 50 }) && 
           validator.matches(name, /^[a-zA-Z\s\-']+$/);
  },

  // Validate business name
  isValidBusinessName: (name) => {
    return validator.isLength(name, { min: 2, max: 100 }) && 
           validator.matches(name, /^[a-zA-Z0-9\s\-&.,'()]+$/);
  },

  // Validate amount
  isValidAmount: (amount) => {
    return validator.isNumeric(amount.toString()) && 
           parseFloat(amount) > 0 && 
           parseFloat(amount) <= 1000000; // Max $1M
  }
};

// Input sanitization utilities
export const sanitization = {
  // Sanitize HTML content
  sanitizeHtml: (html) => {
    return sanitizeHtml(html, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
      allowedAttributes: {
        'a': ['href', 'target']
      },
      allowedIframeHostnames: []
    });
  },

  // Sanitize text input
  sanitizeText: (text) => {
    if (typeof text !== 'string') return text;
    
    return text
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Sanitize object recursively
  sanitizeObject: (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? sanitization.sanitizeText(obj) : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => sanitization.sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitization.sanitizeObject(value);
    }
    return sanitized;
  },

  // XSS protection
  preventXSS: (input) => {
    if (typeof input !== 'string') return input;
    return xss(input, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });
  }
};

// Rate limiting utilities
export const rateLimiting = {
  requests: new Map(),
  
  // Check if request is allowed
  isAllowed: (identifier, limit = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS, windowMs = SECURITY_CONFIG.RATE_LIMIT_WINDOW) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimiting.requests.has(identifier)) {
      rateLimiting.requests.set(identifier, []);
    }
    
    const userRequests = rateLimiting.requests.get(identifier);
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= limit) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    rateLimiting.requests.set(identifier, recentRequests);
    return true; // Request allowed
  },

  // Clean up old requests
  cleanup: () => {
    const now = Date.now();
    const windowMs = SECURITY_CONFIG.RATE_LIMIT_WINDOW;
    
    for (const [identifier, requests] of rateLimiting.requests.entries()) {
      const validRequests = requests.filter(time => now - time < windowMs);
      if (validRequests.length === 0) {
        rateLimiting.requests.delete(identifier);
      } else {
        rateLimiting.requests.set(identifier, validRequests);
      }
    }
  }
};

// Session management utilities
export const sessionManagement = {
  sessions: new Map(),
  
  // Create new session
  createSession: (userId, userData) => {
    const sessionId = crypto.randomUUID();
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ip: userData.ip || 'unknown',
      userAgent: userData.userAgent || 'unknown'
    };
    
    sessionManagement.sessions.set(sessionId, sessionData);
    return sessionId;
  },

  // Validate session
  validateSession: (sessionId) => {
    const session = sessionManagement.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, error: 'Invalid session' };
    }
    
    const now = Date.now();
    
    // Check session timeout
    if (now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
      sessionManagement.sessions.delete(sessionId);
      return { valid: false, error: 'Session expired' };
    }
    
    // Update last activity
    session.lastActivity = now;
    sessionManagement.sessions.set(sessionId, session);
    
    return { valid: true, session };
  },

  // Destroy session
  destroySession: (sessionId) => {
    sessionManagement.sessions.delete(sessionId);
  },

  // Clean up expired sessions
  cleanup: () => {
    const now = Date.now();
    
    for (const [sessionId, session] of sessionManagement.sessions.entries()) {
      if (now - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        sessionManagement.sessions.delete(sessionId);
      }
    }
  }
};

// Login attempt tracking
export const loginAttempts = {
  attempts: new Map(),
  
  // Record login attempt
  recordAttempt: (identifier, success) => {
    const attempts = loginAttempts.attempts.get(identifier) || { count: 0, lastAttempt: 0 };
    
    if (success) {
      loginAttempts.attempts.delete(identifier);
    } else {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      loginAttempts.attempts.set(identifier, attempts);
    }
  },

  // Check if login is allowed
  isAllowed: (identifier) => {
    const attempts = loginAttempts.attempts.get(identifier);
    
    if (!attempts) return { allowed: true };
    
    const now = Date.now();
    
    // Reset if lockout period has passed
    if (now - attempts.lastAttempt > SECURITY_CONFIG.LOCKOUT_DURATION) {
      loginAttempts.attempts.delete(identifier);
      return { allowed: true };
    }
    
    if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      return { 
        allowed: false, 
        error: 'Account temporarily locked due to too many failed login attempts',
        remainingTime: SECURITY_CONFIG.LOCKOUT_DURATION - (now - attempts.lastAttempt)
      };
    }
    
    return { allowed: true };
  }
};

// Audit logging
export const auditLog = {
  logs: [],
  
  // Add log entry
  add: (action, userId, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      ip: details.ip || 'unknown',
      userAgent: details.userAgent || 'unknown'
    };
    
    auditLog.logs.push(logEntry);
    
    // Keep only last 1000 logs
    if (auditLog.logs.length > 1000) {
      auditLog.logs = auditLog.logs.slice(-1000);
    }
    
    // In production, send to secure logging service
    console.log('AUDIT LOG:', logEntry);
  },

  // Get logs for user
  getUserLogs: (userId, limit = 100) => {
    return auditLog.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  },

  // Get logs by action
  getActionLogs: (action, limit = 100) => {
    return auditLog.logs
      .filter(log => log.action === action)
      .slice(-limit);
  }
};

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Data classification
export const dataClassification = {
  public: ['businessName', 'sport', 'position', 'university'],
  internal: ['email', 'phone', 'profileImage', 'bio'],
  confidential: ['ssn', 'bankAccount', 'paymentInfo', 'address'],
  restricted: ['password', 'authTokens', 'privateKeys', 'sessionData']
};

// GDPR compliance utilities
export const gdpr = {
  // Generate data export
  generateExport: (userId, userData) => {
    return {
      userId,
      exportDate: new Date().toISOString(),
      data: {
        profile: userData.profile || {},
        transactions: userData.transactions || [],
        messages: userData.messages || [],
        documents: userData.documents || [],
        logs: auditLog.getUserLogs(userId)
      }
    };
  },

  // Anonymize data
  anonymize: (data) => {
    const anonymized = { ...data };
    
    // Remove personal identifiers
    delete anonymized.email;
    delete anonymized.phone;
    delete anonymized.ssn;
    delete anonymized.address;
    delete anonymized.bankAccount;
    
    // Hash remaining identifiers
    if (anonymized.userId) {
      anonymized.userId = encryption.hashPassword(anonymized.userId);
    }
    
    return anonymized;
  }
};

// Cleanup intervals
setInterval(() => {
  rateLimiting.cleanup();
  sessionManagement.cleanup();
}, 5 * 60 * 1000); // Every 5 minutes

const securityUtils = {
  encryption,
  validation,
  sanitization,
  rateLimiting,
  sessionManagement,
  loginAttempts,
  auditLog,
  securityHeaders,
  dataClassification,
  gdpr,
  SECURITY_CONFIG
};

export default securityUtils; 