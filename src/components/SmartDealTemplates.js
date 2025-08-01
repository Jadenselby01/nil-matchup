import React, { useState } from 'react';
import './SmartDealTemplates.css';

const SmartDealTemplates = ({ userType, onDealCreate, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customDetails, setCustomDetails] = useState({
    budget: '',
    platform: 'instagram',
    duration: '7',
    customDeliverables: ''
  });

  const dealTemplates = [
    {
      id: 'instagram-story',
      title: 'Instagram Story',
      icon: '📸',
      description: 'Quick story post with brand tag',
      defaultBudget: 100,
      deliverables: '1x Instagram Story tagging @brand within 7 days',
      platform: 'instagram',
      duration: '7'
    },
    {
      id: 'instagram-post',
      title: 'Instagram Post',
      icon: 'Instagram',
      description: 'Feed post with brand integration',
      defaultBudget: 200,
      deliverables: '1x Instagram Post with brand integration within 7 days',
      platform: 'instagram',
      duration: '7'
    },
    {
      id: 'tiktok-video',
      title: 'TikTok Video',
      icon: 'TikTok',
      description: 'Short video content',
      defaultBudget: 300,
      deliverables: '1x TikTok video featuring brand within 7 days',
      platform: 'tiktok',
      duration: '7'
    },
    {
      id: 'facebook-post',
      title: 'Facebook Post',
      icon: '📘',
      description: 'Facebook page post',
      defaultBudget: 150,
      deliverables: '1x Facebook post about brand within 7 days',
      platform: 'facebook',
      duration: '7'
    },
    {
      id: 'twitter-post',
      title: 'Twitter Post',
      icon: 'Twitter',
      description: 'Twitter/X post',
      defaultBudget: 75,
      deliverables: '1x Twitter post mentioning brand within 7 days',
      platform: 'twitter',
      duration: '7'
    },
    {
      id: 'custom',
      title: 'Custom Deal',
      icon: '⚙️',
      description: 'Create your own deal terms',
      defaultBudget: 0,
      deliverables: '',
      platform: 'custom',
      duration: '7'
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomDetails({
      budget: template.defaultBudget,
      platform: template.platform,
      duration: template.duration,
      customDeliverables: template.deliverables
    });
  };

  const handleInputChange = (field, value) => {
    setCustomDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateDeal = () => {
    if (!selectedTemplate) return;

    const dealData = {
      title: selectedTemplate.title,
      deliverables: customDetails.customDeliverables,
      paymentAmount: parseInt(customDetails.budget),
      platform: customDetails.platform,
      duration: customDetails.duration,
      deadline: new Date(Date.now() + parseInt(customDetails.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onDealCreate(dealData);
  };

  const getPreviewDeliverables = () => {
    if (selectedTemplate?.id === 'custom') {
      return customDetails.customDeliverables;
    }
    
    if (selectedTemplate) {
      return selectedTemplate.deliverables.replace('@brand', '@yourbrand');
    }
    
    return '';
  };

  return (
    <div className="templates-overlay">
      <div className="templates-modal">
        <div className="templates-header">
          <h2>🚀 Quick Deal Setup</h2>
          <p>Choose a template or create a custom deal</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="templates-content">
          <div className="templates-grid">
            {dealTemplates.map(template => (
              <div
                key={template.id}
                className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="template-icon">{template.icon}</div>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
                <div className="template-budget">
                  ${template.defaultBudget}
                </div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="deal-customization">
              <h3>Customize Your Deal</h3>
              
              <div className="customization-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Budget ($)</label>
                    <input
                      type="number"
                      value={customDetails.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Enter amount"
                      min="1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Duration (days)</label>
                    <select
                      value={customDetails.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    >
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                    </select>
                  </div>
                </div>

                {selectedTemplate.id === 'custom' && (
                  <div className="form-group">
                    <label>Deliverables</label>
                    <textarea
                      value={customDetails.customDeliverables}
                      onChange={(e) => handleInputChange('customDeliverables', e.target.value)}
                      placeholder="Describe what the athlete needs to do..."
                      rows="3"
                    />
                  </div>
                )}
              </div>

              <div className="deal-preview">
                <h4>Deal Preview</h4>
                <div className="preview-card">
                  <div className="preview-header">
                    <span className="preview-icon">{selectedTemplate.icon}</span>
                    <div>
                      <h5>{selectedTemplate.title}</h5>
                      <span className="preview-budget">${customDetails.budget}</span>
                    </div>
                  </div>
                  <p className="preview-deliverables">{getPreviewDeliverables()}</p>
                  <div className="preview-meta">
                    <span>⏰ Due in {customDetails.duration} days</span>
                    <span>💰 Payment secured</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="templates-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          
          <button 
            className="create-btn"
            onClick={handleCreateDeal}
            disabled={!selectedTemplate || !customDetails.budget}
          >
            Create Deal
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartDealTemplates; 