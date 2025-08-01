import React, { useRef, useState, useEffect } from 'react';
import './DigitalSignature.css';

const DigitalSignature = ({ onSave, onCancel, athleteName = '' }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState('');
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState(athleteName);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set drawing styles
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Convert canvas to data URL
    const canvas = canvasRef.current;
    setSignature(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
    setTypedSignature('');
  };

  const handleSave = () => {
    const finalSignature = signatureMode === 'draw' ? signature : typedSignature;
    if (finalSignature) {
      onSave({
        signature: finalSignature,
        mode: signatureMode,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1' // In production, get real IP
      });
    }
  };

  return (
    <div className="signature-modal">
      <div className="signature-content">
        <div className="signature-header">
          <h3>Digital Signature</h3>
          <p>Please sign below to complete your NIL agreements</p>
        </div>

        <div className="signature-tabs">
          <button 
            className={`tab-btn ${signatureMode === 'draw' ? 'active' : ''}`}
            onClick={() => setSignatureMode('draw')}
          >
            ✏️ Draw Signature
          </button>
          <button 
            className={`tab-btn ${signatureMode === 'type' ? 'active' : ''}`}
            onClick={() => setSignatureMode('type')}
          >
            ⌨️ Type Signature
          </button>
        </div>

        {signatureMode === 'draw' ? (
          <div className="drawing-area">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="signature-canvas"
            />
            <div className="canvas-placeholder">
              Draw your signature above
            </div>
          </div>
        ) : (
          <div className="typing-area">
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full name"
              className="signature-input"
            />
            <div className="signature-preview">
              <span className="preview-text">{typedSignature || 'Your signature will appear here'}</span>
            </div>
          </div>
        )}

        <div className="signature-actions">
          <button className="clear-btn" onClick={clearSignature}>
            Clear
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={!signature && !typedSignature}
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalSignature; 