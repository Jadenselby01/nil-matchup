// Security Configuration for NIL Matchup Platform
export const securityConfig = {
  // Authentication settings
  auth: {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
  },

  // Data encryption
  encryption: {
    algorithm: 'AES-256-GCM',
    keyRotationDays: 90,
    saltRounds: 12,
  },

  // API security
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // requests per window
    },
    cors: {
      origin: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
  },

  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://js.stripe.com',
      'https://checkout.stripe.com',
      'https://api.stripe.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': [
      "'self'",
      'https://api.stripe.com',
      'https://checkout.stripe.com',
      process.env.REACT_APP_SUPABASE_URL,
    ],
    'frame-src': [
      'https://js.stripe.com',
      'https://checkout.stripe.com',
    ],
  },

  // File upload security
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    scanForMalware: true,
  },

  // Payment security
  payment: {
    require3DS: true,
    fraudDetection: true,
    webhookVerification: true,
  },

  // Data retention
  dataRetention: {
    userData: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    paymentData: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    logs: 90 * 24 * 60 * 60 * 1000, // 90 days
  },
};

// Security headers configuration
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Input validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s\-']{2,50}$/,
  businessName: /^[a-zA-Z0-9\s\-&.,'()]{2,100}$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
};

// Sanitization functions
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Rate limiting helper
export const createRateLimiter = () => {
  const requests = new Map();
  
  return (identifier, limit = 100, windowMs = 15 * 60 * 1000) => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(identifier)) {
      requests.set(identifier, []);
    }
    
    const userRequests = requests.get(identifier);
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= limit) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    return true; // Request allowed
  };
};

// CSRF protection
export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Secure random string generator
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomArray[i] % chars.length);
  }
  
  return result;
};

// Audit logging
export const auditLog = (action, userId, details = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown',
  };
  
  // In production, send to secure logging service
  console.log('AUDIT LOG:', logEntry);
  
  // TODO: Implement secure logging to external service
  // Example: sendToLoggingService(logEntry);
};

// Data classification
export const dataClassification = {
  public: ['businessName', 'sport', 'position'],
  internal: ['email', 'phone', 'profileImage'],
  confidential: ['ssn', 'bankAccount', 'paymentInfo'],
  restricted: ['password', 'authTokens', 'privateKeys'],
};

// Export security utilities
export default {
  securityConfig,
  securityHeaders,
  validationPatterns,
  sanitizeInput,
  createRateLimiter,
  generateCSRFToken,
  generateSecureToken,
  auditLog,
  dataClassification,
}; 