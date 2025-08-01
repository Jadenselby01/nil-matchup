import { useState, useEffect, useCallback } from 'react';
import { 
  validation, 
  sanitization, 
  sessionManagement, 
  loginAttempts, 
  auditLog,
  encryption 
} from '../utils/security';

// Hook for secure authentication
export const useSecureAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('authToken');

      if (sessionId && token) {
        const sessionCheck = sessionManagement.validateSession(sessionId);
        if (sessionCheck.valid) {
          setIsAuthenticated(true);
          setUser(sessionCheck.session.userData);
        } else {
          // Session expired or invalid
          localStorage.removeItem('sessionId');
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Secure login function
  const login = useCallback(async (email, password) => {
    try {
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

      // Log login attempt
      auditLog.add('LOGIN_ATTEMPT', email, {
        ip: await getClientIP(),
        userAgent: navigator.userAgent
      });

      // Here you would typically make an API call
      // For now, we'll simulate a successful login
      const userData = {
        id: 'user-123',
        email: sanitization.sanitizeText(email),
        name: 'Test User'
      };

      // Create secure session
      const sessionId = sessionManagement.createSession(userData.id, {
        ip: await getClientIP(),
        userAgent: navigator.userAgent
      });

      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);

      // Record successful login
      loginAttempts.recordAttempt(email, true);
      auditLog.add('LOGIN_SUCCESS', email, { userId: userData.id });

      return { success: true, user: userData };
    } catch (error) {
      // Record failed login
      loginAttempts.recordAttempt(email, false);
      auditLog.add('LOGIN_FAILED', email, { error: error.message });
      throw error;
    }
  }, []);

  // Secure logout function
  const logout = useCallback(() => {
    const sessionId = localStorage.getItem('sessionId');
    const userId = user?.id;

    // Clean up session
    if (sessionId) {
      sessionManagement.destroySession(sessionId);
    }

    // Clean up localStorage
    localStorage.removeItem('sessionId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Log logout
    if (userId) {
      auditLog.add('LOGOUT', userId, {
        ip: 'unknown',
        userAgent: navigator.userAgent
      });
    }

    setIsAuthenticated(false);
    setUser(null);
  }, [user]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
};

// Hook for input validation
export const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value, rules) => {
    const fieldErrors = [];

    if (rules.required && (!value || value.trim() === '')) {
      fieldErrors.push('This field is required');
    }

    if (value && rules.email && !validation.isValidEmail(value)) {
      fieldErrors.push('Invalid email format');
    }

    if (value && rules.password && !validation.isValidPassword(value)) {
      fieldErrors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    if (value && rules.phone && !validation.isValidPhone(value)) {
      fieldErrors.push('Invalid phone number');
    }

    if (value && rules.name && !validation.isValidName(value)) {
      fieldErrors.push('Invalid name format');
    }

    if (value && rules.businessName && !validation.isValidBusinessName(value)) {
      fieldErrors.push('Invalid business name format');
    }

    if (value && rules.amount && !validation.isValidAmount(value)) {
      fieldErrors.push('Invalid amount');
    }

    if (value && rules.url && !validation.isValidUrl(value)) {
      fieldErrors.push('Invalid URL format');
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors
    }));

    return fieldErrors.length === 0;
  }, []);

  const validateForm = useCallback((formData, validationRules) => {
    const formErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const fieldErrors = [];
      const value = formData[field];
      const rules = validationRules[field];

      if (rules.required && (!value || value.trim() === '')) {
        fieldErrors.push('This field is required');
        isValid = false;
      }

      if (value && rules.email && !validation.isValidEmail(value)) {
        fieldErrors.push('Invalid email format');
        isValid = false;
      }

      if (value && rules.password && !validation.isValidPassword(value)) {
        fieldErrors.push('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
        isValid = false;
      }

      if (value && rules.phone && !validation.isValidPhone(value)) {
        fieldErrors.push('Invalid phone number');
        isValid = false;
      }

      if (value && rules.name && !validation.isValidName(value)) {
        fieldErrors.push('Invalid name format');
        isValid = false;
      }

      if (value && rules.businessName && !validation.isValidBusinessName(value)) {
        fieldErrors.push('Invalid business name format');
        isValid = false;
      }

      if (value && rules.amount && !validation.isValidAmount(value)) {
        fieldErrors.push('Invalid amount');
        isValid = false;
      }

      if (value && rules.url && !validation.isValidUrl(value)) {
        fieldErrors.push('Invalid URL format');
        isValid = false;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        fieldErrors.push(`Minimum length is ${rules.minLength} characters`);
        isValid = false;
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        fieldErrors.push(`Maximum length is ${rules.maxLength} characters`);
        isValid = false;
      }

      if (fieldErrors.length > 0) {
        formErrors[field] = fieldErrors;
      }
    });

    setErrors(formErrors);
    return isValid;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors
  };
};

// Hook for secure form handling
export const useSecureForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const { errors, validateField, validateForm, clearErrors } = useValidation();

  const handleInputChange = useCallback((field, value) => {
    // Sanitize input
    const sanitizedValue = sanitization.sanitizeText(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: []
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (validationRules, onSubmit) => {
    clearErrors();

    // Validate form
    const isValid = validateForm(formData, validationRules);

    if (!isValid) {
      return { success: false, errors };
    }

    try {
      // Log form submission
      auditLog.add('FORM_SUBMISSION', 'anonymous', {
        formType: 'user_input',
        fields: Object.keys(formData)
      });

      // Call onSubmit with sanitized data
      const result = await onSubmit(sanitization.sanitizeObject(formData));
      
      auditLog.add('FORM_SUBMISSION_SUCCESS', 'anonymous', {
        formType: 'user_input'
      });

      return { success: true, data: result };
    } catch (error) {
      auditLog.add('FORM_SUBMISSION_ERROR', 'anonymous', {
        formType: 'user_input',
        error: error.message
      });

      return { success: false, error: error.message };
    }
  }, [formData, validateForm, clearErrors, errors]);

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    setFormData
  };
};

// Hook for secure data handling
export const useSecureData = () => {
  const encryptData = useCallback((data) => {
    return encryption.encrypt(data);
  }, []);

  const decryptData = useCallback((encryptedData) => {
    return encryption.decrypt(encryptedData);
  }, []);

  const hashPassword = useCallback((password) => {
    return encryption.hashPassword(password);
  }, []);

  const verifyPassword = useCallback((password, hash) => {
    return encryption.verifyPassword(password, hash);
  }, []);

  return {
    encryptData,
    decryptData,
    hashPassword,
    verifyPassword
  };
};

// Utility function to get client IP
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
};

export default {
  useSecureAuth,
  useValidation,
  useSecureForm,
  useSecureData
}; 