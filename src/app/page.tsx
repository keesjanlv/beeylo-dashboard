'use client';

import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayCircleIcon,
  PaperAirplaneIcon,
  UserPlusIcon,
  SparklesIcon,
  FireIcon,
  HeartIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  ArrowRightIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChats } from '@/hooks/useChats';



// Function to generate stats - will be called inside component to use real data
const generateStats = (activeCount: number, totalCustomers: number, avgResponseTime: string, satisfactionScore: number) => [
  {
    name: 'Active Conversations',
    value: activeCount.toString(),
    change: '+12%',
    changeType: 'increase',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Total Customers',
    value: totalCustomers.toString(),
    change: '+8%',
    changeType: 'increase',
    icon: UsersIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Avg Response Time',
    value: avgResponseTime,
    change: '-15%',
    changeType: 'decrease',
    icon: ClockIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Customer Satisfaction',
    value: `${satisfactionScore}%`,
    change: '+5%',
    changeType: 'increase',
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
];



const urgentChats = [
  {
    id: 1,
    customer: 'Emily Davis',
    subject: 'Return request for tennis racket',
    status: 'pending',
    priority: 'high',
    lastMessage: '15 minutes ago',
    agent: 'Mike Chen',
    preview: 'Hi, I need to return this tennis racket as it arrived damaged...'
  },
  {
    id: 2,
    customer: 'Robert Wilson',
    subject: 'Order cancellation urgent',
    status: 'open',
    priority: 'high',
    lastMessage: '8 minutes ago',
    agent: 'Sarah Johnson',
    preview: 'Please cancel my order #12345 immediately, I need to...'
  },
  {
    id: 3,
    customer: 'Lisa Thompson',
    subject: 'Defective running shoes',
    status: 'open',
    priority: 'high',
    lastMessage: '22 minutes ago',
    agent: 'Emily Rodriguez',
    preview: 'The shoes I received have a manufacturing defect...'
  }
];

const lessUrgentChats = [
  {
    id: 4,
    customer: 'John Smith',
    subject: 'Nike Air Max sizing question',
    status: 'open',
    priority: 'medium',
    lastMessage: '2 minutes ago',
    agent: 'Sarah Johnson',
    preview: 'I\'m wondering about the sizing for Nike Air Max...'
  },
  {
    id: 5,
    customer: 'Michael Brown',
    subject: 'Garmin watch sync issues',
    status: 'open',
    priority: 'medium',
    lastMessage: '1 hour ago',
    agent: 'Emily Rodriguez',
    preview: 'Having trouble syncing my Garmin watch with the app...'
  },
  {
    id: 6,
    customer: 'Anna Garcia',
    subject: 'Product recommendation',
    status: 'open',
    priority: 'low',
    lastMessage: '3 hours ago',
    agent: 'Mike Chen',
    preview: 'Looking for recommendations for hiking boots...'
  },
  {
    id: 7,
    customer: 'David Lee',
    subject: 'Shipping information',
    status: 'open',
    priority: 'low',
    lastMessage: '4 hours ago',
    agent: 'Sarah Johnson',
    preview: 'When will my order be shipped? Order #67890...'
  }
];



// Daily Summary Data
const dailySummary = {
  greeting: "Good morning! You've already completed 12 cases today - excellent work! Let's get a few more done before we finish the day.",
  tasksCompleted: 12,
  tasksRemaining: 8,
  priorityTasks: [
    "Follow up with Emily Davis on tennis racket return",
    "Process urgent cancellation for Robert Wilson",
    "Review Lisa Thompson's defective shoes case"
  ],
  insights: "You're 60% ahead of yesterday's pace. Great work on response times!",
  dayRecommendation: [
    {
      text: "Pick up the urgent tasks that have been waiting the longest - these customers need immediate attention",
      urgency: "high",
      completed: true
    },
    {
      text: "Focus on processing the return requests systematically, starting with the most recent ones",
      urgency: "medium",
      completed: false
    },
    {
      text: "Maintain our excellent customer satisfaction rating by ensuring every interaction feels personal and solution-focused",
      urgency: "low",
      completed: false
    }
  ]
};

// Manager Notice
const managerNotice = {
  title: "Important: New Return Policy Update",
  message: "Starting today, we're extending our return window to 60 days for all sporting goods. Please update customers accordingly and use the new return codes in the system.",
  priority: "high",
  author: "Sarah Mitchell - Customer Success Manager",
  timestamp: "2 hours ago"
};

// Funnel Cards Data
// Unread chat cards data for horizontal display
const unreadChatCards = [
  {
    id: 1,
    customer: 'Emily Davis',
    subject: 'Return request for tennis racket',
    suggestedAction: 'Process Return',
    time: '15 min ago',
    priority: 'high'
  },
  {
    id: 2,
    customer: 'Robert Wilson', 
    subject: 'Order cancellation urgent',
    suggestedAction: 'Cancel Order',
    time: '8 min ago',
    priority: 'high'
  },
  {
    id: 3,
    customer: 'John Smith',
    subject: 'Nike Air Max sizing question',
    suggestedAction: 'Provide Sizing',
    time: '2 min ago',
    priority: 'medium'
  },
  {
    id: 4,
    customer: 'Anna Garcia',
    subject: 'Product recommendation',
    suggestedAction: 'Recommend Products',
    time: '3 hours ago',
    priority: 'low'
  },
  {
    id: 5,
    customer: 'Michael Brown',
    subject: 'Garmin watch sync issues',
    suggestedAction: 'Troubleshoot Sync',
    time: '1 hour ago',
    priority: 'medium'
  }
];

const funnelCards = [
  {
    id: 'resolve_now',
    title: 'Resolve Now',
    description: 'Urgent tickets requiring immediate attention',
    count: 3,
    icon: FireIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    action: 'View Urgent Tickets',
    link: '/chats-supabase'
  },
  {
    id: 'retention',
    title: 'Retention',
    description: 'Customers at risk of cancelling',
    count: 5,
    icon: HeartIcon,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    action: 'Save Customers',
    link: '/chats-supabase'
  },
  {
    id: 'upsell',
    title: 'Upsell',
    description: 'Opportunities for additional sales',
    count: 7,
    icon: ArrowTrendingUpIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    action: 'Close Deals',
    link: '/chats-supabase'
  },
  {
    id: 'proactive_updates',
    title: 'Proactive Updates',
    description: 'Send updates during delays',
    count: 4,
    icon: BellIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    action: 'Send Updates',
    link: '/chats-supabase'
  }
];

const teamMembers = [
  {
    name: 'Sarah Johnson',
    status: 'online',
    activeChats: 5,
    maxChats: 8
  },
  {
    name: 'Mike Chen',
    status: 'online',
    activeChats: 3,
    maxChats: 8
  },
  {
    name: 'Emily Rodriguez',
    status: 'online',
    activeChats: 7,
    maxChats: 8
  },
  {
    name: 'David Kim',
    status: 'offline',
    activeChats: 0,
    maxChats: 8
  }
];

const weeklyGoal = {
  target: 150,
  completed: 98,
  label: 'Tickets Resolved This Week'
};

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showKB, setShowKB] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderForm, setReminderForm] = useState<{ when: string; note: string }>({ when: '', note: '' });
  const [stickyNote, setStickyNote] = useState('- Lunch with Emily\n- Meeting at 2.00pm\n- Ask David about #2241');
  const [stickyColor, setStickyColor] = useState('bg-white');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [avgResponseTime, setAvgResponseTime] = useState<string>('0m');

  // Fetch real chats using the hook
  const { chats, loading: chatsLoading, error: chatsError } = useChats(companyId || undefined);

  // Fetch user profile, company, and analytics
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name, company_id')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserName(profile.name || 'User');
        setCompanyId(profile.company_id);
      }

      // Fetch total customers (Flutter consumers)
      const { data: customers } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('user_type', 'flutter_consumer');

      if (customers) {
        setTotalCustomers(customers.length || 0);
      }

      // Calculate average response time from messages
      if (profile?.company_id) {
        const { data: chatsWithMessages } = await supabase
          .from('chats')
          .select(`
            id,
            created_at,
            messages!inner(created_at, sender_id)
          `)
          .eq('company_id', profile.company_id)
          .limit(50);

        if (chatsWithMessages && chatsWithMessages.length > 0) {
          let totalResponseTime = 0;
          let responseCount = 0;

          chatsWithMessages.forEach((chat: any) => {
            if (chat.messages && chat.messages.length > 1) {
              // Calculate time between first customer message and first agent response
              const messages = chat.messages.sort((a: any, b: any) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );

              for (let i = 1; i < messages.length; i++) {
                if (messages[i].sender_id !== messages[0].sender_id) {
                  const timeDiff = new Date(messages[i].created_at).getTime() -
                                 new Date(messages[0].created_at).getTime();
                  totalResponseTime += timeDiff;
                  responseCount++;
                  break;
                }
              }
            }
          });

          if (responseCount > 0) {
            const avgMinutes = Math.round((totalResponseTime / responseCount) / (1000 * 60));
            setAvgResponseTime(`${avgMinutes}m`);
          }
        }
      }
    }

    fetchUserProfile();
  }, [user]);

  // Calculate real stats from chats
  const activeChatsCount = chats.filter(c => c.status === 'open').length;

  // Customer satisfaction mock (can be implemented with post-chat surveys)
  const customerSatisfaction = 94;

  // Generate stats with real data
  const stats = generateStats(activeChatsCount, totalCustomers, avgResponseTime, customerSatisfaction);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stickyColors = [
    { name: 'White', class: 'bg-white', border: 'border-gray-200' },
    { name: 'Yellow', class: 'bg-yellow-100', border: 'border-yellow-200' },
    { name: 'Pink', class: 'bg-pink-100', border: 'border-pink-200' },
    { name: 'Blue', class: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'Green', class: 'bg-green-100', border: 'border-green-200' },
    { name: 'Purple', class: 'bg-purple-100', border: 'border-purple-200' },
    { name: 'Orange', class: 'bg-orange-100', border: 'border-orange-200' }
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'r') {
        router.push('/chats-supabase?resume=last');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center">
      <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Global banner is rendered in MainLayout; local banner removed */}

      {/* Header with title/subtitle */}
      <div className="mb-4">
        <h2 className="text-heading text-gray-900 text-2xl sm:text-3xl">Welcome back {userName || 'User'},</h2>
        <p className="text-gray-600">Jump into the most impactful tasks right now</p>
      </div>

      {/* Stats Row - No card backgrounds, horizontal 1x4 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="text-center">
              <div className="flex justify-center mb-2">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">
                {stat.name}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                stat.changeType === 'increase'
                  ? 'bg-green-100 text-green-700'
                  : stat.name === 'Avg Response Time'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Cards - 1x4 Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {funnelCards.map((funnel) => {
          const Icon = funnel.icon;
          return (
            <button
              key={funnel.id}
              onClick={() => router.push(funnel.link)}
              className={`bg-white rounded-lg border-2 ${funnel.borderColor} hover:shadow-md transition-all duration-200 cursor-pointer p-5 text-left group hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${funnel.bgColor}`}>
                  <Icon className={`h-5 w-5 ${funnel.color}`} />
                </div>
                <span className={`text-2xl font-bold ${funnel.color}`}>
                  {funnel.count}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {funnel.title}
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                {funnel.description}
              </p>
              <div className={`text-xs font-medium ${funnel.color} group-hover:underline`}>
                {funnel.action} →
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid - Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Recent Activity Card */}
        <div className="card-elevated">
          <div className="p-2.5 border-b border-gray-100">
            <h4 className="text-xs font-semibold text-gray-900">Recent Updates</h4>
          </div>
          <div>
            <div className="p-2.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{backgroundColor: '#FBBF16'}}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900">New reply from Emily Davis</p>
                  <p className="text-xs text-gray-500 mt-0.5">2 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-2.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{backgroundColor: '#FBBF16'}}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900">Order #12345 status updated</p>
                  <p className="text-xs text-gray-500 mt-0.5">15 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-2.5 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gray-300"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900">New reply from Robert Wilson</p>
                  <p className="text-xs text-gray-500 mt-0.5">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Goal Card */}
        <div className="card-elevated">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Goal</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - weeklyGoal.completed / weeklyGoal.target)}`}
                    className="text-blue-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{Math.round((weeklyGoal.completed / weeklyGoal.target) * 100)}%</span>
                  <span className="text-xs text-gray-500">{weeklyGoal.completed}/{weeklyGoal.target}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 text-center mt-3">{weeklyGoal.label}</p>
            </div>
          </div>
        </div>

        {/* Team Members Card */}
        <div className="card-elevated">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Team Status</h3>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs font-medium text-gray-900">{member.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{member.activeChats}/{member.maxChats}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${member.status === 'online' ? 'bg-blue-500' : 'bg-gray-300'}`}
                      style={{ width: `${(member.activeChats / member.maxChats) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personal Sticky Note */}
        <div className={`${stickyColor} rounded-lg shadow-md p-5 relative transform rotate-1 hover:rotate-0 transition-transform`}>
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
              title="Change color"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>
            {showColorPicker && (
              <div className="absolute top-8 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-10 flex gap-1">
                {stickyColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setStickyColor(color.class);
                      setShowColorPicker(false);
                    }}
                    className={`w-6 h-6 rounded ${color.class} border-2 ${color.border} hover:scale-110 transition-transform`}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-800 mb-3 font-handwriting">Notes</h3>
          <textarea
            value={stickyNote}
            onChange={(e) => setStickyNote(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none resize-none text-sm text-gray-800 font-handwriting leading-relaxed"
            rows={6}
            placeholder="Write your affirmation or reminder for today..."
          />
        </div>
      </div>
      </div>
      {/* Knowledge Base Modal */}
      {showKB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Knowledge Base Search</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowKB(false)}>✕</button>
            </div>
            <input className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Search articles..." />
            <div className="mt-3 text-xs text-gray-600">Try keywords like "return policy", "shipping delays", "warranty"</div>
          </div>
        </div>
      )}

      {/* Set Reminder Modal */}
      {showReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Set Reminder</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowReminder(false)}>✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">When</label>
                <input
                  type="datetime-local"
                  value={reminderForm.when}
                  onChange={(e) => setReminderForm(prev => ({ ...prev, when: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Note</label>
                <textarea
                  value={reminderForm.note}
                  onChange={(e) => setReminderForm(prev => ({ ...prev, note: e.target.value }))}
                  className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Follow up with customer about shipment."
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  className="px-3 py-2 text-sm rounded-md border border-gray-300"
                  onClick={() => setShowReminder(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setShowReminder(false);
                    setReminderForm({ when: '', note: '' });
                  }}
                >
                  Save Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Removed Internal Note and Templates modals per cleanup */}
      {/* Removed bottom Funnel Cards section; funnels moved to main grid */}


    </div>
  );
}
