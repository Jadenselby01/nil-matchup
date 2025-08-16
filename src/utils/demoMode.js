// Demo mode configuration - allows app to work without backend

// Demo user data
export const demoUsers = {
  athlete: {
    id: 'demo-athlete-1',
    name: 'Michael Johnson',
    email: 'michael@demo.com',
    phone: '(555) 123-4567',
    type: 'athlete',
    sport: 'Football',
    university: 'University of North Carolina',
    image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=MJ',
    bio: 'Star quarterback with incredible passing accuracy and leadership skills.',
    age: 20,
    instagram: 'https://instagram.com/michaeljohnson',
    twitter: 'https://twitter.com/michaeljohnson',
    tiktok: 'https://tiktok.com/@michaeljohnson'
  },
  business: {
    id: 'demo-business-1',
    name: 'Carolina Sports Bar & Grill',
    email: 'info@carolinasportsbar.com',
    type: 'business',
    description: 'Local sports bar serving the best wings and burgers in Chapel Hill.',
    businessType: 'Restaurant',
    location: 'Chapel Hill, NC',
    image: 'https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB',
    partnershipType: 'Event Appearances',
    budgetRange: '$500 - $1,000',
    requirements: 'Looking for athletes to make appearances during game days.'
  }
};

// Additional demo athletes for business deals
export const demoAthletes = [
  {
    id: 'demo-athlete-2',
    name: 'Sarah Williams',
    sport: 'Basketball',
    university: 'University of North Carolina',
    image: 'https://via.placeholder.com/200x200/28a745/ffffff?text=SW',
    bio: 'Point guard with exceptional court vision and three-point shooting.',
    age: 19
  },
  {
    id: 'demo-athlete-3',
    name: 'David Chen',
    sport: 'Soccer',
    university: 'University of North Carolina',
    image: 'https://via.placeholder.com/200x200/dc3545/ffffff?text=DC',
    bio: 'Midfielder known for precise passing and strategic playmaking.',
    age: 21
  },
  {
    id: 'demo-athlete-4',
    name: 'Emily Rodriguez',
    sport: 'Volleyball',
    university: 'University of North Carolina',
    image: 'https://via.placeholder.com/200x200/ffc107/ffffff?text=ER',
    bio: 'Outside hitter with powerful spikes and excellent team coordination.',
    age: 20
  }
];

