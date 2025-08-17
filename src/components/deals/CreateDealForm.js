import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Deals.css';

const CreateDealForm = ({ onDealCreated, onCancel }) => {
  const { userProfile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: {
      min: '',
      max: '',
      currency: 'USD'
    },
    deliverables: '',
    requirements: '',
    deadline: '',
    location: '',
    isRemote: false,
    athletePreferences: {
      sport: '',
      university: '',
      minFollowers: '',
      engagementRate: ''
    },
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'social_media', label: 'Social Media Promotion' },
    { value: 'content_creation', label: 'Content Creation' },
    { value: 'product_review', label: 'Product Review' },
    { value: 'event_promotion', label: 'Event Promotion' },
    { value: 'brand_campaign', label: 'Brand Campaign' },
    { value: 'ambassador', label: 'Brand Ambassador' },
    { value: 'appearance', label: 'Personal Appearance' },
    { value: 'other', label: 'Other' }
  ];

  const sports = [
    'Basketball', 'Football', 'Baseball', 'Soccer', 'Tennis', 'Golf',
    'Swimming', 'Track & Field', 'Volleyball', 'Hockey', 'Lacrosse',
    'Wrestling', 'Gymnastics', 'Softball', 'Field Hockey', 'Other'
  ];

  const universities = [
    'UNC Chapel Hill', 'Duke University', 'NC State University',
    'Wake Forest University', 'University of Virginia', 'Virginia Tech',
    'Clemson University', 'University of South Carolina', 'Other'
  ];

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Deal title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.budget.min || !formData.budget.max) newErrors.budget = 'Budget range is required';
    if (!formData.deliverables.trim()) newErrors.deliverables = 'Deliverables are required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';

    // Validate budget range
    if (formData.budget.min && formData.budget.max) {
      const min = parseFloat(formData.budget.min);
      const max = parseFloat(formData.budget.max);
      if (min >= max) {
        newErrors.budget = 'Maximum budget must be greater than minimum';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with real API call to Supabase
      // const { data, error } = await supabase
      //   .from('deals')
      //   .insert({
      //     business_id: userProfile.id,
      //     business_name: userProfile.company_name,
      //     ...formData,
      //     status: 'open',
      //     created_at: new Date().toISOString()
      //   })
      //   .select()
      //   .single();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newDeal = {
        id: `deal-${Date.now()}`,
        business_id: userProfile.id,
        business_name: userProfile.company_name,
        ...formData,
        status: 'open',
        created_at: new Date().toISOString()
      };

      onDealCreated(newDeal);
    } catch (error) {
      console.error('Error creating deal:', error);
      setErrors({ submit: 'Failed to create deal. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-deal-form">
      <div className="form-header">
        <h2>Create New NIL Deal</h2>
        <p>Fill out the form below to create an opportunity for athletes</p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Deal Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Social Media Campaign for Local Restaurant"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what you're looking for from athletes..."
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Budget & Timeline</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetMin">Minimum Budget *</label>
              <input
                type="number"
                id="budgetMin"
                value={formData.budget.min}
                onChange={(e) => handleChange('budget.min', e.target.value)}
                placeholder="500"
                min="0"
                className={errors.budget ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor="budgetMax">Maximum Budget *</label>
              <input
                type="number"
                id="budgetMax"
                value={formData.budget.max}
                onChange={(e) => handleChange('budget.max', e.target.value)}
                placeholder="1000"
                min="0"
                className={errors.budget ? 'error' : ''}
              />
            </div>
          </div>
          {errors.budget && <span className="error-text">{errors.budget}</span>}

          <div className="form-group">
            <label htmlFor="deadline">Deadline *</label>
            <input
              type="date"
              id="deadline"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={errors.deadline ? 'error' : ''}
            />
            {errors.deadline && <span className="error-text">{errors.deadline}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Requirements & Deliverables</h3>
          
          <div className="form-group">
            <label htmlFor="deliverables">Deliverables *</label>
            <textarea
              id="deliverables"
              value={formData.deliverables}
              onChange={(e) => handleChange('deliverables', e.target.value)}
              placeholder="e.g., 3 Instagram posts, 1 TikTok video, 2 stories"
              rows="3"
              className={errors.deliverables ? 'error' : ''}
            />
            {errors.deliverables && <span className="error-text">{errors.deliverables}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange('requirements', e.target.value)}
              placeholder="Any specific requirements or qualifications..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Athlete Preferences</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sport">Preferred Sport</label>
              <select
                id="sport"
                value={formData.athletePreferences.sport}
                onChange={(e) => handleChange('athletePreferences.sport', e.target.value)}
              >
                <option value="">Any sport</option>
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="university">Preferred University</label>
              <select
                id="university"
                value={formData.athletePreferences.university}
                onChange={(e) => handleChange('athletePreferences.university', e.target.value)}
              >
                <option value="">Any university</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minFollowers">Minimum Followers</label>
              <input
                type="number"
                id="minFollowers"
                value={formData.athletePreferences.minFollowers}
                onChange={(e) => handleChange('athletePreferences.minFollowers', e.target.value)}
                placeholder="1000"
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="engagementRate">Min Engagement Rate (%)</label>
              <input
                type="number"
                id="engagementRate"
                value={formData.athletePreferences.engagementRate}
                onChange={(e) => handleChange('athletePreferences.engagementRate', e.target.value)}
                placeholder="3.0"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, State or Remote"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isRemote}
                onChange={(e) => handleChange('isRemote', e.target.checked)}
              />
              This deal can be completed remotely
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">Additional Information</label>
            <textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => handleChange('additionalInfo', e.target.value)}
              placeholder="Any other details or special instructions..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Deal...' : 'Create Deal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDealForm; 