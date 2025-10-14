'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TicketTemplate, TemplateField, Section, TicketStyling, Ticket } from '@/types/ticket';
import { Plus, Trash2, Eye, Save, GripVertical, Type, Calendar, Hash, ToggleLeft, List, AlignLeft } from 'lucide-react';
import TicketCard from './TicketCard';
import { InteractiveTicketPreview } from './InteractiveTicketPreview';
import { DraggableElementsSidebar } from './DraggableElementsSidebar';

interface TemplateBuilderProps {
  onSave: (template: TicketTemplate) => void;
  initialTemplate?: TicketTemplate;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ onSave, initialTemplate }) => {
  const [template, setTemplate] = useState<Partial<TicketTemplate>>(
    initialTemplate || {
      name: '',
      description: '',
      category: Section.ORDERS,
      fields: [],
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#3b82f6',
        borderRadius: 12,
        showCompanyLogo: true,
        showUnreadIndicator: true,
      }
    }
  );

  const [previewData, setPreviewData] = useState({
    companyName: 'Voorbeeld Bedrijf',
    title: 'Voorbeeld Ticket Titel',
    statusUpdate: 'Dit is een voorbeeld status update',
    isRead: false
  });

  const [draggedField, setDraggedField] = useState<TemplateField | null>(null);

  const fieldTypes = [
    { type: 'text', label: 'Tekst', icon: Type },
    { type: 'textarea', label: 'Tekst Gebied', icon: AlignLeft },
    { type: 'select', label: 'Selectie', icon: List },
    { type: 'date', label: 'Datum', icon: Calendar },
    { type: 'number', label: 'Nummer', icon: Hash },
    { type: 'boolean', label: 'Ja/Nee', icon: ToggleLeft },
  ];

  const addField = (type: string) => {
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      name: `field_${(template.fields?.length || 0) + 1}`,
      label: `Nieuw ${fieldTypes.find(ft => ft.type === type)?.label || 'Veld'}`,
      type: type as any,
      required: false,
      placeholder: 'Voer waarde in...'
    };

    setTemplate(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<TemplateField>) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields?.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      ) || []
    }));
  };

  const removeField = (fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== fieldId) || []
    }));
  };

  const moveField = (dragIndex: number, dropIndex: number) => {
    if (!template.fields) return;
    
    const draggedField = template.fields[dragIndex];
    const newFields = [...template.fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);
    
    setTemplate(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const updateStyling = (updates: Partial<TicketStyling>) => {
    setTemplate(prev => ({
      ...prev,
      styling: { ...prev.styling!, ...updates }
    }));
  };

  const handleSave = () => {
    if (!template.name || !template.description) {
      alert('Vul alle verplichte velden in');
      return;
    }

    const completeTemplate: TicketTemplate = {
      id: initialTemplate?.id || `template_${Date.now()}`,
      name: template.name!,
      description: template.description!,
      category: template.category!,
      fields: template.fields || [],
      styling: template.styling!,
      createdAt: initialTemplate?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(completeTemplate);
  };

  // Generate preview ticket
  const previewTicket: Ticket = {
    id: 'preview',
    sender: 'preview@example.com',
    title: previewData.title,
    date: new Date(),
    statusUpdate: previewData.statusUpdate,
    contentSummary: 'Dit is een voorbeeld van hoe uw ticket eruit zal zien.',
    section: template.category!,
    isRead: previewData.isRead,
    companyName: previewData.companyName,
    iconPath: '/logos/default.png',
    senderAvatar: null
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Template Builder</h1>
        <p className="text-gray-600">Ontwerp aangepaste tickets voor orderbevestigingen en andere use cases.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Configuration */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Template Configuratie</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Naam *
                </label>
                <input
                  type="text"
                  value={template.name || ''}
                  onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bijv. Bestelling Bevestiging"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschrijving *
                </label>
                <textarea
                  value={template.description || ''}
                  onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Beschrijf waarvoor dit template wordt gebruikt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categorie
                </label>
                <select
                  value={template.category}
                  onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value as Section }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(Section).map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Field Types Palette */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Veld Typen</h3>
            <div className="grid grid-cols-2 gap-3">
              {fieldTypes.map((fieldType) => {
                const IconComponent = fieldType.icon;
                return (
                  <button
                    key={fieldType.type}
                    onClick={() => addField(fieldType.type)}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Fields */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Template Velden</h3>

            <div className="space-y-4">
              {template.fields?.map((field, index) => (
                <div 
                  key={field.id} 
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  draggable
                  onDragStart={() => setDraggedField(field)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedField) {
                      const dragIndex = template.fields?.findIndex(f => f.id === draggedField.id) || 0;
                      moveField(dragIndex, index);
                      setDraggedField(null);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      <span className="font-medium text-gray-900">Veld {index + 1}</span>
                    </div>
                    <button
                      onClick={() => removeField(field.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {fieldTypes.map(ft => (
                          <option key={ft.type} value={ft.type}>{ft.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Verplicht</span>
                      </label>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opties (gescheiden door komma's)
                      </label>
                      <input
                        type="text"
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => updateField(field.id, { 
                          options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optie 1, Optie 2, Optie 3"
                      />
                    </div>
                  )}
                </div>
              ))}

              {(!template.fields || template.fields.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>Geen velden toegevoegd. Klik op een veld type hierboven om te beginnen.</p>
                </div>
              )}
            </div>
          </div>

          {/* Styling Options */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Styling</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achtergrondkleur
                  </label>
                  <input
                    type="color"
                    value={template.styling?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accent Kleur
                  </label>
                  <input
                    type="color"
                    value={template.styling?.accentColor || '#3b82f6'}
                    onChange={(e) => updateStyling({ accentColor: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Border Radius
                </label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={template.styling?.borderRadius || 12}
                  onChange={(e) => updateStyling({ borderRadius: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{template.styling?.borderRadius || 12}px</span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.styling?.showCompanyLogo || false}
                    onChange={(e) => updateStyling({ showCompanyLogo: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Toon bedrijfslogo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.styling?.showUnreadIndicator || false}
                    onChange={(e) => updateStyling({ showUnreadIndicator: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Toon ongelezen indicator</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {/* Preview Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Preview Instellingen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrijfsnaam
                </label>
                <input
                  type="text"
                  value={previewData.companyName}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ticket Titel
                </label>
                <input
                  type="text"
                  value={previewData.title}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Update
                </label>
                <input
                  type="text"
                  value={previewData.statusUpdate}
                  onChange={(e) => setPreviewData(prev => ({ ...prev, statusUpdate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={previewData.isRead}
                    onChange={(e) => setPreviewData(prev => ({ ...prev, isRead: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Gelezen status</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ticket Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Ticket Preview
            </h3>
            
            <div className="flex justify-center">
              <TicketCard 
                ticket={previewTicket}
                enhancedShadow={true}
              />
            </div>
          </div>

          {/* Template Fields Preview */}
          {template.fields && template.fields.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-4">Template Velden Preview</h3>
              
              <div className="space-y-3">
                {template.fields.map((field) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecteer...</option>
                        {field.options?.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : field.type === 'boolean' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{field.placeholder || 'Ja/Nee'}</span>
                      </div>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-5 h-5" />
              Template Opslaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { TemplateBuilder };