// Demo deals data
export const demoDeals = [
  {
    id: 'deal-1',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-1',
    athleteName: 'Michael Johnson',
    businessName: 'Carolina Sports Bar & Grill',
    title: 'Instagram Story Promotion',
    deliverables: '1x Instagram Story tagging @carolinasportsbar within 7 days',
    paymentAmount: 150,
    status: 'agreed',
    paymentIntentId: 'pi_demo_123',
    dealDate: '2024-01-15',
    deadline: '2024-01-22',
    postUrl: '',
    isPaymentSecured: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'deal-2',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-2',
    athleteName: 'Michael Johnson',
    businessName: 'Elite Fitness Center',
    title: 'TikTok Workout Video',
    deliverables: '1x TikTok video featuring our gym equipment with #EliteFitness',
    paymentAmount: 300,
    status: 'applied',
    paymentIntentId: '',
    dealDate: '',
    deadline: '',
    postUrl: '',
    isPaymentSecured: false,
    createdAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 'deal-3',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-3',
    athleteName: 'Michael Johnson',
    businessName: 'University Auto Service',
    title: 'Facebook Post',
    deliverables: '1x Facebook post about our student discount with photo',
    paymentAmount: 200,
    status: 'post_uploaded',
    paymentIntentId: 'pi_demo_456',
    dealDate: '2024-01-10',
    deadline: '2024-01-17',
    postUrl: 'https://facebook.com/post/123',
    isPaymentSecured: true,
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: 'deal-4',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-4',
    athleteName: 'Michael Johnson',
    businessName: 'Chapel Hill Pizza Co.',
    title: 'YouTube Review Video',
    deliverables: '1x YouTube video reviewing our new pizza menu items',
    paymentAmount: 500,
    status: 'verified',
    paymentIntentId: 'pi_demo_789',
    dealDate: '2024-01-08',
    deadline: '2024-01-15',
    postUrl: 'https://youtube.com/watch?v=demo123',
    isPaymentSecured: true,
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: 'deal-5',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-5',
    athleteName: 'Michael Johnson',
    businessName: 'UNC Bookstore',
    title: 'Twitter Thread Promotion',
    deliverables: '3x Twitter posts about back-to-school deals and student discounts',
    paymentAmount: 250,
    status: 'paid',
    paymentIntentId: 'pi_demo_101',
    dealDate: '2024-01-05',
    deadline: '2024-01-12',
    postUrl: 'https://twitter.com/michaeljohnson/status/123456789',
    isPaymentSecured: true,
    createdAt: '2024-01-05T11:20:00Z'
  },
  {
    id: 'deal-6',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-6',
    athleteName: 'Michael Johnson',
    businessName: 'Durham Coffee Roasters',
    title: 'Instagram Post & Story',
    deliverables: '1x Instagram post + 1x Instagram story about our new seasonal blend',
    paymentAmount: 180,
    status: 'applied',
    paymentIntentId: '',
    dealDate: '',
    deadline: '',
    postUrl: '',
    isPaymentSecured: false,
    createdAt: '2024-01-13T13:10:00Z'
  },
  {
    id: 'deal-7',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-7',
    athleteName: 'Michael Johnson',
    businessName: 'Raleigh Sports Equipment',
    title: 'Product Review Video',
    deliverables: '1x YouTube video reviewing our new football cleats',
    paymentAmount: 400,
    status: 'paid',
    paymentIntentId: 'pi_demo_202',
    dealDate: '2024-01-03',
    deadline: '2024-01-10',
    postUrl: 'https://youtube.com/watch?v=cleats123',
    isPaymentSecured: true,
    createdAt: '2024-01-03T08:30:00Z'
  },
  {
    id: 'deal-8',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-8',
    athleteName: 'Michael Johnson',
    businessName: 'Chapel Hill Nutrition',
    title: 'Instagram Reel',
    deliverables: '1x Instagram Reel showcasing our protein shakes',
    paymentAmount: 275,
    status: 'paid',
    paymentIntentId: 'pi_demo_303',
    dealDate: '2023-12-28',
    deadline: '2024-01-04',
    postUrl: 'https://instagram.com/reel/nutrition123',
    isPaymentSecured: true,
    createdAt: '2023-12-28T15:45:00Z'
  },
  {
    id: 'deal-9',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-9',
    athleteName: 'Michael Johnson',
    businessName: 'Durham Tech Solutions',
    title: 'LinkedIn Post',
    deliverables: '1x LinkedIn post about our student software discounts',
    paymentAmount: 120,
    status: 'paid',
    paymentIntentId: 'pi_demo_404',
    dealDate: '2023-12-20',
    deadline: '2023-12-27',
    postUrl: 'https://linkedin.com/posts/tech123',
    isPaymentSecured: true,
    createdAt: '2023-12-20T12:15:00Z'
  },
  {
    id: 'deal-10',
    athleteId: 'demo-athlete-1',
    businessId: 'demo-business-10',
    athleteName: 'Michael Johnson',
    businessName: 'UNC Campus Housing',
    title: 'TikTok Campus Tour',
    deliverables: '1x TikTok video giving a tour of our new student housing',
    paymentAmount: 350,
    status: 'paid',
    paymentIntentId: 'pi_demo_505',
    dealDate: '2023-12-15',
    deadline: '2023-12-22',
    postUrl: 'https://tiktok.com/@michaeljohnson/video/housing123',
    isPaymentSecured: true,
    createdAt: '2023-12-15T10:20:00Z'
  },
  // Business perspective deals (Carolina Sports Bar & Grill as business)
  {
    id: 'deal-11',
    athleteId: 'demo-athlete-2',
    businessId: 'demo-business-1',
    athleteName: 'Sarah Williams',
    businessName: 'Carolina Sports Bar & Grill',
    title: 'Instagram Story Game Day',
    deliverables: '1x Instagram Story during game day with our special menu',
    paymentAmount: 200,
    status: 'paid',
    paymentIntentId: 'pi_demo_606',
    dealDate: '2024-01-12',
    deadline: '2024-01-19',
    postUrl: 'https://instagram.com/stories/sarahwilliams/gameday123',
    isPaymentSecured: true,
    createdAt: '2024-01-12T18:30:00Z'
  },
  {
    id: 'deal-12',
    athleteId: 'demo-athlete-3',
    businessId: 'demo-business-1',
    athleteName: 'David Chen',
    businessName: 'Carolina Sports Bar & Grill',
    title: 'Facebook Post Promotion',
    deliverables: '1x Facebook post about our weekend specials',
    paymentAmount: 175,
    status: 'verified',
    paymentIntentId: 'pi_demo_707',
    dealDate: '2024-01-10',
    deadline: '2024-01-17',
    postUrl: 'https://facebook.com/davidchen/posts/weekend123',
    isPaymentSecured: true,
    createdAt: '2024-01-10T14:20:00Z'
  },
  {
    id: 'deal-13',
    athleteId: 'demo-athlete-4',
    businessId: 'demo-business-1',
    athleteName: 'Emily Rodriguez',
    businessName: 'Carolina Sports Bar & Grill',
    title: 'TikTok Dance Challenge',
    deliverables: '1x TikTok video doing our signature dance with our logo',
    paymentAmount: 300,
    status: 'post_uploaded',
    paymentIntentId: 'pi_demo_808',
    dealDate: '2024-01-08',
    deadline: '2024-01-15',
    postUrl: 'https://tiktok.com/@emilyrodriguez/video/dance123',
    isPaymentSecured: true,
    createdAt: '2024-01-08T11:45:00Z'
  }
];

