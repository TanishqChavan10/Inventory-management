// Redis key prefixes and patterns
export const REDIS_KEYS = {
  // User-related keys
  USER: 'user:',
  USER_SESSION: 'user:session:',

  // Inventory-related keys
  PRODUCT: 'product:',
  CATEGORY: 'category:',
  INVENTORY_STATS: 'inventory:stats',

  // Cache TTL values (in seconds)
  TTL: {
    USER_SESSION: 3600, // 1 hour
    PRODUCT: 1800, // 30 minutes
    INVENTORY_STATS: 300, // 5 minutes
  },

  // Patterns for key matching
  PATTERNS: {
    ALL_USERS: 'user:*',
    ALL_PRODUCTS: 'product:*',
    ALL_SESSIONS: 'user:session:*',
  },
} as const;