'use client';

import React, { useState } from 'react';
import InteractiveTemplateBuilder from '@/components/InteractiveTemplateBuilder';
import { TicketTemplate } from '@/types/ticket';

const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<TicketTemplate[]>([
    {
      id: 'template_1',
      name: 'Order Confirmation',
      description: 'Standard order confirmation template with product details',
      elements: [
        {
          id: 'header_1',
          type: 'header',
          content: { title: 'Order Confirmed', company: 'The Sport House' },
          styling: { backgroundColor: '#ffffff', textColor: '#1f2937', padding: 16 },
          position: 0,
        },
        {
          id: 'content_1',
          type: 'content',
          content: { title: 'Order Details', text: 'Thank you for your order! Your items are being prepared for shipment.' },
          styling: { backgroundColor: '#f9fafb', textColor: '#374151', padding: 12 },
          position: 1,
        },
        {
          id: 'order_item_1',
          type: 'order-item',
          content: { name: 'Nike Air Max 270', quantity: 1, price: '€129.99' },
          styling: { backgroundColor: '#ffffff', padding: 12 },
          position: 2,
        },
        {
          id: 'shipping_1',
          type: 'shipping',
          content: { label: 'Standard Shipping', amount: '€4.99' },
          styling: { backgroundColor: '#ffffff', padding: 8 },
          position: 3,
        }
      ],
      globalStyling: {
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#10b981',
        borderRadius: 8,
        fontFamily: 'Inter, sans-serif',
      },
    },
    {
      id: 'template_2',
      name: 'Shipping Notification',
      description: 'Template for shipping notifications with tracking info',
      elements: [
        {
          id: 'header_2',
          type: 'header',
          content: { title: 'Order Shipped', company: 'The Sport House' },
          styling: { backgroundColor: '#ecfdf5', textColor: '#065f46', padding: 16 },
          position: 0,
        },
        {
          id: 'content_2',
          type: 'content',
          content: { title: 'Tracking Information', text: 'Your order is on its way! Track your package using the information below.' },
          styling: { backgroundColor: '#ffffff', textColor: '#374151', padding: 12 },
          position: 1,
        },
        {
          id: 'custom_text_1',
          type: 'custom-text',
          content: { text: 'Tracking Number: TSH123456789' },
          styling: { backgroundColor: '#f3f4f6', textColor: '#1f2937', padding: 8, fontWeight: 'semibold' },
          position: 2,
        }
      ],
      globalStyling: {
        primaryColor: '#10b981',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#3b82f6',
        borderRadius: 12,
        fontFamily: 'Inter, sans-serif',
      },
    }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<TicketTemplate | null>(null);

  const handleSaveTemplate = (template: TicketTemplate) => {
    setTemplates(prev => {
      const existingIndex = prev.findIndex(t => t.id === template.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = template;
        return updated;
      } else {
        return [...prev, template];
      }
    });
    
    // Save to localStorage for persistence
    const updatedTemplates = templates.map(t => t.id === template.id ? template : t);
    if (!templates.find(t => t.id === template.id)) {
      updatedTemplates.push(template);
    }
    localStorage.setItem('ticketTemplates', JSON.stringify(updatedTemplates));
    
    setCurrentView('list');
    setSelectedTemplate(null);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setCurrentView('create');
  };

  const handleEditTemplate = (template: TicketTemplate) => {
    setSelectedTemplate(template);
    setCurrentView('edit');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    if (selectedTemplate?.id === templateId) {
      setSelectedTemplate(null);
    }
  };

  if (currentView === 'create' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50">
        <InteractiveTemplateBuilder
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setCurrentView('list');
            setSelectedTemplate(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-display text-gray-900">Templates</h1>
            <p className="text-body-small text-gray-600 mt-1">Manage your ticket templates</p>
          </div>
          
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleCreateNew}
              className="btn-primary w-full"
            >
              Create New Template
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="card hover:shadow-md transition-all duration-200"
                >
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-body font-medium text-gray-900">{template.name}</h3>
                        <p className="text-body-small text-gray-600 mt-1">{template.description}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="btn-secondary text-caption"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const confirmed = window.confirm('Are you sure you want to delete this template?');
                              if (confirmed) {
                                handleDeleteTemplate(template.id);
                              }
                            }}
                            className="text-caption bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-heading text-gray-900 mb-2">Interactive Template Builder</h3>
              <p className="text-body text-gray-600 mb-4">Create beautiful, customizable ticket templates with drag-and-drop elements and live preview.</p>
              <button
                onClick={handleCreateNew}
                className="btn-primary"
              >
                Start Building
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;