// Demo businesses for deals
export const demoBusinessesForDeals = [
  {
    id: 'demo-business-2',
    name: 'Elite Fitness Center',
    type: 'Fitness & Wellness',
    location: 'Durham, NC',
    image: 'https://via.placeholder.com/200x200/28a745/ffffff?text=EFC',
    description: 'Premium fitness facility offering personal training and group classes.',
    partnershipType: 'Content Creation',
    budgetRange: '$200 - $500'
  },
  {
    id: 'demo-business-3',
    name: 'University Auto Service',
    type: 'Automotive',
    location: 'Raleigh, NC',
    image: 'https://via.placeholder.com/200x200/dc3545/ffffff?text=UAS',
    description: 'Trusted automotive service center providing maintenance and repairs.',
    partnershipType: 'Social Media Promotion',
    budgetRange: '$100 - $300'
  },
  {
    id: 'demo-business-4',
    name: 'Chapel Hill Pizza Co.',
    type: 'Restaurant',
    location: 'Chapel Hill, NC',
    image: 'https://via.placeholder.com/200x200/ff6b6b/ffffff?text=CHP',
    description: 'Local pizza restaurant serving authentic Italian-style pizzas.',
    partnershipType: 'Content Creation',
    budgetRange: '$400 - $600'
  },
  {
    id: 'demo-business-5',
    name: 'UNC Bookstore',
    type: 'Retail',
    location: 'Chapel Hill, NC',
    image: 'https://via.placeholder.com/200x200/17a2b8/ffffff?text=UNB',
    description: 'Official university bookstore offering textbooks, apparel, and school supplies.',
    partnershipType: 'Social Media Promotion',
    budgetRange: '$200 - $400'
  },
  {
    id: 'demo-business-6',
    name: 'Durham Coffee Roasters',
    type: 'Restaurant',
    location: 'Durham, NC',
    image: 'https://via.placeholder.com/200x200/6f42c1/ffffff?text=DCR',
    description: 'Artisan coffee roastery serving specialty coffee and pastries.',
    partnershipType: 'Social Media Promotion',
    budgetRange: '$150 - $250'
  },
  {
    id: 'demo-business-7',
    name: 'Raleigh Sports Equipment',
    type: 'Retail',
    location: 'Raleigh, NC',
    image: 'https://via.placeholder.com/200x200/20c997/ffffff?text=RSE',
    description: 'Premium sports equipment store offering gear for all athletes.',
    partnershipType: 'Product Reviews',
    budgetRange: '$300 - $500'
  },
  {
    id: 'demo-business-8',
    name: 'Chapel Hill Nutrition',
    type: 'Health & Wellness',
    location: 'Chapel Hill, NC',
    image: 'https://via.placeholder.com/200x200/fd7e14/ffffff?text=CHN',
    description: 'Nutrition supplement store specializing in athlete performance products.',
    partnershipType: 'Content Creation',
    budgetRange: '$200 - $400'
  },
  {
    id: 'demo-business-9',
    name: 'Durham Tech Solutions',
    type: 'Technology',
    location: 'Durham, NC',
    image: 'https://via.placeholder.com/200x200/6c757d/ffffff?text=DTS',
    description: 'Software solutions company offering student discounts on development tools.',
    partnershipType: 'Professional Networking',
    budgetRange: '$100 - $200'
  },
  {
    id: 'demo-business-10',
    name: 'UNC Campus Housing',
    type: 'Real Estate',
    location: 'Chapel Hill, NC',
    image: 'https://via.placeholder.com/200x200/e83e8c/ffffff?text=UCH',
    description: 'University-affiliated housing options for students and athletes.',
    partnershipType: 'Content Creation',
    budgetRange: '$300 - $500'
  }
];

// Demo authentication functions
export const demoAuth = {
  signIn: async (email, password, userType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      return {
        data: { user: demoUsers[userType] },
        error: null
      };
    } else {
      return {
        data: null,
        error: { message: 'Invalid credentials' }
      };
    }
  },

  signUp: async (email, password, userData, userType) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      return {
        data: { user: { ...demoUsers[userType], ...userData } },
        error: null
      };
    } else {
      return {
        data: null,
        error: { message: 'Registration failed' }
      };
    }
  },

  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { error: null };
  }
};

