import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  sessionManagement, 
  loginAttempts, 
  auditLog,
  validation,
  sanitization 
} from '../utils/security';

// Security context state
const initialState = {
  isAuthenticated: false,
  user: null,
  session: null,
  loading: true,
  securityLevel: 'medium', // low, medium, high
  lastActivity: Date.now(),
  failedLoginAttempts: 0,
  lockoutUntil: null
};

// Security action types
const SECURITY_ACTIONS = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  SET_LOADING: 'SET_LOADING',
  SET_SECURITY_LEVEL: 'SET_SECURITY_LEVEL',
  UPDATE_LAST_ACTIVITY: 'UPDATE_LAST_ACTIVITY',
  INCREMENT_FAILED_ATTEMPTS: 'INCREMENT_FAILED_ATTEMPTS',
  RESET_FAILED_ATTEMPTS: 'RESET_FAILED_ATTEMPTS',
  SET_LOCKOUT: 'SET_LOCKOUT',
  LOGOUT: 'LOGOUT'
};

// Security reducer
const securityReducer = (state, action) => {
  switch (action.type) {
    case SECURITY_ACTIONS.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload
      };

    case SECURITY_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case SECURITY_ACTIONS.SET_SESSION:
      return {
        ...state,
        session: action.payload
      };

    case SECURITY_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case SECURITY_ACTIONS.SET_SECURITY_LEVEL:
      return {
        ...state,
        securityLevel: action.payload
      };

    case SECURITY_ACTIONS.UPDATE_LAST_ACTIVITY:
      return {
        ...state,
        lastActivity: Date.now()
      };

    case SECURITY_ACTIONS.INCREMENT_FAILED_ATTEMPTS:
      return {
        ...state,
        failedLoginAttempts: state.failedLoginAttempts + 1
      };

    case SECURITY_ACTIONS.RESET_FAILED_ATTEMPTS:
      return {
        ...state,
        failedLoginAttempts: 0,
        lockoutUntil: null
      };

    case SECURITY_ACTIONS.SET_LOCKOUT:
      return {
        ...state,
        lockoutUntil: action.payload
      };

    case SECURITY_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false
      };

    default:
      return state;
  }
};

// Create security context
const SecurityContext = createContext();

// Security provider component
export const SecurityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(securityReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const sessionId = localStorage.getItem('sessionId');
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (sessionId && token && userData) {
        const sessionCheck = sessionManagement.validateSession(sessionId);
        
        if (sessionCheck.valid) {
          dispatch({ type: SECURITY_ACTIONS.SET_AUTHENTICATED, payload: true });
          dispatch({ type: SECURITY_ACTIONS.SET_USER, payload: JSON.parse(userData) });
          dispatch({ type: SECURITY_ACTIONS.SET_SESSION, payload: sessionCheck.session });
          
          // Log successful session validation
          auditLog.add('SESSION_VALIDATED', JSON.parse(userData).id, {
            sessionId,
            ip: sessionCheck.session.ip
          });
        } else {
          // Session expired or invalid
          logout();
        }
      }
      
      dispatch({ type: SECURITY_ACTIONS.SET_LOADING, payload: false });
    };

    checkAuthStatus();
  }, []);

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
  }, [state.isAuthenticated, state.lastActivity, state.user]);

  // Security functions
  const login = async (email, password) => {
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

      // Record successful login
      loginAttempts.recordAttempt(email, true);
      auditLog.add('LOGIN_SUCCESS', email, { userId: userData.id });

      return { success: true, user: userData };
    } catch (error) {
      // Record failed login
      loginAttempts.recordAttempt(email, false);
      dispatch({ type: SECURITY_ACTIONS.INCREMENT_FAILED_ATTEMPTS });
      
      auditLog.add('LOGIN_FAILED', email, { error: error.message });
      throw error;
    }
  };

  const logout = () => {
    const sessionId = localStorage.getItem('sessionId');
    const userId = state.user?.id;

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

    dispatch({ type: SECURITY_ACTIONS.LOGOUT });
  };

  const updateSecurityLevel = (level) => {
    dispatch({ type: SECURITY_ACTIONS.SET_SECURITY_LEVEL, payload: level });
  };

  const validateSession = () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return false;

    const sessionCheck = sessionManagement.validateSession(sessionId);
    return sessionCheck.valid;
  };

  const getSecurityHeaders = () => {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  };

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