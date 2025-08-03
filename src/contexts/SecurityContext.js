import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { encryption, validation, sanitization, rateLimiting, sessionManagement, loginAttempts, auditLog, securityHeaders, dataClassification, gdpr } from '../utils/security';

// Security actions
const SECURITY_ACTIONS = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER: 'SET_USER',
  SET_FAILED_ATTEMPTS: 'SET_FAILED_ATTEMPTS',
  SET_LOCKOUT: 'SET_LOCKOUT',
  RESET_FAILED_ATTEMPTS: 'RESET_FAILED_ATTEMPTS',
  UPDATE_LAST_ACTIVITY: 'UPDATE_LAST_ACTIVITY',
  SET_SECURITY_LEVEL: 'SET_SECURITY_LEVEL'
};

// Security reducer
const securityReducer = (state, action) => {
  switch (action.type) {
    case SECURITY_ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case SECURITY_ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case SECURITY_ACTIONS.SET_FAILED_ATTEMPTS:
      return { ...state, failedAttempts: action.payload };
    case SECURITY_ACTIONS.SET_LOCKOUT:
      return { ...state, lockoutUntil: action.payload };
    case SECURITY_ACTIONS.RESET_FAILED_ATTEMPTS:
      return { ...state, failedAttempts: 0, lockoutUntil: null };
    case SECURITY_ACTIONS.UPDATE_LAST_ACTIVITY:
      return { ...state, lastActivity: Date.now() };
    case SECURITY_ACTIONS.SET_SECURITY_LEVEL:
      return { ...state, securityLevel: action.payload };
    default:
      return state;
  }
};

// Security context
const SecurityContext = createContext();

// Security provider
export const SecurityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(securityReducer, {
    isAuthenticated: false,
    user: null,
    failedAttempts: 0,
    lockoutUntil: null,
    lastActivity: null,
    securityLevel: 'medium'
  });

  // Check authentication status on mount
  const checkAuthStatus = useCallback(() => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (sessionId && authToken && userData) {
        const isValid = sessionManagement.validateSession(sessionId);
        if (isValid) {
          const user = JSON.parse(userData);
          dispatch({ type: SECURITY_ACTIONS.SET_AUTHENTICATED, payload: true });
          dispatch({ type: SECURITY_ACTIONS.SET_USER, payload: user });
          dispatch({ type: SECURITY_ACTIONS.UPDATE_LAST_ACTIVITY });
        } else {
          // Session expired, clear data
          localStorage.removeItem('sessionId');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear corrupted data
      localStorage.removeItem('sessionId');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Monitor user activity
  useEffect(() => {
    const updateActivity = () => {
      dispatch({ type: SECURITY_ACTIONS.UPDATE_LAST_ACTIVITY });
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Security functions
  const login = useCallback(async (email, password) => {
    try {
      // Validate input
      if (!validation.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      if (!validation.isValidPassword(password)) {
        throw new Error('Password does not meet security requirements');
      }

      // Check if account is locked
      if (state.lockoutUntil && Date.now() < state.lockoutUntil) {
        const remainingTime = Math.ceil((state.lockoutUntil - Date.now()) / 1000 / 60);
        throw new Error(`Account is locked. Please try again in ${remainingTime} minutes.`);
      }

      // Check login attempts
      const loginCheck = loginAttempts.isAllowed(email);
      if (!loginCheck.allowed) {
        dispatch({ type: SECURITY_ACTIONS.SET_LOCKOUT, payload: loginCheck.remainingTime });
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
        name: 'Test User',
        userType: 'athlete'
      };

      // Create secure session
      const sessionId = sessionManagement.createSession(userData.id, {
        ip: await getClientIP(),
        userAgent: navigator.userAgent
      });

      // Store in localStorage
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('authToken', 'mock-token');
      localStorage.setItem('userData', JSON.stringify(userData));

      // Update state
      dispatch({ type: SECURITY_ACTIONS.SET_AUTHENTICATED, payload: true });
      dispatch({ type: SECURITY_ACTIONS.SET_USER, payload: userData });
      dispatch({ type: SECURITY_ACTIONS.RESET_FAILED_ATTEMPTS });
      dispatch({ type: SECURITY_ACTIONS.UPDATE_LAST_ACTIVITY });

      return { success: true, user: userData };
    } catch (error) {
      // Increment failed attempts
      dispatch({ type: SECURITY_ACTIONS.SET_FAILED_ATTEMPTS, payload: state.failedAttempts + 1 });
      
      // Log failed attempt
      auditLog.add('LOGIN_FAILED', email, {
        error: error.message,
        ip: await getClientIP(),
        userAgent: navigator.userAgent
      });

      throw error;
    }
  }, [state.lockoutUntil, state.failedAttempts]);

  const logout = useCallback(() => {
    try {
      // Clear session
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        sessionManagement.destroySession(sessionId);
      }

      // Clear localStorage
      localStorage.removeItem('sessionId');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // Reset state
      dispatch({ type: SECURITY_ACTIONS.SET_AUTHENTICATED, payload: false });
      dispatch({ type: SECURITY_ACTIONS.SET_USER, payload: null });
      dispatch({ type: SECURITY_ACTIONS.RESET_FAILED_ATTEMPTS });

      // Log logout
      auditLog.add('LOGOUT', state.user?.id, {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [state.user?.id]);

  // Check for session timeout
  useEffect(() => {
    const checkSessionTimeout = () => {
      if (state.isAuthenticated && state.lastActivity) {
        const timeout = 30 * 60 * 1000; // 30 minutes
        const timeSinceLastActivity = Date.now() - state.lastActivity;
        
        if (timeSinceLastActivity > timeout) {
          auditLog.add('SESSION_TIMEOUT', state.user?.id, {
            lastActivity: new Date(state.lastActivity).toISOString()
          });
          logout();
        }
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.lastActivity, state.user, logout]);

  // Additional security functions
  const updateSecurityLevel = useCallback((level) => {
    dispatch({ type: SECURITY_ACTIONS.SET_SECURITY_LEVEL, payload: level });
  }, []);

  const validateSession = useCallback(() => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      return sessionManagement.validateSession(sessionId);
    }
    return false;
  }, []);

  const getSecurityHeaders = useCallback(() => {
    return securityHeaders.generateHeaders();
  }, []);

  // Context value
  const value = {
    ...state,
    login,
    logout,
    updateSecurityLevel,
    validateSession,
    getSecurityHeaders
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook to use security context
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
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

export default SecurityContext; 