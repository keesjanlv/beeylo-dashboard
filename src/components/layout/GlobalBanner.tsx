"use client";
import { useState } from 'react';
import { MegaphoneIcon, BellIcon } from '@heroicons/react/24/outline';
import managerNotice from '../../data/managerNotice.json';

export default function GlobalBanner() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter to show only reply notifications
  const notifications = [
    {
      id: 1,
      type: 'reply',
      message: 'New reply from Emily Davis',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 3,
      type: 'reply',
      message: 'New reply from Robert Wilson',
      time: '1 hour ago',
      unread: false
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between py-2">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2 text-center">
            <MegaphoneIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{managerNotice.title}</span>
            <span className="text-xs text-gray-600">— {managerNotice.author} • {managerNotice.timestamp}</span>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BellIcon className="h-5 w-5 text-gray-500" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-bold text-white rounded-full flex items-center justify-center" style={{backgroundColor: '#FBBF16'}}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto w-80">
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                  </div>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.unread ? 'bg-gray-300' : 'bg-gray-300'}`} style={notification.unread ? {backgroundColor: '#FBBF16'} : {}}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}