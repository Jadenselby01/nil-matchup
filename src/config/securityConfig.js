// Security Configuration for NIL App
export const SECURITY_CONFIG = {
  // Authentication settings
  AUTH: {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REQUIRE_UPPERCASE: true,
    PASSWORD_REQUIRE_LOWERCASE: true,
    PASSWORD_REQUIRE_NUMBERS: true,
    PASSWORD_REQUIRE_SPECIAL_CHARS: true,
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Rate limiting
  RATE_LIMITING: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
    MAX_LOGIN_REQUESTS: 10,
    MAX_PAYMENT_REQUESTS: 20,
    MAX_FILE_UPLOADS: 50,
  },

  // Data encryption
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_ROTATION_DAYS: 90,
    SALT_ROUNDS: 12,
    ENCRYPT_SENSITIVE_FIELDS: true,
  },

  // File upload security
  FILE_UPLOAD: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    SCAN_FOR_MALWARE: true,
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf'],
    MAX_FILES_PER_USER: 10,
  },

  // Payment security
  PAYMENT: {
    REQUIRE_3DS: true,
    FRAUD_DETECTION: true,
    WEBHOOK_VERIFICATION: true,
    MAX_AMOUNT: 1000000, // $1M
    MIN_AMOUNT: 1, // $1
  },

  // Data retention
  DATA_RETENTION: {
    USER_DATA: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    PAYMENT_DATA: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    LOGS: 90 * 24 * 60 * 60 * 1000, // 90 days
    SESSIONS: 30 * 24 * 60 * 60 * 1000, // 30 days
  },

  // API security
  API: {
    TIMEOUT: 30000,
    MAX_RESPONSE_SIZE: 10 * 1024 * 1024, // 10MB
    CORS_ORIGINS: process.env.REACT_APP_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    REQUIRE_HTTPS: process.env.NODE_ENV === 'production',
  },

  // Content Security Policy
  CSP: {
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

  // Security headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  },

  // Input validation patterns
  VALIDATION_PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    NAME: /^[a-zA-Z\s\-']{2,50}$/,
    BUSINESS_NAME: /^[a-zA-Z0-9\s\-&.,'()]{2,100}$/,
    URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
    AMOUNT: /^\d+(\.\d{1,2})?$/,
  },

  // Data classification
  DATA_CLASSIFICATION: {
    PUBLIC: ['businessName', 'sport', 'position', 'university', 'bio'],
    INTERNAL: ['email', 'phone', 'profileImage', 'preferences'],
    CONFIDENTIAL: ['ssn', 'bankAccount', 'paymentInfo', 'address', 'taxInfo'],
    RESTRICTED: ['password', 'authTokens', 'privateKeys', 'sessionData'],
  },

  // GDPR compliance
  GDPR: {
    DATA_EXPORT_FORMATS: ['json', 'csv'],
    DATA_DELETION_GRACE_PERIOD: 30 * 24 * 60 * 60 * 1000, // 30 days
    CONSENT_REQUIRED: true,
    COOKIE_CONSENT: true,
  },

  // Monitoring and logging
  MONITORING: {
    LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
    AUDIT_LOG_RETENTION: 1000,
    ERROR_TRACKING: true,
    PERFORMANCE_MONITORING: true,
    SECURITY_EVENT_ALERTS: true,
  },

  // Feature flags
  FEATURES: {
    TWO_FACTOR_AUTH: false,
    BIOMETRIC_AUTH: false,
    ADVANCED_FRAUD_DETECTION: false,
    REAL_TIME_MONITORING: false,
  },
};

// Environment-specific overrides
export const getSecurityConfig = () => {
  const config = { ...SECURITY_CONFIG };

  if (process.env.NODE_ENV === 'development') {
    // Relaxed settings for development
    config.AUTH.SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
    config.RATE_LIMITING.MAX_REQUESTS = 1000;
    config.MONITORING.LOG_LEVEL = 'debug';
  }

  if (process.env.NODE_ENV === 'production') {
    // Stricter settings for production
    config.AUTH.SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
    config.RATE_LIMITING.MAX_REQUESTS = 50;
    config.ENCRYPTION.ENCRYPT_SENSITIVE_FIELDS = true;
    config.FEATURES.TWO_FACTOR_AUTH = true;
    config.FEATURES.ADVANCED_FRAUD_DETECTION = true;
  }

  return config;
};

// Security utility functions
export const securityUtils = {
  // Check if running in secure environment
  isSecureEnvironment: () => {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  },

  // Get security level based on environment
  getSecurityLevel: () => {
    if (process.env.NODE_ENV === 'production') return 'high';
    if (process.env.NODE_ENV === 'development') return 'medium';
    return 'low';
  },

  // Validate security configuration
  validateConfig: (config) => {
    const errors = [];

    if (!config.AUTH.SESSION_TIMEOUT || config.AUTH.SESSION_TIMEOUT < 60000) {
      errors.push('Session timeout must be at least 1 minute');
    }

    if (!config.AUTH.PASSWORD_MIN_LENGTH || config.AUTH.PASSWORD_MIN_LENGTH < 8) {
      errors.push('Password minimum length must be at least 8 characters');
    }

    if (!config.RATE_LIMITING.MAX_REQUESTS || config.RATE_LIMITING.MAX_REQUESTS < 10) {
      errors.push('Rate limit must be at least 10 requests');
    }

    return errors;
  },

  // Generate security report
  generateSecurityReport: () => {
    const config = getSecurityConfig();
    const errors = securityUtils.validateConfig(config);

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      securityLevel: securityUtils.getSecurityLevel(),
      isSecureEnvironment: securityUtils.isSecureEnvironment(),
      configErrors: errors,
      features: config.FEATURES,
      recommendations: errors.length > 0 ? errors : ['Configuration is valid']
    };
  }
};

export default getSecurityConfig(); 