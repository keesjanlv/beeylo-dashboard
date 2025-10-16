'use client';

import React from 'react';
import { FaceFrownIcon, ExclamationCircleIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

interface ChatCardProps {
  id: string;
  customerName: string;
  customerInitials: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  status: 'open' | 'pending' | 'closed';
  isUrgent?: boolean;
  isBriefing?: boolean;
  isSelected?: boolean;
  sentiment?: 'angry' | 'neutral' | 'happy';
  onClick: () => void;
}

export default function ChatCard({
  customerName,
  customerInitials,
  subject,
  lastMessage,
  timestamp,
  isUrgent = false,
  isBriefing = false,
  isSelected = false,
  sentiment = 'neutral',
  onClick,
}: ChatCardProps) {
  // Sentiment icon mapper - using minimal heroicons
  const getSentimentIcon = (sentiment: 'angry' | 'neutral' | 'happy') => {
    switch (sentiment) {
      case 'angry':
        return <FaceFrownIcon className="w-4 h-4 text-red-500" />;
      case 'happy':
        return <FaceSmileIcon className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-400" />;
    }
  };
  // Briefing card styling (for new chats that haven't been responded to yet)
  if (isBriefing) {
    return (
      <div
        onClick={onClick}
        className={`m-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {/* URGENT badge and timestamp at top */}
        <div className="flex items-center justify-between mb-3">
          {isUrgent && (
            <span className="px-2 py-1 text-xs font-bold rounded bg-red-100 text-red-800 uppercase">
              Urgent
            </span>
          )}
          <span className="text-xs text-gray-500 font-mono ml-auto">{timestamp}</span>
        </div>

        {/* Customer info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {customerInitials}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-gray-900">{customerName}</h3>
              {getSentimentIcon(sentiment)}
            </div>
            <span className="text-xs text-gray-500 capitalize">
              {sentiment === 'angry' ? 'Frustrated' : sentiment === 'happy' ? 'Satisfied' : 'Neutral'}
            </span>
          </div>
        </div>

        {/* Message preview */}
        <div>
          <p className="text-xs text-gray-600 leading-relaxed">{lastMessage}</p>
        </div>
      </div>
    );
  }

  // Regular chat card styling (for chats with conversation history)
  return (
    <div
      onClick={onClick}
      className={`p-4 hover:bg-gray-50 transition-all cursor-pointer border-b border-gray-100 ${
        isSelected ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Customer Avatar */}
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-gray-700">
            {customerInitials}
          </span>
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-gray-900">{customerName}</h3>
                {getSentimentIcon(sentiment)}
              </div>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700 uppercase">
                  <ExclamationCircleIcon className="w-3 h-3" />
                  URGENT
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 ml-2 flex-shrink-0">
              {timestamp}
            </div>
          </div>
          <p className="text-xs font-medium text-gray-900 mb-1">{subject}</p>
          <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
}
