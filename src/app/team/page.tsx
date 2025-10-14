'use client';

import { useState, useRef, useEffect } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, PaperAirplaneIcon, MicrophoneIcon, PaperClipIcon, FaceSmileIcon, XMarkIcon, Bars3Icon, EllipsisVerticalIcon, UserIcon, PhoneIcon, VideoCameraIcon, InformationCircleIcon, MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HeartIcon, HandThumbsUpIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import FullscreenWrapper from '../../components/layout/FullscreenWrapper';

// Mock data for team chats
const mockTeamChats = [
  {
    id: 1,
    name: 'Development Team',
    type: 'group',
    lastMessage: 'Sarah: The new feature is ready for testing',
    timestamp: '2:30 PM',
    unread: 3,
    avatar: null,
    members: ['Sarah Chen', 'Mike Johnson', 'Alex Rodriguez'],
    conversations: [
      {
        id: 'conv_1_1',
        subject: 'New Feature Development',
        lastMessage: 'The new feature is ready for testing',
        timestamp: '2:30 PM',
        unread: 2,
        participants: ['Sarah Chen', 'Mike Johnson']
      },
      {
        id: 'conv_1_2',
        subject: 'Bug Fixes Sprint',
        lastMessage: 'Fixed the authentication issue',
        timestamp: '1:15 PM',
        unread: 1,
        participants: ['Alex Rodriguez', 'Mike Johnson']
      },
      {
        id: 'conv_1_3',
        subject: 'Code Review Session',
        lastMessage: 'Please review the PR #234',
        timestamp: '11:45 AM',
        unread: 0,
        participants: ['Sarah Chen', 'Alex Rodriguez']
      }
    ]
  },
  {
    id: 2,
    name: 'Marketing Team',
    type: 'group',
    lastMessage: 'Lisa: Campaign results look great!',
    timestamp: '1:45 PM',
    unread: 0,
    avatar: null,
    members: ['Lisa Wang', 'Tom Brown', 'Emma Wilson'],
    conversations: [
      {
        id: 'conv_2_1',
        subject: 'Q1 Campaign Results',
        lastMessage: 'Campaign results look great!',
        timestamp: '1:45 PM',
        unread: 0,
        participants: ['Lisa Wang', 'Tom Brown']
      },
      {
        id: 'conv_2_2',
        subject: 'Social Media Strategy',
        lastMessage: 'New Instagram campaign is live',
        timestamp: '12:30 PM',
        unread: 0,
        participants: ['Emma Wilson', 'Lisa Wang']
      }
    ]
  },
  {
    id: 3,
    name: 'Sarah Chen',
    type: 'personal',
    lastMessage: 'Can we review the code changes?',
    timestamp: '12:15 PM',
    unread: 1,
    avatar: 'SC',
    status: 'online',
    conversations: [
      {
        id: 'conv_3_1',
        subject: 'Code Review Discussion',
        lastMessage: 'Can we review the code changes?',
        timestamp: '12:15 PM',
        unread: 1,
        participants: ['Sarah Chen']
      },
      {
        id: 'conv_3_2',
        subject: 'Project Planning',
        lastMessage: 'What are the next milestones?',
        timestamp: '10:30 AM',
        unread: 0,
        participants: ['Sarah Chen']
      }
    ]
  },
  {
    id: 4,
    name: 'Mike Johnson',
    type: 'personal',
    lastMessage: 'Thanks for the help with the bug fix',
    timestamp: '11:30 AM',
    unread: 0,
    avatar: 'MJ',
    status: 'away',
    conversations: [
      {
        id: 'conv_4_1',
        subject: 'Bug Fix Collaboration',
        lastMessage: 'Thanks for the help with the bug fix',
        timestamp: '11:30 AM',
        unread: 0,
        participants: ['Mike Johnson']
      },
      {
        id: 'conv_4_2',
        subject: 'Weekend Plans',
        lastMessage: 'Are you free for the team lunch?',
        timestamp: 'Yesterday',
        unread: 0,
        participants: ['Mike Johnson']
      }
    ]
  },
  {
    id: 5,
    name: 'Customer Success',
    type: 'group',
    lastMessage: 'John: Client feedback is positive',
    timestamp: 'Yesterday',
    unread: 0,
    avatar: null,
    members: ['John Davis', 'Rachel Green', 'David Kim'],
    conversations: [
      {
        id: 'conv_5_1',
        subject: 'Client Feedback Review',
        lastMessage: 'Client feedback is positive',
        timestamp: 'Yesterday',
        unread: 0,
        participants: ['John Davis', 'Rachel Green']
      },
      {
        id: 'conv_5_2',
        subject: 'Support Ticket Analysis',
        lastMessage: 'Monthly report is ready',
        timestamp: 'Yesterday',
        unread: 0,
        participants: ['David Kim', 'Rachel Green']
      }
    ]
  }
];

const mockMessages = [
  {
    id: 1,
    sender: 'Sarah Chen',
    message: 'Hey team, I just pushed the latest changes to the development branch.',
    timestamp: '2:25 PM',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    message: 'Great! I\'ll review them shortly.',
    timestamp: '2:26 PM',
    isOwn: true
  },
  {
    id: 3,
    sender: 'Sarah Chen',
    message: 'The new feature is ready for testing. Can you take a look?',
    timestamp: '2:30 PM',
    isOwn: false
  }
];

export default function TeamPage() {
  const { position } = useSidebar();
  const [selectedChat, setSelectedChat] = useState(mockTeamChats[0]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredChats = mockTeamChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage('');
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setSelectedConversation(null); // Reset conversation when selecting a new chat
  };

  return (
    <FullscreenWrapper>
    <div className="flex flex-row bg-gray-50 !p-0 !m-0 !max-w-none h-full w-full">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Team Chats</h1>
          
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {chat.type === 'group' ? (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center relative">
                      <span className="text-sm font-medium text-gray-700">{chat.avatar}</span>
                      {chat.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                      {chat.status === 'away' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                </div>

                {/* Unread Badge */}
                {chat.unread > 0 && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                      {chat.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      {selectedChat && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h2>
            <p className="text-sm text-gray-500">Conversations</p>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {selectedChat.conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.subject}</h3>
                  <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                <p className="text-xs text-gray-500 mt-1">{conversation.participants.join(', ')}</p>
                {conversation.unread > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-blue-600 rounded-full mt-2">
                    {conversation.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages View */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedChat.type === 'group' ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">{selectedChat.avatar}</span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{selectedConversation.subject}</h2>
                    <p className="text-sm text-gray-500">{selectedConversation.participants.join(', ')}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    {!message.isOwn && (
                      <p className="text-xs font-medium mb-1 text-blue-600">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : selectedChat ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from "{selectedChat.name}" to start chatting</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
              <p className="text-gray-500">Choose a chat from the sidebar to view conversations</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </FullscreenWrapper>
    );
  }