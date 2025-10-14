'use client';

import { useState } from 'react';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';
import {
  ChevronRightIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

// Sample knowledge base data - easy to replace with real data later
const knowledgeBaseData = {
  themes: [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      subjects: [
        { id: 'gs-1', title: 'Quick Start Guide', content: 'Learn how to get up and running quickly with our platform...' },
        { id: 'gs-2', title: 'Account Setup', content: 'Step-by-step guide for setting up your account...' },
        { id: 'gs-3', title: 'First Steps', content: 'What to do after creating your account...' }
      ]
    },
    {
      id: 'features',
      name: 'Features',
      icon: '✨',
      subjects: [
        { id: 'f-1', title: 'Chat Management', content: 'How to manage customer conversations effectively...' },
        { id: 'f-2', title: 'Analytics Dashboard', content: 'Understanding your analytics and metrics...' },
        { id: 'f-3', title: 'Team Collaboration', content: 'Working together with your team members...' }
      ]
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔧',
      subjects: [
        { id: 't-1', title: 'Common Issues', content: 'Solutions to frequently encountered problems...' },
        { id: 't-2', title: 'Error Messages', content: 'Understanding and resolving error messages...' },
        { id: 't-3', title: 'Performance Tips', content: 'Optimizing your experience with the platform...' }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: '🔌',
      subjects: [
        { id: 'i-1', title: 'API Documentation', content: 'Complete guide to our API endpoints...' },
        { id: 'i-2', title: 'Third-party Apps', content: 'Connecting with external services...' },
        { id: 'i-3', title: 'Webhooks', content: 'Setting up and managing webhooks...' }
      ]
    }
  ]
};

interface Subject {
  id: string;
  title: string;
  content: string;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  subjects: Subject[];
}

export default function KnowledgeBasePage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleThemeClick = (theme: Theme) => {
    setSelectedTheme(theme);
    setSelectedSubject(null);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
    setSelectedSubject(null);
  };

  const handleBackToChat = () => {
    setSelectedSubject(null);
    setSelectedTheme(null);
  };

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Handle search/query
      console.log('Searching for:', inputValue);
    }
  };

  return (
    <FullscreenWrapper>
      <div className="flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 !p-0 !m-0 !max-w-none h-full w-full relative overflow-hidden">
        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Main Content Area - Fullscreen Layout */}
          <div className="flex-1 flex overflow-hidden bg-gray-50">

              {selectedSubject ? (
                // Article View - Full Width
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                  <button
                    onClick={handleBackToChat}
                    className="mb-6 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    <span>Back to Search</span>
                  </button>

                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                    {selectedSubject.title}
                  </h2>

                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedSubject.content}
                    </p>

                    <div className="mt-8 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-900">Overview</h3>
                      <p className="text-gray-700">
                        This is a sample knowledge base article. Replace this content with your actual
                        documentation, guides, and help articles.
                      </p>

                      <h3 className="text-xl font-semibold text-gray-900 mt-6">Key Points</h3>
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Important feature or concept explanation</li>
                        <li>Step-by-step instructions or guidelines</li>
                        <li>Best practices and recommendations</li>
                        <li>Common use cases and examples</li>
                      </ul>

                      <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <div>
                          <p className="font-medium text-green-900">Pro Tip</p>
                          <p className="text-sm text-green-700 mt-1">
                            This is where you can add helpful tips and additional insights for users.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-3">
                      {knowledgeBaseData.themes
                        .flatMap(t => t.subjects)
                        .filter(s => s.id !== selectedSubject.id)
                        .slice(0, 3)
                        .map(subject => (
                          <button
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject)}
                            className="w-full text-left p-3 rounded-lg hover:bg-white transition-colors flex items-center space-x-3"
                          >
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-700">{subject.title}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                // AI Chat + Knowledge Base List Side by Side
                <>
                  {/* Left Side - AI Chat */}
                  <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
                    <div className="w-full max-w-2xl">
                      <div className="text-center mb-8">
                        <h2 className="text-xl text-gray-600 font-medium">
                          What do you want to know<br />about your platform?
                        </h2>
                      </div>

                      <form onSubmit={handleSubmit} className="relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask me anything..."
                          className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>

                  {/* Right Side - Knowledge Base List */}
                  <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                      <h2 className="text-sm font-semibold text-gray-900">Knowledge Base</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {!selectedTheme ? (
                        <div className="divide-y divide-gray-100 animate-fadeIn">
                          {knowledgeBaseData.themes.map((theme, index) => (
                            <button
                              key={theme.id}
                              onClick={() => handleThemeClick(theme)}
                              className="w-full px-6 py-2.5 hover:bg-green-50/50 transition-all duration-200 text-left group flex items-center justify-between"
                              style={{
                                animation: `slideInFromRight 0.3s ease-out ${index * 0.05}s both`
                              }}
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                                {theme.name}
                              </span>
                              <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-green-500 transition-all duration-200" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="animate-fadeIn">
                          <button
                            onClick={handleBackToThemes}
                            className="w-full px-6 py-2.5 text-left text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 transition-colors flex items-center space-x-1 border-b border-gray-100"
                          >
                            <ArrowLeftIcon className="h-3 w-3" />
                            <span>Back</span>
                          </button>

                          <div className="px-6 py-3 border-b border-gray-200/50 bg-gray-50/50">
                            <h3 className="text-sm font-semibold text-gray-900">{selectedTheme.name}</h3>
                          </div>

                          <div className="divide-y divide-gray-100">
                            {selectedTheme?.subjects.map((subject, index) => (
                              <button
                                key={subject.id}
                                onClick={() => handleSubjectClick(subject)}
                                className={`w-full px-6 py-2.5 transition-all duration-200 text-left ${
                                  selectedSubject?.id === subject.id
                                    ? 'bg-green-50/70 hover:bg-green-50'
                                    : 'hover:bg-green-50/50'
                                }`}
                                style={{
                                  animation: `slideInFromRight 0.3s ease-out ${index * 0.05}s both`
                                }}
                              >
                                <p className={`text-sm ${
                                  selectedSubject?.id === subject.id ? 'font-medium text-green-700' : 'font-medium text-gray-700'
                                }`}>
                                  {subject.title}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </FullscreenWrapper>
  );
}