// Demo deals functions
export const demoDealsAPI = {
  // Get deals for a user (athlete or business)
  getDeals: async (userId, userType) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (userType === 'athlete') {
      return demoDeals.filter(deal => deal.athleteId === userId);
    } else {
      return demoDeals.filter(deal => deal.businessId === userId);
    }
  },

  // Apply to a deal (athlete)
  applyToDeal: async (athleteId, businessId, dealData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate proper UUID for deal ID
    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      // Fallback UUID generation
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
    
    const newDeal = {
      id: generateUUID(), // Use proper UUID instead of custom string
      athleteId,
      businessId,
      athleteName: demoUsers.athlete.name,
      businessName: demoBusinessesForDeals.find(b => b.id === businessId)?.name || 'Unknown Business',
      title: dealData.title,
      deliverables: dealData.deliverables,
      paymentAmount: dealData.paymentAmount,
      status: 'applied',
      paymentIntentId: '',
      dealDate: '',
      deadline: '',
      postUrl: '',
      isPaymentSecured: false,
      createdAt: new Date().toISOString()
    };
    
    demoDeals.push(newDeal);
    return { data: newDeal, error: null };
  },

  // Accept a deal (business)
  acceptDeal: async (dealId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const deal = demoDeals.find(d => d.id === dealId);
    if (deal) {
      deal.status = 'agreed';
      deal.dealDate = new Date().toISOString().split('T')[0];
      deal.deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      deal.paymentIntentId = `pi_demo_${Date.now()}`;
      deal.isPaymentSecured = true;
    }
    
    return { data: deal, error: null };
  },

  // Upload post completion (athlete)
  uploadPost: async (dealId, postUrl) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const deal = demoDeals.find(d => d.id === dealId);
    if (deal) {
      deal.status = 'post_uploaded';
      deal.postUrl = postUrl;
    }
    
    return { data: deal, error: null };
  },

  // Verify post and release payment (business)
  verifyPost: async (dealId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const deal = demoDeals.find(d => d.id === dealId);
    if (deal) {
      deal.status = 'verified';
    }
    
    return { data: deal, error: null };
  },

  // Release payment (admin/automation)
  releasePayment: async (dealId) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const deal = demoDeals.find(d => d.id === dealId);
    if (deal) {
      deal.status = 'paid';
    }
    
    return { data: deal, error: null };
  },

  // Get payment history
  getPaymentHistory: async (userId, userType) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paidDeals = demoDeals.filter(deal => deal.status === 'paid');
    
    return paidDeals.map(deal => ({
      id: `payment-${deal.id}`,
      description: deal.title,
      amount: deal.paymentAmount,
      date: deal.dealDate || deal.createdAt.split('T')[0],
      from: userType === 'athlete' ? deal.businessName : deal.athleteName,
      to: userType === 'athlete' ? deal.athleteName : deal.businessName,
      status: 'completed',
      transactionId: deal.paymentIntentId,
      platform: getPlatformFromDeal(deal.title),
      category: getCategoryFromBusiness(deal.businessName)
    }));
  }
};

// Helper functions for payment history
const getPlatformFromDeal = (title) => {
  if (title.toLowerCase().includes('instagram')) return 'Instagram';
  if (title.toLowerCase().includes('tiktok')) return 'TikTok';
  if (title.toLowerCase().includes('youtube')) return 'YouTube';
  if (title.toLowerCase().includes('facebook')) return 'Facebook';
  if (title.toLowerCase().includes('twitter')) return 'Twitter';
  if (title.toLowerCase().includes('linkedin')) return 'LinkedIn';
  return 'Social Media';
};

const getCategoryFromBusiness = (businessName) => {
  if (businessName.toLowerCase().includes('sports')) return 'Sports & Fitness';
  if (businessName.toLowerCase().includes('food') || businessName.toLowerCase().includes('pizza') || businessName.toLowerCase().includes('coffee')) return 'Food & Beverage';
  if (businessName.toLowerCase().includes('tech') || businessName.toLowerCase().includes('software')) return 'Technology';
  if (businessName.toLowerCase().includes('auto') || businessName.toLowerCase().includes('equipment')) return 'Retail';
  if (businessName.toLowerCase().includes('bookstore') || businessName.toLowerCase().includes('housing')) return 'Education';
  if (businessName.toLowerCase().includes('nutrition')) return 'Health & Wellness';
  return 'Other';
};

// Demo data storage
export const demoStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(`demo_${key}`);
    } catch {
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      localStorage.setItem(`demo_${key}`, JSON.stringify(value));
    } catch {
      // Ignore storage errors in demo mode
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors in demo mode
    }
  }
}; 