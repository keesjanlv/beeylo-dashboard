'use client';

import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface CustomerCardProps {
  customerId: string;
  customerName: string;
  customerInitials: string;
  totalChats: number;
  openChats: number;
  lastActivity: string;
  isSelected?: boolean;
  onClick: () => void;
}

export default function CustomerCard({
  customerName,
  customerInitials,
  totalChats,
  openChats,
  lastActivity,
  isSelected = false,
  onClick,
}: CustomerCardProps) {
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

        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900">{customerName}</h3>
            <div className="text-[11px] text-gray-500 ml-2 flex-shrink-0">
              {lastActivity}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <ChatBubbleLeftRightIcon className="h-3 w-3" />
            <span>{totalChats} {totalChats === 1 ? 'chat' : 'chats'}</span>
            {openChats > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium text-[10px]">
                {openChats} open
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
