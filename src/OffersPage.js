import React, { useState } from 'react';
import './OffersPage.css';

const OffersPage = ({ setCurrentPage }) => {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  const businessDeals = [
    {
      id: 1,
      business: {
        name: 'Sports Gear Co.',
        logo: '🏃‍♂️',
        industry: 'Sports Equipment'
      },
      title: 'Social Media Promotion Campaign',
      description: 'Looking for college athletes to promote our new line of performance gear through authentic social media content.',
      category: 'Social Media',
      requirements: 'Must be active on Instagram/TikTok, authentic content style, engagement with followers',
      targetAudience: 'College students, Sports fans, Fitness enthusiasts',
      tiers: [
        {
          id: 'tier1',
          name: 'Tier 1 - $100-$250',
          price: '$100-$250',
          description: 'Low-effort, single-platform post',
          scope: 'Low-effort, single-platform post',
          examples: [
            '1 Instagram feed post (single image or simple caption)',
            '1 Instagram Story with swipe-up link',
            '1 TikTok under 30 seconds',
            '1 static post on X (Twitter)'
          ],
          deliverables: 'Single platform post with brand integration',
          duration: '7 days'
        },
        {
          id: 'tier2',
          name: 'Tier 2 - $250-$500',
          price: '$250-$500',
          description: 'Multi-post package or higher-effort single deliverable',
          scope: 'Multi-post package or higher-effort single deliverable',
          examples: [
            '1 Instagram feed post + 1 Story',
            'TikTok with custom script or outfit',
            'Carousel post (3–5 images) highlighting product/event',
            'Short video (15–30 sec) on both TikTok & Instagram Reels'
          ],
          deliverables: 'Multi-post package or higher-effort content',
          duration: '14 days'
        },
        {
          id: 'tier3',
          name: 'Tier 3 - $500-$1,000',
          price: '$500-$1,000',
          description: 'Multi-platform content & custom engagement',
          scope: 'Multi-platform content & custom engagement',
          examples: [
            '1 TikTok + 1 Instagram Reel + 1 Story',
            'Behind-the-scenes vlog promoting brand',
            'Unboxing video with brand tags',
            'Athlete appears at a local event and posts about it before/during'
          ],
          deliverables: 'Multi-platform content with custom engagement',
          duration: '21 days'
        },
        {
          id: 'tier4',
          name: 'Tier 4 - $1,000-$2,500',
          price: '$1,000-$2,500',
          description: 'Ongoing campaign or exclusive promo period',
          scope: 'Ongoing campaign or exclusive promo period',
          examples: [
            '3–5 posts over a month across Instagram, TikTok, and X',
            'Exclusive product ambassador role (no competing sponsors in category)',
            'Giveaway contest hosted on athlete\'s page',
            'Live Q&A or livestream event with brand feature'
          ],
          deliverables: 'Ongoing campaign or exclusive promotion',
          duration: '30 days'
        },
        {
          id: 'tier5',
          name: 'Tier 5 - $2,500+',
          price: '$2,500+',
          description: 'Full sponsorship package',
          scope: 'Full sponsorship package',
          examples: [
            'Monthly or semester-long ambassadorship',
            'Branded content series (weekly videos/posts)',
            'Full-day appearance & content creation for the brand',
            'Athlete featured in brand\'s own ads with cross-posting'
          ],
          deliverables: 'Full sponsorship package with ongoing content',
          duration: '60 days'
        }
      ]
    },
    {
      id: 2,
      business: {
        name: 'Fitness App',
        logo: '💪',
        industry: 'Technology'
      },
      title: 'Workout Challenge Promotion',
      description: 'Seeking athletes to promote our 30-day fitness challenge app through social media and personal testimonials.',
      category: 'Fitness',
      requirements: 'Athletes must complete the challenge, share progress, engage with community',
      targetAudience: 'Fitness enthusiasts, College students, Young professionals',
      tiers: [
        {
          id: 'tier1',
          name: 'Tier 1 - $100-$250',
          price: '$100-$250',
          description: 'Low-effort, single-platform post',
          scope: 'Low-effort, single-platform post',
          examples: [
            '1 Instagram feed post (single image or simple caption)',
            '1 Instagram Story with swipe-up link',
            '1 TikTok under 30 seconds',
            '1 static post on X (Twitter)'
          ],
          deliverables: 'Single platform post with brand integration',
          duration: '7 days'
        },
        {
          id: 'tier2',
          name: 'Tier 2 - $250-$500',
          price: '$250-$500',
          description: 'Multi-post package or higher-effort single deliverable',
          scope: 'Multi-post package or higher-effort single deliverable',
          examples: [
            '1 Instagram feed post + 1 Story',
            'TikTok with custom script or outfit',
            'Carousel post (3–5 images) highlighting product/event',
            'Short video (15–30 sec) on both TikTok & Instagram Reels'
          ],
          deliverables: 'Multi-post package or higher-effort content',
          duration: '14 days'
        },
        {
          id: 'tier3',
          name: 'Tier 3 - $500-$1,000',
          price: '$500-$1,000',
          description: 'Multi-platform content & custom engagement',
          scope: 'Multi-platform content & custom engagement',
          examples: [
            '1 TikTok + 1 Instagram Reel + 1 Story',
            'Behind-the-scenes vlog promoting brand',
            'Unboxing video with brand tags',
            'Athlete appears at a local event and posts about it before/during'
          ],
          deliverables: 'Multi-platform content with custom engagement',
          duration: '21 days'
        }
      ]
    }
  ];

  const handleProposeDeal = (deal, tier) => {
    setSelectedDeal(deal);
    setSelectedTier(tier);
    // Navigate to create proposal page
    setCurrentPage('create-proposal');
  };

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

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h1>NIL Opportunities</h1>
        <p>Discover deals from businesses looking for athletes like you</p>
      </div>

      <div className="deals-grid">
        {businessDeals.map((deal) => (
          <div key={deal.id} className="deal-card">
            <div className="business-info">
              <div className="business-logo">{deal.business.logo}</div>
              <div className="business-details">
                <h3>{deal.business.name}</h3>
                <span className="industry">{deal.business.industry}</span>
              </div>
            </div>

            <div className="deal-content">
              <h2>{deal.title}</h2>
              <p className="description">{deal.description}</p>
              
              <div className="deal-meta">
                <span className="category">{deal.category}</span>
                <span className="requirements">Requirements: {deal.requirements}</span>
                <span className="target-audience">Target: {deal.targetAudience}</span>
              </div>

              <div className="pricing-tiers">
                <h3>Pricing Tiers</h3>
                {deal.tiers.map((tier) => (
                  <div key={tier.id} className="tier-card">
                    <div className="tier-header">
                      <h4>{tier.name}</h4>
                      <span className="tier-price">{tier.price}</span>
                    </div>
                    
                    <div className="tier-details">
                      <p className="tier-description">{tier.description}</p>
                      
                      <div className="tier-scope">
                        <strong>Scope:</strong> {tier.scope}
                      </div>
                      
                      <div className="tier-examples">
                        <strong>Examples:</strong>
                        <ul>
                          {tier.examples.map((example, index) => (
                            <li key={index}>{example}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="tier-deliverables">
                        <strong>Deliverables:</strong> {tier.deliverables}
                      </div>
                      
                      <div className="tier-duration">
                        <strong>Duration:</strong> {tier.duration}
                      </div>
                    </div>
                    
                    <button 
                      className="propose-btn"
                      onClick={() => handleProposeDeal(deal, tier)}
                    >
                      Propose Deal - {tier.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="social-media-guide">
        <h2>Common Social Media Promotion Types in NIL</h2>
        <div className="types-grid">
          {socialMediaTypes.map((type, index) => (
            <div key={index} className="type-card">
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="back-to-dashboard">
        <button onClick={() => setCurrentPage('dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OffersPage; 