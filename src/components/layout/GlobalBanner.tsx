"use client";
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import managerNotice from '../../data/managerNotice.json';

export default function GlobalBanner() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 text-center">
            <MegaphoneIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">{managerNotice.title}</span>
            <span className="text-xs text-gray-600">— {managerNotice.author} • {managerNotice.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
}