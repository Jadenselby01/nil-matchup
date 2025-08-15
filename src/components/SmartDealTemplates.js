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
      id: 'tier1',
      title: 'Tier 1 - $100-$250',
      icon: '📱',
      description: 'Low-effort, single-platform post',
      defaultBudget: 175,
      deliverables: 'Single platform post (Instagram feed, Story, TikTok under 30s, X post)',
      platform: 'single',
      duration: '7',
      scope: 'Low-effort, single-platform post',
      examples: [
        '1 Instagram feed post (single image or simple caption)',
        '1 Instagram Story with swipe-up link',
        '1 TikTok under 30 seconds',
        '1 static post on X (Twitter)'
      ]
    },
    {
      id: 'tier2',
      title: 'Tier 2 - $250-$500',
      icon: '📸',
      description: 'Multi-post package or higher-effort single deliverable',
      defaultBudget: 375,
      deliverables: 'Multi-post package or higher-effort content',
      platform: 'multi',
      duration: '14',
      scope: 'Multi-post package or higher-effort single deliverable',
      examples: [
        '1 Instagram feed post + 1 Story',
        'TikTok with custom script or outfit',
        'Carousel post (3–5 images) highlighting product/event',
        'Short video (15–30 sec) on both TikTok & Instagram Reels'
      ]
    },
    {
      id: 'tier3',
      title: 'Tier 3 - $500-$1,000',
      icon: '🎬',
      description: 'Multi-platform content & custom engagement',
      defaultBudget: 750,
      deliverables: 'Multi-platform content with custom engagement',
      platform: 'multi-platform',
      duration: '21',
      scope: 'Multi-platform content & custom engagement',
      examples: [
        '1 TikTok + 1 Instagram Reel + 1 Story',
        'Behind-the-scenes vlog promoting brand',
        'Unboxing video with brand tags',
        'Athlete appears at a local event and posts about it before/during'
      ]
    },
    {
      id: 'tier4',
      title: 'Tier 4 - $1,000-$2,500',
      icon: '🌟',
      description: 'Ongoing campaign or exclusive promo period',
      defaultBudget: 1750,
      deliverables: 'Ongoing campaign or exclusive promotion',
      platform: 'campaign',
      duration: '30',
      scope: 'Ongoing campaign or exclusive promo period',
      examples: [
        '3–5 posts over a month across Instagram, TikTok, and X',
        'Exclusive product ambassador role (no competing sponsors in category)',
        'Giveaway contest hosted on athlete\'s page',
        'Live Q&A or livestream event with brand feature'
      ]
    },
    {
      id: 'tier5',
      title: 'Tier 5 - $2,500+',
      icon: '💎',
      description: 'Full sponsorship package',
      defaultBudget: 3000,
      deliverables: 'Full sponsorship package with ongoing content',
      platform: 'sponsorship',
      duration: '60',
      scope: 'Full sponsorship package',
      examples: [
        'Monthly or semester-long ambassadorship',
        'Branded content series (weekly videos/posts)',
        'Full-day appearance & content creation for the brand',
        'Athlete featured in brand\'s own ads with cross-posting'
      ]
    },
    {
      id: 'custom',
      title: 'Custom Deal',
      icon: '⚙️',
      description: 'Create your own deal terms',
      defaultBudget: 0,
      deliverables: '',
      platform: 'custom',
      duration: '7',
      scope: 'Custom requirements and deliverables',
      examples: ['Define your own scope and requirements']
    }
  ];

  const socialMediaTypes = [
    'Instagram Feed Post',
    'Instagram Story',
    'Instagram Reel',
    'TikTok Video',
    'X (Twitter) Post',
    'YouTube Short/Video',
    'Livestream/Live Appearance',
    'Giveaway Collaboration',
    'Event Promotion',
    'Product Unboxing'
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
      deliverables: customDetails.customDeliverables || selectedTemplate.deliverables,
      paymentAmount: parseInt(customDetails.budget),
      platform: customDetails.platform,
      duration: customDetails.duration,
      deadline: new Date(Date.now() + parseInt(customDetails.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scope: selectedTemplate.scope,
      examples: selectedTemplate.examples
    };

    onDealCreate(dealData);
  };

  const getPreviewDeliverables = () => {
    if (selectedTemplate?.id === 'custom') {
      return customDetails.customDeliverables;
    }
    
    if (selectedTemplate) {
      return selectedTemplate.deliverables;
    }
    
    return '';
  };

  return (
    <div className="templates-overlay">
      <div className="templates-modal">
        <div className="templates-header">
          <h2>🚀 Smart Deal Templates</h2>
          <p>Choose from our tiered pricing structure or create a custom deal</p>
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
                <div className="template-scope">
                  <strong>Scope:</strong> {template.scope}
                </div>
              </div>
            ))}
          </div>

          {selectedTemplate && (
            <div className="deal-customization">
              <h3>Customize Your Deal</h3>
              
              <div className="template-details">
                <div className="detail-section">
                  <h4>Scope & Examples</h4>
                  <div className="scope-info">
                    <p><strong>Scope:</strong> {selectedTemplate.scope}</p>
                    <div className="examples-list">
                      <strong>Examples:</strong>
                      <ul>
                        {selectedTemplate.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="social-media-types">
                  <h4>Common Social Media Promotion Types</h4>
                  <div className="types-grid">
                    {socialMediaTypes.map((type, index) => (
                      <span key={index} className="type-tag">{type}</span>
                    ))}
                  </div>
                </div>
              </div>
              
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
                      <option value="21">21 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
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