'use client';

import { useState } from 'react';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

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
  const [extraDetail, setExtraDetail] = useState('');
  const [beeyContent, setBeeyContent] = useState('');
  const [instructions, setInstructions] = useState(['']);
  const [showInstructions, setShowInstructions] = useState(true);

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

  const getCompanyInitial = (name: string) => name.charAt(0).toUpperCase();

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('Sending Beey:', {
      recipient: selectedRecipient,
      subject: subjectLine,
      extraDetail,
      content: beeyContent,
      instructions: instructions.filter(i => i.trim())
    });
  };

  const handleClear = () => {
    setBeeyContent('');
    setSubjectLine('');
    setExtraDetail('');
    setSelectedRecipient(null);
    setRecipientSearch('');
    setInstructions(['']);
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
          <div className="max-w-md mx-auto">
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

            {/* Beey Preview - Mobile-style ticket */}
            <div className="w-full bg-gray-50 min-h-screen">
              {/* Combined Header and Subject Card */}
              <div className="bg-white mx-4 mt-6 p-5 rounded-xl shadow-sm border border-gray-100">
                {/* Company Header */}
                <div className="flex items-center gap-3 mb-4">
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {getCompanyInitial(companyInfo.name)}
                    </span>
                  </div>
                  <span className="font-semibold text-lg">{companyInfo.name}</span>
                </div>

                {/* Subject & Extra Detail */}
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  placeholder="Enter subject"
                  className="text-xl font-bold text-gray-900 mb-1 w-full border-none outline-none focus:ring-0 p-0"
                />
                <input
                  type="text"
                  value={extraDetail}
                  onChange={(e) => setExtraDetail(e.target.value)}
                  placeholder="Add date or item detail"
                  className="text-gray-600 w-full border-none outline-none focus:ring-0 p-0 text-sm mb-4"
                />

                {/* Yellowish Bar */}
                <div className="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Status update</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Content</h3>
                <textarea
                  value={beeyContent}
                  onChange={(e) => setBeeyContent(e.target.value)}
                  placeholder="Type your message here..."
                  rows={8}
                  className="text-gray-600 text-sm leading-relaxed w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Instructions Section */}
              <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Instructions</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={addInstruction}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        showInstructions ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showInstructions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                {showInstructions && (
                  <ul className="space-y-2">
                    {instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <input
                          type="text"
                          value={instruction}
                          onChange={(e) => updateInstruction(index, e.target.value)}
                          placeholder="Add instruction"
                          className="text-gray-600 text-sm flex-1 leading-relaxed border-none outline-none focus:ring-0 p-0"
                        />
                        {instructions.length > 1 && (
                          <button
                            onClick={() => removeInstruction(index)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Footer Actions */}
              <div className="bg-white mx-4 mb-8 p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Sent from {companyInfo.name}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleClear}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSend}
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
