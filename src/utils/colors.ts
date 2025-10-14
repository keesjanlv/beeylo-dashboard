// Comprehensive Color Palette for Dashboard
// Replacing red accent with amber and providing better color variation

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#fef7ee',
    100: '#fdecd3',
    200: '#fbd5a5',
    300: '#f7b76d',
    400: '#f59332',
    500: '#f3770a', // Main amber accent (replaces red)
    600: '#e45e07',
    700: '#bd4708',
    800: '#973a0e',
    900: '#7c300f',
  },

  // Status Colors
  status: {
    success: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
      hover: 'hover:bg-emerald-200',
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      hover: 'hover:bg-yellow-200',
    },
    danger: {
      bg: 'bg-amber-100', // Changed from red to amber
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      hover: 'hover:bg-amber-200',
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      hover: 'hover:bg-blue-200',
    },
  },

  // Priority Colors
  priority: {
    low: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: 'text-slate-500',
    },
    medium: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'text-blue-500',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: 'text-orange-500',
    },
    urgent: {
      bg: 'bg-amber-100', // Changed from red to amber
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: 'text-amber-600',
    },
  },

  // Chat Status Colors
  chatStatus: {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
    },
    resolved: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
    },
    escalated: {
      bg: 'bg-amber-100', // Changed from red to amber
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: 'text-amber-600',
    },
  },

  // User Status Colors
  userStatus: {
    online: {
      bg: 'bg-green-500',
      text: 'text-white',
      border: 'border-green-500',
    },
    busy: {
      bg: 'bg-amber-500', // Changed from red to amber
      text: 'text-white',
      border: 'border-amber-500',
    },
    away: {
      bg: 'bg-yellow-500',
      text: 'text-white',
      border: 'border-yellow-500',
    },
    offline: {
      bg: 'bg-gray-400',
      text: 'text-white',
      border: 'border-gray-400',
    },
  },

  // Sentiment Colors
  sentiment: {
    positive: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600',
    },
    neutral: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: 'text-gray-600',
    },
    negative: {
      bg: 'bg-amber-100', // Changed from red to amber
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: 'text-amber-600',
    },
    frustrated: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: 'text-orange-600',
    },
    satisfied: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: 'text-emerald-600',
    },
  },

  // Category Colors (for better visual distinction)
  categories: {
    'Product Inquiries': {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      chart: '#3b82f6', // blue-500
    },
    'Returns & Exchanges': {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      chart: '#f59e0b', // amber-500
    },
    'Technical Support': {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
      chart: '#8b5cf6', // purple-500
    },
    'Sizing Help': {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      chart: '#10b981', // emerald-500
    },
    'Order Status': {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      chart: '#6366f1', // indigo-500
    },
    'Warranty Claims': {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      chart: '#f97316', // orange-500
    },
    'Billing Issues': {
      bg: 'bg-rose-100',
      text: 'text-rose-800',
      border: 'border-rose-200',
      chart: '#f43f5e', // rose-500
    },
  },

  // Integration Status Colors
  integration: {
    connected: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: 'text-green-600',
    },
    disconnected: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
      icon: 'text-gray-600',
    },
  },
};

// Helper functions for getting colors
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return colors.chatStatus.active;
    case 'pending': return colors.chatStatus.pending;
    case 'resolved': return colors.chatStatus.resolved;
    case 'escalated': return colors.chatStatus.escalated;
    case 'new': return colors.status.success;
    default: return colors.status.info;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low': return colors.priority.low;
    case 'medium': return colors.priority.medium;
    case 'high': return colors.priority.high;
    case 'urgent': return colors.priority.urgent;
    default: return colors.priority.medium;
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return colors.sentiment.positive;
    case 'neutral': return colors.sentiment.neutral;
    case 'negative': return colors.sentiment.negative;
    case 'frustrated': return colors.sentiment.frustrated;
    case 'satisfied': return colors.sentiment.satisfied;
    default: return colors.sentiment.neutral;
  }
};

export const getCategoryColor = (category: string) => {
  return colors.categories[category as keyof typeof colors.categories] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    chart: '#6b7280', // gray-500
  };
};

export const getUserStatusColor = (status: string) => {
  switch (status) {
    case 'online': return colors.userStatus.online;
    case 'busy': return colors.userStatus.busy;
    case 'away': return colors.userStatus.away;
    case 'offline': return colors.userStatus.offline;
    default: return colors.userStatus.offline;
  }
};

export const getIntegrationStatusColor = (status: string) => {
  switch (status) {
    case 'connected': return colors.integration.connected;
    case 'disconnected': return colors.integration.disconnected;
    default: return colors.integration.disconnected;
  }
};

// Chart colors for analytics
export const chartColors = [
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#8b5cf6', // purple-500
  '#10b981', // emerald-500
  '#6366f1', // indigo-500
  '#f97316', // orange-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#ec4899', // pink-500
];

export const getCategoryChartColor = (category: string, index: number) => {
  const categoryColor = colors.categories[category as keyof typeof colors.categories];
  return categoryColor?.chart || chartColors[index % chartColors.length];
};