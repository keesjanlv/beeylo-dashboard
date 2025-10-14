'use client';

import { useState } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  Cog6ToothIcon,
  LinkIcon,
  BoltIcon,
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';

// Import mock data
import usersData from '../../../data/users.json';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  companyId: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  permissions: string[];
  stats: {
    chatsHandled: number;
    avgResponseTime: string;
    customerRating: number;
    resolutionRate: number;
  };
  workingHours: string;
  timezone: string;
  maxCases?: number;
  currentCases?: number;
  expertise?: string[];
}

export default function SettingsPage() {
  const { position, setPosition } = useSidebar();
  const [activeTab, setActiveTab] = useState('integrations');
  const [users, setUsers] = useState<User[]>(usersData);
  const [contentScale, setContentScale] = useState(1.0);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const tabs = [
    { id: 'integrations', name: 'Integrations', icon: LinkIcon },
    { id: 'automation', name: 'Automation', icon: BoltIcon },
    { id: 'team', name: 'Team', icon: UsersIcon },
    { id: 'layout', name: 'Layout', icon: RectangleGroupIcon },
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
  ];

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setContentScale(scale);
    document.documentElement.style.fontSize = `${scale * 100}%`;
  };

  const integrations = [
    { name: 'WhatsApp Business', status: 'connected', description: 'Receive and send WhatsApp messages' },
    { name: 'Email (SMTP)', status: 'connected', description: 'Handle email support tickets' },
    { name: 'SMS Gateway', status: 'disconnected', description: 'Send SMS notifications' },
    { name: 'Slack', status: 'disconnected', description: 'Team notifications and alerts' },
    { name: 'Shopify', status: 'connected', description: 'Sync order and customer data' },
    { name: 'Stripe', status: 'connected', description: 'Process refunds and payments' },
  ];

  const automationRules = [
    {
      id: '0',
      name: 'Automatic help with return request',
      trigger: 'Customer mentions "return", "refund", or "exchange"',
      action: 'Send return policy and initiate return process',
      status: 'active'
    },
    {
      id: '1',
      name: 'Auto-assign urgent tickets',
      trigger: 'New conversation with "urgent" keyword',
      action: 'Assign to senior agent',
      status: 'active'
    },
    {
      id: '2',
      name: 'Send follow-up after resolution',
      trigger: 'Conversation marked as resolved',
      action: 'Send satisfaction survey after 24 hours',
      status: 'active'
    },
    {
      id: '3',
      name: 'Escalate unresponded tickets',
      trigger: 'No response for 2 hours during business hours',
      action: 'Notify team lead',
      status: 'inactive'
    },
  ];



  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
        <p className="text-sm text-gray-600">Connect your favorite tools and services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`inline-flex items-center text-xs font-medium mb-2 ${
                  integration.status === 'connected' 
                    ? 'text-green-800' 
                    : 'text-gray-800'
                }`}>
                  {integration.status === 'connected' ? (
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircleIcon className="h-3 w-3 mr-1" />
                  )}
                  {integration.status}
                </span>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{integration.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className={`px-3 py-1 rounded text-sm font-medium ${
                  integration.status === 'connected'
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}>
                  {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAutomationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Automation Rules</h2>
          <p className="text-sm text-gray-600">Set up automated workflows for your team</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          New Rule
        </button>
      </div>

      <div className="space-y-4">
        {automationRules.map((rule) => (
          <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">{rule.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">When:</span> {rule.trigger}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Then:</span> {rule.action}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  rule.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {rule.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-amber-600">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const expertiseOptions = [
    { value: 'upsell', label: 'Upsell', color: 'bg-purple-100 text-purple-800' },
    { value: 'retention', label: 'Retention', color: 'bg-red-100 text-red-800' },
    { value: 'technical_support', label: 'Technical Support', color: 'bg-blue-100 text-blue-800' },
    { value: 'product_issue', label: 'Product Issue', color: 'bg-orange-100 text-orange-800' },
    { value: 'product_inquiry', label: 'Product Inquiry', color: 'bg-green-100 text-green-800' },
    { value: 'return_refund', label: 'Return/Refund', color: 'bg-amber-100 text-amber-800' },
    { value: 'bulk_order', label: 'Bulk Order', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'escalations', label: 'Escalations', color: 'bg-rose-100 text-rose-800' },
  ];

  const getExpertiseColor = (expertise: string) => {
    const option = expertiseOptions.find(opt => opt.value === expertise);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  };

  const updateUserMaxCases = (userId: string, maxCases: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, maxCases } : u));
  };

  const toggleUserExpertise = (userId: string, expertise: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const currentExpertise = u.expertise || [];
        const hasExpertise = currentExpertise.includes(expertise);
        return {
          ...u,
          expertise: hasExpertise
            ? currentExpertise.filter(e => e !== expertise)
            : [...currentExpertise, expertise]
        };
      }
      return u;
    }));
  };

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Team Management</h2>
          <p className="text-sm text-gray-600">Configure case limits and expertise for automatic assignment</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6">
            {/* User Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'online'
                    ? 'bg-green-100 text-green-800'
                    : user.status === 'busy'
                    ? 'bg-yellow-100 text-yellow-800'
                    : user.status === 'away'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
                <button
                  onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Case Load */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Case Load</span>
                <span className="text-xs text-gray-500">
                  {user.currentCases || 0} / {user.maxCases || 0} cases
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    (user.currentCases || 0) >= (user.maxCases || 0)
                      ? 'bg-red-500'
                      : (user.currentCases || 0) / (user.maxCases || 1) > 0.7
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(((user.currentCases || 0) / (user.maxCases || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Max Cases Configuration */}
            {editingUser === user.id && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Maximum Active Cases
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={user.maxCases || 10}
                    onChange={(e) => updateUserMaxCases(user.id, parseInt(e.target.value) || 10)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">
                    Currently handling {user.currentCases || 0} case{(user.currentCases || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Expertise */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Expertise (for auto-assignment)</span>
                {editingUser === user.id && (
                  <span className="text-xs text-gray-500">Click to toggle</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {editingUser === user.id ? (
                  // Edit mode - all options clickable
                  expertiseOptions.map((option) => {
                    const hasExpertise = (user.expertise || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleUserExpertise(user.id, option.value)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          hasExpertise
                            ? option.color + ' ring-2 ring-offset-1 ring-blue-400'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {hasExpertise && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                        {option.label}
                      </button>
                    );
                  })
                ) : (
                  // View mode - only show assigned expertise
                  (user.expertise || []).length > 0 ? (
                    (user.expertise || []).map((exp) => {
                      const option = expertiseOptions.find(opt => opt.value === exp);
                      return (
                        <span
                          key={exp}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getExpertiseColor(exp)}`}
                        >
                          {option?.label || exp}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-gray-400 italic">No expertise assigned</span>
                  )
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Chats Handled</p>
                  <p className="text-sm font-semibold text-gray-900">{user.stats.chatsHandled}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Response</p>
                  <p className="text-sm font-semibold text-gray-900">{user.stats.avgResponseTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-sm font-semibold text-gray-900">{user.stats.customerRating}/5</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Resolution</p>
                  <p className="text-sm font-semibold text-gray-900">{user.stats.resolutionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
        <p className="text-sm text-gray-600">Configure your company preferences</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                defaultValue="SportZone Equipment"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sports Equipment</option>
                <option>Retail</option>
                <option>E-commerce</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Monday - Friday</span>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  defaultValue="09:00"
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  defaultValue="18:00"
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Saturday</span>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  defaultValue="10:00"
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  defaultValue="16:00"
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Sunday</span>
              <span className="text-sm text-gray-500">Closed</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Email notifications</span>
                <p className="text-sm text-gray-500">Receive email alerts for new conversations</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Push notifications</span>
                <p className="text-sm text-gray-500">Get notified about urgent tickets</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Layout Settings</h2>
        <p className="text-sm text-gray-600">Customize your workspace layout and appearance</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Position</h3>
          <p className="text-sm text-gray-600 mb-4">Choose where you want the navigation menu to appear</p>
          <div className="flex space-x-3">
            <button
              onClick={() => setPosition('left')}
              className={`flex-1 p-4 rounded-lg text-sm font-medium transition-all border-2 ${
                position === 'left'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Left Sidebar
            </button>
            <button
              onClick={() => setPosition('top')}
              className={`flex-1 p-4 rounded-lg text-sm font-medium transition-all border-2 ${
                position === 'top'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Top Bar
            </button>
            <button
              onClick={() => setPosition('bottom')}
              className={`flex-1 p-4 rounded-lg text-sm font-medium transition-all border-2 ${
                position === 'bottom'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Bottom Bar
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Size</h3>
          <p className="text-sm text-gray-600 mb-4">Adjust the text size across the application</p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Small</span>
            <input
              type="range"
              min={0.75}
              max={1.25}
              step={0.05}
              value={contentScale}
              onChange={handleScaleChange}
              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer slider accent-blue-600"
            />
            <span className="text-sm text-gray-600">Large</span>
            <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
              {Math.round(contentScale * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'integrations': return renderIntegrationsTab();
      case 'automation': return renderAutomationTab();
      case 'team': return renderTeamTab();
      case 'layout': return renderLayoutTab();
      case 'general': return renderGeneralTab();
      default: return renderIntegrationsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>


    </div>
  );
}