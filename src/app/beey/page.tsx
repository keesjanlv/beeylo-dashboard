'use client';

import { useState } from 'react';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { TrophyIcon } from '@heroicons/react/24/solid';

interface Customer {
  id: string;
  name: string;
  email: string;
  beeyloId: string;
}

const sampleCustomers: Customer[] = [
  { id: '1', name: 'Emma Thompson', email: 'emma@example.com', beeyloId: 'BEY-001' },
  { id: '2', name: 'Michael Chen', email: 'michael@example.com', beeyloId: 'BEY-002' },
  { id: '3', name: 'Lisa Anderson', email: 'lisa@example.com', beeyloId: 'BEY-003' },
  { id: '4', name: 'Robert Davis', email: 'robert@example.com', beeyloId: 'BEY-004' },
  { id: '5', name: 'Jennifer Martinez', email: 'jennifer@example.com', beeyloId: 'BEY-005' },
  { id: '6', name: 'David Brown', email: 'david@example.com', beeyloId: 'BEY-006' },
  { id: '7', name: 'Ashley Taylor', email: 'ashley@example.com', beeyloId: 'BEY-007' },
  { id: '8', name: 'Christopher Wilson', email: 'chris@example.com', beeyloId: 'BEY-008' }
];

export default function BeeyPage() {
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<Customer | null>(null);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [subjectLine, setSubjectLine] = useState('');
  const [beeyContent, setBeeyContent] = useState('');

  // Company info (mock data)
  const companyInfo = {
    name: 'The Sport House',
    bio: 'Premium sports equipment and apparel',
    logo: '/logo.png'
  };

  const filteredCustomers = sampleCustomers.filter(customer =>
    customer.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    customer.email.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    customer.beeyloId.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const handleSelectRecipient = (customer: Customer) => {
    setSelectedRecipient(customer);
    setRecipientSearch(customer.name);
    setShowRecipientDropdown(false);
  };

  const handleClearRecipient = () => {
    setSelectedRecipient(null);
    setRecipientSearch('');
  };

  const getBeeyloHandle = (beeyloId: string) => {
    // Convert BEY-001 to @bey001
    return '@' + beeyloId.toLowerCase().replace('-', '');
  };

  return (
    <FullscreenWrapper>
      <div className="flex flex-col bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Beey</h1>
          <p className="text-sm text-gray-600">Send a personalized message to your customer</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Recipient Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Recipient
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, email, or Beeylo ID..."
                  value={recipientSearch}
                  onChange={(e) => {
                    setRecipientSearch(e.target.value);
                    setShowRecipientDropdown(true);
                  }}
                  onFocus={() => setShowRecipientDropdown(true)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedRecipient && (
                  <button
                    onClick={handleClearRecipient}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}

                {/* Dropdown */}
                {showRecipientDropdown && recipientSearch && !selectedRecipient && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => handleSelectRecipient(customer)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.email}</p>
                              <p className="text-xs text-blue-600">{customer.beeyloId}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No customers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Beey Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header with Company Info */}
              <div className="bg-white p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrophyIcon className="h-10 w-10 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h2>
                    <p className="text-gray-700 text-sm">{companyInfo.bio}</p>
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              {selectedRecipient && (
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">To: {selectedRecipient.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{getBeeyloHandle(selectedRecipient.beeyloId)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Line */}
              <div className="px-6 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  placeholder="Enter subject line"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Content Area */}
              <div className="px-6 pb-6 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  value={beeyContent}
                  onChange={(e) => setBeeyContent(e.target.value)}
                  placeholder="Type your message here"
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {beeyContent.length} characters
                </p>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Sent from {companyInfo.name}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setBeeyContent('');
                        setSubjectLine('');
                        setSelectedRecipient(null);
                        setRecipientSearch('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      disabled={!selectedRecipient || !beeyContent.trim() || !subjectLine.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Beey
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  );
}
