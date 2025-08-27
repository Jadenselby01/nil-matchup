import React, { useEffect, useState } from 'react';

export default function HumanGate({ onChange }) {
  const [ok, setOk] = useState(false);
  
  useEffect(() => { 
    onChange(ok); 
  }, [ok, onChange]);
  
  return (
    <div className="form-group">
      <label className="checkbox-label">
        <input 
          type="checkbox" 
          checked={ok}
          onChange={e => setOk(e.target.checked)} 
        />
        <span className="checkmark"></span>
        I'm human *
      </label>
    </div>
  );
} 