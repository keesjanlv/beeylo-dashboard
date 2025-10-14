'use client';

import { useState } from 'react';
import { 
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Import mock data
import analyticsData from '../../../data/analytics.json';
import usersData from '../../../data/users.json';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  
  const analytics = analyticsData;
  const users = usersData;

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const metricOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'performance', label: 'Performance' },
    { value: 'team', label: 'Team Analytics' },
    { value: 'ai-insights', label: 'AI Insights' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Buddy Suggestions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-lg">🤖</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Buddy's AI Suggestions</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Peak Hours Optimization</p>
                    <p className="text-sm text-gray-600 mt-1">Consider adding 2 more agents during 2-4 PM to reduce response time by 23%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Template Opportunity</p>
                    <p className="text-sm text-gray-600 mt-1">Create a template for "Order Status" inquiries - 34% of conversations could be automated</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Training Recommendation</p>
                    <p className="text-sm text-gray-600 mt-1">Sarah M. could benefit from product knowledge training - 15% lower resolution rate on technical issues</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Conversations"
          value={analytics.overview.totalConversations}
          change="+12% from last week"
          icon={ChartBarIcon}
          trend="up"
        />
        <StatCard
          title="Avg Response Time"
          value={analytics.overview.averageResponseTime}
          change="-15 min from last week"
          icon={ClockIcon}
          trend="up"
        />
        <StatCard
          title="Resolution Rate"
          value={`${(analytics.overview.resolvedToday / analytics.overview.totalConversations * 100).toFixed(1)}%`}
          change="+5% from last week"
          icon={ArrowTrendingUpIcon}
          trend="up"
        />
        <StatCard
          title="Customer Satisfaction"
          value={analytics.overview.customerSatisfaction}
          change="+0.2 from last week"
          icon={UserGroupIcon}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.responseTimeMetrics.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgResponse" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Avg Response Time (hrs)"
              />
              <Line 
                type="monotone" 
                dataKey="avgResolution" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Avg Resolution Time (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversation Volume */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Conversation Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.conversationVolume.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Total Conversations"
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Resolved"
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Pending"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Categories</h3>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.conversationVolume.byCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.category} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.conversationVolume.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-shrink-0">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
                {analytics.conversationVolume.byCategory.map((entry, index) => (
                  <div key={`${entry.category}-${index}`} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{entry.category}</div>
                      <div className="text-xs text-gray-500">{entry.count} conversations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.customerSatisfactionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Satisfaction Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTeamAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resolution Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.agentPerformance.map((agent, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.conversationsHandled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.averageResponseTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.resolutionRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {agent.averageRating}/5
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analytics.agentPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="conversationsHandled" fill="#3B82F6" name="Conversations" />
            <Bar dataKey="resolutionRate" fill="#10B981" name="Resolution Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products Mentioned</h3>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(product.inquiries / 50) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{product.inquiries}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversations" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
        <div className="space-y-4">
          {analytics.aiInsights.topSuggestions.map((suggestion, index) => (
            <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{index + 1}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">AI Suggestion</h4>
                  <p className="text-sm text-blue-700 mt-1">{suggestion}</p>
                  <p className="text-xs text-blue-600 mt-2">Acceptance Rate: {analytics.aiInsights.suggestionsAccepted}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMetric) {
      case 'overview': return renderOverview();
      case 'team': return renderTeamAnalytics();
      case 'ai-insights': return renderAIInsights();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-display text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your team's performance and customer satisfaction</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {dateRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {metricOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
}