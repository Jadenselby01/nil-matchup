import { db } from '../config/supabase';

class SearchService {
  constructor() {
    this.searchCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Search athletes with advanced filters
  async searchAthletes(filters = {}) {
    try {
      const cacheKey = `athletes_${JSON.stringify(filters)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      let query = db.supabase
        .from('athletes')
        .select(`
          *,
          users!inner(email, user_type, is_verified, profile_completed)
        `)
        .eq('users.is_verified', true)
        .eq('users.profile_completed', true);

      // Apply filters
      if (filters.sport) {
        query = query.eq('sport', filters.sport);
      }

      if (filters.university) {
        query = query.ilike('university', `%${filters.university}%`);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.minAge) {
        query = query.gte('age', filters.minAge);
      }

      if (filters.maxAge) {
        query = query.lte('age', filters.maxAge);
      }

      if (filters.academicYear) {
        query = query.eq('academic_year', filters.academicYear);
      }

      if (filters.teamPosition) {
        query = query.eq('team_position', filters.teamPosition);
      }

      if (filters.minGPA) {
        query = query.gte('gpa', filters.minGPA);
      }

      if (filters.maxGPA) {
        query = query.lte('gpa', filters.maxGPA);
      }

      if (filters.interests && filters.interests.length > 0) {
        query = query.overlaps('interests', filters.interests);
      }

      if (filters.achievements && filters.achievements.length > 0) {
        query = query.overlaps('achievements', filters.achievements);
      }

      // Text search
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,bio.ilike.%${filters.searchTerm}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      const result = { data, error: null };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching athletes:', error);
      return { data: null, error };
    }
  }

  // Search businesses with advanced filters
  async searchBusinesses(filters = {}) {
    try {
      const cacheKey = `businesses_${JSON.stringify(filters)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      let query = db.supabase
        .from('businesses')
        .select(`
          *,
          users!inner(email, user_type, is_verified, profile_completed)
        `)
        .eq('users.is_verified', true)
        .eq('users.profile_completed', true);

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.industry) {
        query = query.eq('industry', filters.industry);
      }

      if (filters.companySize) {
        query = query.eq('company_size', filters.companySize);
      }

      if (filters.partnershipType) {
        query = query.eq('partnership_type', filters.partnershipType);
      }

      if (filters.budgetRange) {
        query = query.eq('budget_range', filters.budgetRange);
      }

      if (filters.minFoundedYear) {
        query = query.gte('founded_year', filters.minFoundedYear);
      }

      if (filters.maxFoundedYear) {
        query = query.lte('founded_year', filters.maxFoundedYear);
      }

      // Text search
      if (filters.searchTerm) {
        query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'name';
      const sortOrder = filters.sortOrder || 'asc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 20;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      const result = { data, error: null };
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching businesses:', error);
      return { data: null, error };
    }
  }

  // Get search suggestions
  async getSearchSuggestions(type, query) {
    try {
      if (type === 'athletes') {
        const { data, error } = await db.supabase
          .from('athletes')
          .select('name, sport, university')
          .or(`name.ilike.%${query}%,sport.ilike.%${query}%,university.ilike.%${query}%`)
          .limit(10);

        if (error) throw error;

        return { data, error: null };
      } else if (type === 'businesses') {
        const { data, error } = await db.supabase
          .from('businesses')
          .select('name, type, industry')
          .or(`name.ilike.%${query}%,type.ilike.%${query}%,industry.ilike.%${query}%`)
          .limit(10);

        if (error) throw error;

        return { data, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return { data: [], error };
    }
  }

  // Get popular searches
  async getPopularSearches() {
    try {
      // This would typically come from analytics data
      // For now, return static popular searches
      const popularSearches = {
        athletes: [
          { term: 'Football', count: 150 },
          { term: 'Basketball', count: 120 },
          { term: 'Soccer', count: 80 },
          { term: 'UNC', count: 60 },
          { term: 'Duke', count: 55 }
        ],
        businesses: [
          { term: 'Restaurant', count: 45 },
          { term: 'Fitness', count: 35 },
          { term: 'Technology', count: 30 },
          { term: 'Chapel Hill', count: 25 },
          { term: 'Durham', count: 20 }
        ]
      };

      return { data: popularSearches, error: null };
    } catch (error) {
      console.error('Error getting popular searches:', error);
      return { data: null, error };
    }
  }

  // Get filter options
  async getFilterOptions() {
    try {
      const filterOptions = {
        sports: [
          'Football', 'Basketball', 'Soccer', 'Baseball', 'Tennis',
          'Swimming', 'Track & Field', 'Volleyball', 'Lacrosse',
          'Golf', 'Wrestling', 'Gymnastics', 'Hockey', 'Rowing'
        ],
        universities: [
          'University of North Carolina', 'Duke University', 'NC State University',
          'Wake Forest University', 'University of Virginia', 'Virginia Tech',
          'Clemson University', 'Georgia Tech', 'Florida State University'
        ],
        businessTypes: [
          'Restaurant', 'Fitness & Wellness', 'Technology', 'Retail',
          'Healthcare', 'Education', 'Entertainment', 'Sports Equipment',
          'Fashion', 'Automotive', 'Real Estate', 'Financial Services'
        ],
        industries: [
          'Food & Beverage', 'Health & Fitness', 'Technology', 'Retail',
          'Healthcare', 'Education', 'Entertainment', 'Sports',
          'Fashion', 'Automotive', 'Real Estate', 'Finance'
        ],
        companySizes: [
          'Startup (1-10 employees)', 'Small (11-50 employees)',
          'Medium (51-200 employees)', 'Large (201-1000 employees)',
          'Enterprise (1000+ employees)'
        ],
        partnershipTypes: [
          'Brand Ambassador', 'Event Appearances', 'Social Media Posts',
          'Product Endorsements', 'Speaking Engagements', 'Photo Shoots',
          'Video Content', 'Merchandise', 'Charity Events'
        ],
        budgetRanges: [
          '$100 - $500', '$500 - $1,000', '$1,000 - $5,000',
          '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'
        ],
        academicYears: [
          'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student'
        ],
        teamPositions: [
          'Quarterback', 'Running Back', 'Wide Receiver', 'Defensive Back',
          'Point Guard', 'Shooting Guard', 'Forward', 'Center',
          'Midfielder', 'Forward', 'Defender', 'Goalkeeper'
        ]
      };

      return { data: filterOptions, error: null };
    } catch (error) {
      console.error('Error getting filter options:', error);
      return { data: null, error };
    }
  }

  // Get recommended matches for a user
  async getRecommendedMatches(userId, userType) {
    try {
      if (userType === 'business') {
        // Get business profile
        const { data: business } = await db.getBusinesses({ userId });
        if (!business) return { data: [], error: null };

        // Get recommended athletes based on business criteria
        const filters = {
          sport: business.sport_preference,
          location: business.location,
          minAge: business.min_age_preference,
          maxAge: business.max_age_preference
        };

        return await this.searchAthletes(filters);
      } else if (userType === 'athlete') {
        // Get athlete profile
        const { data: athlete } = await db.getAthletes({ userId });
        if (!athlete) return { data: [], error: null };

        // Get recommended businesses based on athlete criteria
        const filters = {
          type: athlete.preferred_business_types,
          location: athlete.location,
          budgetRange: athlete.preferred_budget_range
        };

        return await this.searchBusinesses(filters);
      }

      return { data: [], error: null };
    } catch (error) {
      console.error('Error getting recommended matches:', error);
      return { data: [], error };
    }
  }

  // Cache management
  getFromCache(key) {
    const cached = this.searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.searchCache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.searchCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.searchCache.clear();
  }

  // Get search analytics
  async getSearchAnalytics() {
    try {
      // This would typically come from analytics data
      const analytics = {
        totalSearches: 1250,
        popularFilters: {
          sport: 'Football',
          location: 'Chapel Hill',
          businessType: 'Restaurant'
        },
        conversionRate: 0.15,
        averageSearchTime: 45
      };

      return { data: analytics, error: null };
    } catch (error) {
      console.error('Error getting search analytics:', error);
      return { data: null, error };
    }
  }
}

export default new SearchService(); 