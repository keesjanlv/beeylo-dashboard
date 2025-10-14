'use client';

import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

interface EditableBannerProps {
  defaultLines?: string[];
  storageKey: string;
}

const EditableBanner: React.FC<EditableBannerProps> = ({ 
  defaultLines = ['Click to add your first reminder...'], 
  storageKey 
}) => {
  const [lines, setLines] = useState<string[]>(defaultLines);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsedLines = JSON.parse(saved);
        if (Array.isArray(parsedLines) && parsedLines.length > 0) {
          setLines(parsedLines);
        }
      } catch (error) {
        console.error('Error loading banner data:', error);
      }
    }
  }, [storageKey]);

  // Save to localStorage whenever lines change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [lines, storageKey]);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(lines[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editValue.trim()) {
      const newLines = [...lines];
      newLines[editingIndex] = editValue.trim();
      setLines(newLines);
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  const deleteLine = (index: number) => {
    if (lines.length > 1) {
      const newLines = lines.filter((_, i) => i !== index);
      setLines(newLines);
    }
  };

  const addLine = () => {
    setLines([...lines, 'New reminder...']);
    setEditingIndex(lines.length);
    setEditValue('New reminder...');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="mb-6">
      {/* Add New Reminder Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={addLine}
          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 shadow-sm"
        >
          <PlusIcon className="h-4 w-4" />
          Add Reminder
        </button>
      </div>

      {/* Single Consolidated Reminder Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 border-l-4 border-l-blue-400 group">
        <div className="p-6">
          {/* Header with single icon */}
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <MegaphoneIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="ml-2 text-sm font-medium text-gray-900">Personal Reminders</h3>
          </div>
          
          {/* Reminder Items with subtle dividers */}
          <div className="space-y-0">
            {lines.map((line, index) => (
              <div key={index}>
                <div className="flex items-center py-2">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  <div className="flex-1">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyPress}
                        className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        autoFocus
                      />
                    ) : (
                      <p 
                        className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                        onClick={() => startEdit(index)}
                      >
                        {line.replace(/💡|⚡/g, '').trim()}
                      </p>
                    )}
                  </div>
                  <div className="ml-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      onClick={() => startEdit(index)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Edit reminder"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    {lines.length > 1 && (
                      <button
                        onClick={() => deleteLine(index)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete reminder"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Subtle divider between items (except for last item) */}
                {index < lines.length - 1 && (
                  <div className="border-b border-gray-100 mx-5"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableBanner;