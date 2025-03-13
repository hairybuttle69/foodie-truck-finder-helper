
import { toast } from "@/components/ui/use-toast";

// Badge definitions
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'order' | 'review';
  criteria: {
    type: 'count' | 'timeframe';
    value: number;
    period?: 'day' | 'week' | 'month' | 'year';
  };
}

// Available badges in the system
export const BADGES: Badge[] = [
  {
    id: 'first-order',
    name: 'First Order',
    description: 'Placed your first order',
    icon: 'award',
    category: 'order',
    criteria: { type: 'count', value: 1 }
  },
  {
    id: 'five-orders',
    name: 'Regular Customer',
    description: 'Placed 5 orders',
    icon: 'badge',
    category: 'order',
    criteria: { type: 'count', value: 5 }
  },
  {
    id: 'five-orders-month',
    name: 'Loyal Foodie',
    description: 'Placed 5 orders in a month',
    icon: 'badge-check',
    category: 'order',
    criteria: { type: 'timeframe', value: 5, period: 'month' }
  },
  {
    id: 'first-review',
    name: 'First Review',
    description: 'Wrote your first review',
    icon: 'star',
    category: 'review',
    criteria: { type: 'count', value: 1 }
  },
  {
    id: 'five-reviews',
    name: 'Critique Expert',
    description: 'Wrote 5 reviews',
    icon: 'trophy',
    category: 'review',
    criteria: { type: 'count', value: 5 }
  }
];

// User badges storage structure
export interface UserBadgeData {
  userId: string;
  badges: {
    [badgeId: string]: {
      earnedAt: string;
      displayed: boolean;
    }
  };
  stats: {
    orderCount: number;
    reviewCount: number;
    ordersByMonth: { [yearMonth: string]: number };
    reviewsByMonth: { [yearMonth: string]: number };
  };
}

// Helper function to get the current year-month key
const getCurrentYearMonth = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}`;
};

// Initialize user badge data
export const initUserBadgeData = (userId: string): UserBadgeData => {
  return {
    userId,
    badges: {},
    stats: {
      orderCount: 0,
      reviewCount: 0,
      ordersByMonth: {},
      reviewsByMonth: {}
    }
  };
};

// Get user badges from local storage
export const getUserBadges = (userId: string): UserBadgeData => {
  const storedData = localStorage.getItem(`user_badges_${userId}`);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return initUserBadgeData(userId);
};

// Save user badges to local storage
export const saveUserBadges = (badgeData: UserBadgeData): void => {
  localStorage.setItem(`user_badges_${badgeData.userId}`, JSON.stringify(badgeData));
};

// Track a new order
export const trackOrder = (userId: string): Badge[] => {
  const userData = getUserBadges(userId);
  const yearMonth = getCurrentYearMonth();
  
  // Update stats
  userData.stats.orderCount += 1;
  userData.stats.ordersByMonth[yearMonth] = (userData.stats.ordersByMonth[yearMonth] || 0) + 1;
  
  // Check for badges that can be earned
  const newBadges = checkForNewBadges(userData);
  
  // Save updated data
  saveUserBadges(userData);
  
  return newBadges;
};

// Track a new review
export const trackReview = (userId: string): Badge[] => {
  const userData = getUserBadges(userId);
  const yearMonth = getCurrentYearMonth();
  
  // Update stats
  userData.stats.reviewCount += 1;
  userData.stats.reviewsByMonth[yearMonth] = (userData.stats.reviewsByMonth[yearMonth] || 0) + 1;
  
  // Check for badges that can be earned
  const newBadges = checkForNewBadges(userData);
  
  // Save updated data
  saveUserBadges(userData);
  
  return newBadges;
};

// Check if any new badges have been earned
const checkForNewBadges = (userData: UserBadgeData): Badge[] => {
  const newlyEarnedBadges: Badge[] = [];
  
  BADGES.forEach(badge => {
    // Skip if already earned
    if (userData.badges[badge.id]) {
      return;
    }
    
    let isEarned = false;
    
    if (badge.criteria.type === 'count') {
      // Check count-based criteria
      if (badge.category === 'order' && userData.stats.orderCount >= badge.criteria.value) {
        isEarned = true;
      } else if (badge.category === 'review' && userData.stats.reviewCount >= badge.criteria.value) {
        isEarned = true;
      }
    } else if (badge.criteria.type === 'timeframe' && badge.criteria.period) {
      // Check timeframe-based criteria
      const yearMonth = getCurrentYearMonth();
      
      if (badge.category === 'order' && 
          (userData.stats.ordersByMonth[yearMonth] || 0) >= badge.criteria.value) {
        isEarned = true;
      } else if (badge.category === 'review' && 
                (userData.stats.reviewsByMonth[yearMonth] || 0) >= badge.criteria.value) {
        isEarned = true;
      }
    }
    
    if (isEarned) {
      // Award the badge
      userData.badges[badge.id] = {
        earnedAt: new Date().toISOString(),
        displayed: false
      };
      newlyEarnedBadges.push(badge);
    }
  });
  
  return newlyEarnedBadges;
};

// Mark a badge as displayed (to avoid showing notifications repeatedly)
export const markBadgeAsDisplayed = (userId: string, badgeId: string): void => {
  const userData = getUserBadges(userId);
  if (userData.badges[badgeId]) {
    userData.badges[badgeId].displayed = true;
    saveUserBadges(userData);
  }
};

// Notify the user about new badges
export const notifyNewBadges = (badges: Badge[]): void => {
  badges.forEach(badge => {
    toast({
      title: `🎖️ New Badge Earned: ${badge.name}`,
      description: badge.description,
      duration: 5000
    });
  });
};

// Get all earned badges for a user
export const getEarnedBadges = (userId: string): Badge[] => {
  const userData = getUserBadges(userId);
  return BADGES.filter(badge => userData.badges[badge.id]);
};
