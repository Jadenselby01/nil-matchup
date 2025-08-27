import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthTest = () => {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState('');
  
  // Get auth context at component level
  const auth = useAuth();

  const testStep1 = () => {
    try {
      // Test 1: Can we access the context?
      if (auth !== null && auth !== undefined) {
        setResult('✅ Step 1: Auth context is accessible');
        setStep(2);
      } else {
        setResult('❌ Step 1: Auth context is null/undefined');
      }
    } catch (error) {
      setResult(`❌ Step 1: Error accessing context - ${error.message}`);
    }
  };

  const testStep2 = () => {
    try {
      // Test 2: Check if context has expected properties
      if (auth && typeof auth === 'object') {
        const hasSession = 'session' in auth;
        const hasUser = 'user' in auth;
        const hasProfile = 'profile' in auth;
        const hasLoading = 'loading' in auth;
        
        setResult(`✅ Step 2: Context properties - Session: ${hasSession}, User: ${hasUser}, Profile: ${hasProfile}, Loading: ${hasLoading}`);
        setStep(3);
      } else {
        setResult('❌ Step 2: Auth context is not an object');
      }
    } catch (error) {
      setResult(`❌ Step 2: Error checking properties - ${error.message}`);
    }
  };

  const testStep3 = () => {
    try {
      // Test 3: Check actual values
      if (auth) {
        const { session, user, profile, loading } = auth;
        setResult(`✅ Step 3: Values - Session: ${!!session}, User: ${!!user}, Profile: ${!!profile}, Loading: ${loading}`);
      } else {
        setResult('❌ Step 3: Cannot access auth context');
      }
    } catch (error) {
      setResult(`❌ Step 3: Error checking values - ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', border: '2px solid #333' }}>
      <h3>🧪 AUTH CONTEXT TEST</h3>
      <p>Current Step: {step}</p>
      <p>Result: {result}</p>
      <p>Auth Context Type: {typeof auth}</p>
      <p>Auth Context Value: {auth === null ? 'null' : auth === undefined ? 'undefined' : 'object'}</p>
      
      <div style={{ marginTop: '20px' }}>
        {step >= 1 && (
          <button onClick={testStep1} style={{ margin: '5px', padding: '10px' }}>
            Test 1: Access Context
          </button>
        )}
        
        {step >= 2 && (
          <button onClick={testStep2} style={{ margin: '5px', padding: '10px' }}>
            Test 2: Check Properties
          </button>
        )}
        
        {step >= 3 && (
          <button onClick={testStep3} style={{ margin: '5px', padding: '10px' }}>
            Test 3: Check Values
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthTest; 