import { securityConfig, auditLog, generateSecureToken, sanitizeInput } from '../config/security';

class SecurityService {
  constructor() {
    this.sessionTimeout = securityConfig.auth.sessionTimeout;
    this.loginAttempts = new Map();
    this.activeSessions = new Map();
  }

  // Authentication security
  validatePassword(password) {
    const { passwordMinLength, requireSpecialChars, requireNumbers, requireUppercase } = securityConfig.auth;
    
    if (password.length < passwordMinLength) {
      return { valid: false, error: `Password must be at least ${passwordMinLength} characters long` };
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }
    
    if (requireNumbers && !/\d/.test(password)) {
      return { valid: false, error: 'Password must contain at least one number' };
    }
    
    if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      return { valid: false, error: 'Password must contain at least one special character (@$!%*?&)' };
    }
    
    return { valid: true };
  }

  checkLoginAttempts(userId) {
    const attempts = this.loginAttempts.get(userId) || { count: 0, lastAttempt: 0 };
    const now = Date.now();
    
    // Reset if lockout period has passed
    if (now - attempts.lastAttempt > securityConfig.auth.lockoutDuration) {
      this.loginAttempts.delete(userId);
      return { allowed: true };
    }
    
    if (attempts.count >= securityConfig.auth.maxLoginAttempts) {
      return { 
        allowed: false, 
        error: 'Account temporarily locked due to too many failed login attempts',
        remainingTime: securityConfig.auth.lockoutDuration - (now - attempts.lastAttempt)
      };
    }
    
    return { allowed: true };
  }

  recordLoginAttempt(userId, success) {
    const attempts = this.loginAttempts.get(userId) || { count: 0, lastAttempt: 0 };
    
    if (success) {
      this.loginAttempts.delete(userId);
    } else {
      attempts.count++;
      attempts.lastAttempt = Date.now();
      this.loginAttempts.set(userId, attempts);
    }
  }

  createSecureSession(userId, userData) {
    const sessionId = generateSecureToken(32);
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ip: userData.ip || 'unknown',
      userAgent: userData.userAgent || 'unknown',
    };
    
    this.activeSessions.set(sessionId, sessionData);
    
    auditLog('SESSION_CREATED', userId, {
      sessionId,
      ip: sessionData.ip,
      userAgent: sessionData.userAgent,
    });
    
    return sessionId;
  }

  validateSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      return { valid: false, error: 'Invalid session' };
    }
    
    const now = Date.now();
    
    // Check session timeout
    if (now - session.lastActivity > this.sessionTimeout) {
      this.activeSessions.delete(sessionId);
      auditLog('SESSION_EXPIRED', session.userId, { sessionId });
      return { valid: false, error: 'Session expired' };
    }
    
    // Update last activity
    session.lastActivity = now;
    this.activeSessions.set(sessionId, session);
    
    return { valid: true, session };
  }

  destroySession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      auditLog('SESSION_DESTROYED', session.userId, { sessionId });
      this.activeSessions.delete(sessionId);
    }
  }

  // Data protection
  encryptSensitiveData(data) {
    // In production, use proper encryption library
    // This is a placeholder for demonstration
    return btoa(JSON.stringify(data));
  }

  decryptSensitiveData(encryptedData) {
    // In production, use proper decryption library
    // This is a placeholder for demonstration
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  }

  sanitizeUserInput(input) {
    if (typeof input === 'string') {
      return sanitizeInput(input);
    }
    
    if (typeof input === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeUserInput(value);
      }
      return sanitized;
    }
    
    return input;
  }

  // File upload security
  validateFileUpload(file) {
    const { maxSize, allowedTypes } = securityConfig.fileUpload;
    
    if (file.size > maxSize) {
      return { valid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }
    
    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
    
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, error: 'File extension not allowed' };
    }
    
    return { valid: true };
  }

  // Payment security
  validatePaymentData(paymentData) {
    const required = ['amount', 'currency', 'paymentMethod'];
    
    for (const field of required) {
      if (!paymentData[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }
    
    // Validate amount
    if (typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
      return { valid: false, error: 'Invalid payment amount' };
    }
    
    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(paymentData.currency)) {
      return { valid: false, error: 'Invalid currency' };
    }
    
    return { valid: true };
  }

  // Security monitoring
  detectSuspiciousActivity(userId, action, details) {
    const suspiciousPatterns = [
      { pattern: /multiple_login_attempts/, threshold: 5 },
      { pattern: /rapid_payments/, threshold: 10 },
      { pattern: /unusual_location/, threshold: 1 },
    ];
    
    // Log activity for monitoring
    auditLog(action, userId, details);
    
    // TODO: Implement actual suspicious activity detection
    // This would typically involve machine learning or rule-based systems
    
    return { suspicious: false, riskLevel: 'low' };
  }

  // GDPR compliance
  generateDataExport(userId) {
    // TODO: Implement data export functionality
    // This should export all user data in a structured format
    return {
      userId,
      exportDate: new Date().toISOString(),
      data: {
        profile: {},
        transactions: [],
        messages: [],
        documents: [],
      },
    };
  }

  deleteUserData(userId) {
    // TODO: Implement secure data deletion
    // This should permanently delete all user data
    
    // Clean up sessions
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (session.userId === userId) {
        this.activeSessions.delete(sessionId);
      }
    }
    
    // Clean up login attempts
    this.loginAttempts.delete(userId);
    
    auditLog('USER_DATA_DELETED', userId, { deletionDate: new Date().toISOString() });
    
    return { success: true };
  }

  // Security headers
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    };
  }
}

// Create singleton instance
const securityService = new SecurityService();

export default securityService; 