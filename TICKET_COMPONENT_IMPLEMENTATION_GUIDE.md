# Beeylo Admin Dashboard - Ticket Template Designer

## 📋 Overview

This document provides complete code and instructions for building the **Beeylo Admin Dashboard** - a clickable prototype where companies can design and customize how their tickets will appear to end users in the Beeylo app. This includes an interactive template builder for creating custom ticket designs for order confirmations, support messages, and other business communications.

**Note**: This is a prototype implementation focused on UI/UX demonstration. No backend integration or data persistence is required at this stage.

## 🎯 Target Ticket Design Specifications

### Key Design Elements for Admin Dashboard
- **Card Layout**: White background with subtle shadow and rounded corners (12px)
- **Dimensions**: 250px width × 145px height (fixed width, responsive height)
- **Unread Indicator**: Yellow dot (8px) for unread tickets
- **Company Avatar**: 32px circular avatar with fallback to company initial
- **Typography**: Bold company name, medium title, light description
- **Icons**: Section-based icons (package, calendar, euro, info)
- **Colors**: Section-specific color coding
- **Customizable Elements**: Companies can modify colors, fonts, layout, and content through the admin dashboard

### Data Structure
```typescript
interface Ticket {
  id: string;
  sender: string;
  title: string;
  date: Date;
  statusUpdate?: string;
  contentSummary: string;
  timeline?: Array<{[key: string]: any}>;
  actions?: Array<{[key: string]: any}>;
  section: Section;
  isRead: boolean;
  companyName: string;
  iconPath: string;
  senderAvatar?: string;
  originalEmailContent?: string;
}

enum Section {
  ACTION = 'Acties',
  ORDERS = 'Bestellingen',
  APPOINTMENTS = 'Afspraken',
  SUPPORT = 'Support',
  GENERAL = 'Algemeen'
}
```

## 🚀 Next.js Implementation

### 1. TypeScript Types and Interfaces

```typescript
// types/ticket.ts
export interface Ticket {
  id: string;
  sender: string;
  title: string;
  date: Date;
  statusUpdate?: string;
  contentSummary: string;
  timeline?: Array<{[key: string]: any}>;
  actions?: Array<{[key: string]: any}>;
  section: Section;
  isRead: boolean;
  companyName: string;
  iconPath: string;
  senderAvatar?: string;
  originalEmailContent?: string;
}

export enum Section {
  ACTION = 'Acties',
  ORDERS = 'Bestellingen',
  APPOINTMENTS = 'Afspraken',
  SUPPORT = 'Support',
  GENERAL = 'Algemeen'
}

export interface TicketTemplate {
  id: string;
  name: string;
  description: string;
  category: Section;
  fields: TemplateField[];
  styling: TicketStyling;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'boolean';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  defaultValue?: any;
}

export interface TicketStyling {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  showCompanyLogo: boolean;
  showUnreadIndicator: boolean;
  customIcon?: string;
}
```

### 2. Ticket Component (React + Tailwind CSS)

```tsx
// components/TicketCard.tsx
import React from 'react';
import { Ticket, Section } from '@/types/ticket';
import { Package, Calendar, Euro, Info, Circle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  isFullWidth?: boolean;
  enhancedShadow?: boolean;
  onTicketClick?: (ticket: Ticket) => void;
  onCompanyClick?: (companyName: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  isFullWidth = false,
  enhancedShadow = false,
  onTicketClick,
  onCompanyClick
}) => {
  const getSectionIcon = (section: Section) => {
    switch (section) {
      case Section.ORDERS:
        return <Package className="w-4 h-4" />;
      case Section.APPOINTMENTS:
        return <Calendar className="w-4 h-4" />;
      case Section.ACTION:
        return <Euro className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSectionColor = (section: Section) => {
    switch (section) {
      case Section.ORDERS:
        return 'text-purple-600';
      case Section.APPOINTMENTS:
        return 'text-green-600';
      case Section.ACTION:
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCompanyInitial = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div
      className={`
        ${isFullWidth ? 'w-full' : 'w-[250px]'} 
        h-[145px] 
        bg-white 
        rounded-xl 
        ${enhancedShadow 
          ? 'shadow-lg shadow-black/10' 
          : 'shadow-md shadow-black/5'
        }
        hover:shadow-lg 
        transition-all 
        duration-200 
        cursor-pointer 
        border 
        border-gray-100
      `}
      onClick={() => onTicketClick?.(ticket)}
    >
      <div className="p-3.5 h-full flex flex-col">
        {/* Company Header */}
        <div 
          className="flex items-center gap-3 mb-2.5"
          onClick={(e) => {
            e.stopPropagation();
            onCompanyClick?.(ticket.companyName);
          }}
        >
          {/* Company Avatar */}
          <div className="relative">
            {ticket.senderAvatar ? (
              <img
                src={ticket.senderAvatar}
                alt={ticket.companyName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {getCompanyInitial(ticket.companyName)}
                </span>
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="flex-1 min-w-0">
            <p className={`
              text-base 
              ${!ticket.isRead ? 'font-bold' : 'font-medium'} 
              text-gray-900 
              truncate
            `}>
              {ticket.companyName}
            </p>
          </div>

          {/* Unread Indicator */}
          {!ticket.isRead && (
            <Circle className="w-2 h-2 fill-yellow-400 text-yellow-400" />
          )}
        </div>

        {/* Ticket Title */}
        <div className="mb-2">
          <h3 className={`
            text-base 
            ${!ticket.isRead ? 'font-semibold' : 'font-normal'} 
            text-gray-900 
            line-clamp-1
          `}>
            {ticket.title}
          </h3>
        </div>

        {/* Status/Description Row */}
        <div className="flex items-start gap-2 mt-auto">
          <div className={getSectionColor(ticket.section)}>
            {getSectionIcon(ticket.section)}
          </div>
          <p className="text-sm text-gray-600 font-normal line-clamp-1 flex-1">
            {ticket.statusUpdate || ticket.contentSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
```

### 3. CSS Styles (Tailwind Configuration)

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beeylo: {
          yellow: '#F1BB4B',
          purple: '#8E24AA',
          blue: '#1976D2',
          green: '#388E3C',
          orange: '#FF6F00',
        }
      },
      boxShadow: {
        'ticket': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'ticket-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'ticket-enhanced': '0 4px 16px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
```

### 4. Mock Data for Development

```typescript
// data/mockTickets.ts
import { Ticket, Section } from '@/types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    sender: 'orders@coolblue.nl',
    title: 'Je bestelling is onderweg!',
    date: new Date('2024-01-15T10:30:00'),
    statusUpdate: 'Pakket wordt vandaag bezorgd',
    contentSummary: 'Uw bestelling #CB123456 is onderweg en wordt vandaag tussen 14:00-18:00 bezorgd.',
    section: Section.ORDERS,
    isRead: false,
    companyName: 'Coolblue',
    iconPath: '/logos/coolblue.png',
    senderAvatar: null,
    timeline: [
      { type: 'ordered', date: '2024-01-13', description: 'Bestelling geplaatst' },
      { type: 'shipped', date: '2024-01-14', description: 'Verzonden' },
      { type: 'delivery', date: '2024-01-15', description: 'Onderweg' }
    ],
    actions: [
      { type: 'track', label: 'Track pakket', url: 'https://track.coolblue.nl/123456' },
      { type: 'contact', label: 'Contact opnemen', url: 'mailto:support@coolblue.nl' }
    ]
  },
  {
    id: '2',
    sender: 'appointments@tandartspraktijk.nl',
    title: 'Herinnering: Afspraak morgen om 14:00',
    date: new Date('2024-01-14T16:45:00'),
    statusUpdate: 'Afspraak bevestigd voor morgen',
    contentSummary: 'Herinnering voor uw tandarts afspraak morgen om 14:00 bij Tandartspraktijk Centrum.',
    section: Section.APPOINTMENTS,
    isRead: true,
    companyName: 'Tandartspraktijk Centrum',
    iconPath: '/logos/tandarts.png',
    senderAvatar: null,
    timeline: [
      { type: 'scheduled', date: '2024-01-10', description: 'Afspraak ingepland' },
      { type: 'reminder', date: '2024-01-14', description: 'Herinnering verstuurd' }
    ],
    actions: [
      { type: 'confirm', label: 'Bevestigen', action: 'confirm_appointment' },
      { type: 'reschedule', label: 'Verzetten', action: 'reschedule_appointment' }
    ]
  },
  {
    id: '3',
    sender: 'billing@spotify.com',
    title: 'Spotify Premium - Factuur december',
    date: new Date('2024-01-01T09:00:00'),
    statusUpdate: 'Betaling succesvol verwerkt',
    contentSummary: 'Uw maandelijkse Spotify Premium factuur voor december 2023 is betaald.',
    section: Section.ACTION,
    isRead: false,
    companyName: 'Spotify',
    iconPath: '/logos/spotify.png',
    senderAvatar: null,
    timeline: [
      { type: 'generated', date: '2024-01-01', description: 'Factuur gegenereerd' },
      { type: 'paid', date: '2024-01-01', description: 'Betaling verwerkt' }
    ],
    actions: [
      { type: 'download', label: 'Download factuur', url: '/invoices/spotify-dec-2023.pdf' },
      { type: 'support', label: 'Vragen over factuur', url: 'https://support.spotify.com' }
    ]
  }
];
```

## 🎨 Interactive Template Builder with Live Preview

### Overview
This section provides a comprehensive interactive template builder designed specifically for **company administrators** in the Beeylo admin dashboard. It allows companies to:

- **Design Custom Ticket Layouts**: Create branded ticket templates that reflect their company identity
- **Real-Time Preview**: See exactly how tickets will appear to end users in the Beeylo app
- **Drag-and-Drop Interface**: Intuitive visual editor requiring no technical knowledge
- **Brand Customization**: Apply company colors, logos, fonts, and styling preferences
- **Template Management**: Save, edit, and organize multiple ticket templates for different use cases
- **User-Friendly Controls**: Simplified interface designed for business users, not developers

This tool empowers companies to maintain brand consistency across all customer communications while ensuring tickets are visually appealing and informative for their end users.

### 1. Interactive Template Builder Component

```tsx
// components/InteractiveTemplateBuilder.tsx
import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Plus, Trash2, Eye, Save, Move, Palette, Type, 
  Image, DollarSign, Package, Minus, Settings,
  ChevronDown, ChevronUp, Edit3, Copy
} from 'lucide-react';

// Types for the interactive builder
interface TemplateElement {
  id: string;
  type: 'header' | 'content' | 'order-item' | 'shipping' | 'divider' | 'logo' | 'custom-text';
  content: any;
  styling: ElementStyling;
  position: number;
}

interface ElementStyling {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'semibold';
  padding?: number;
  margin?: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  alignment?: 'left' | 'center' | 'right';
  width?: string;
  height?: string;
}

interface TicketTemplate {
  id: string;
  name: string;
  description: string;
  elements: TemplateElement[];
  globalStyling: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    borderRadius: number;
    fontFamily: string;
  };
}

// Draggable component library item
const DraggableComponent: React.FC<{
  type: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}> = ({ type, icon, label, description }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

// Droppable preview area
const DropZone: React.FC<{
  elements: TemplateElement[];
  onDrop: (item: any, index: number) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (element: TemplateElement) => void;
  onDelete: (elementId: string) => void;
  globalStyling: any;
}> = ({ elements, onDrop, onReorder, onEdit, onDelete, globalStyling }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;
      onDrop(item, elements.length);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-96 p-6 bg-gray-50 border-2 border-dashed rounded-lg transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
      }`}
      style={{ backgroundColor: globalStyling.backgroundColor }}
    >
      <div className="space-y-4">
        {elements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Drop components here</p>
            <p className="text-sm">Drag elements from the component library to build your template</p>
          </div>
        ) : (
          elements.map((element, index) => (
            <TemplateElementPreview
              key={element.id}
              element={element}
              index={index}
              onReorder={onReorder}
              onEdit={onEdit}
              onDelete={onDelete}
              globalStyling={globalStyling}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Individual template element preview
const TemplateElementPreview: React.FC<{
  element: TemplateElement;
  index: number;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (element: TemplateElement) => void;
  onDelete: (elementId: string) => void;
  globalStyling: any;
}> = ({ element, index, onReorder, onEdit, onDelete, globalStyling }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: 'element',
    hover: (item: any) => {
      if (item.index !== index) {
        onReorder(item.index, index);
        item.index = index;
      }
    },
  }));

  const renderElementContent = () => {
    const style = {
      backgroundColor: element.styling.backgroundColor || globalStyling.backgroundColor,
      color: element.styling.textColor || globalStyling.textColor,
      fontSize: element.styling.fontSize ? `${element.styling.fontSize}px` : undefined,
      fontWeight: element.styling.fontWeight,
      padding: element.styling.padding ? `${element.styling.padding}px` : '12px',
      margin: element.styling.margin ? `${element.styling.margin}px` : '0',
      borderRadius: element.styling.borderRadius ? `${element.styling.borderRadius}px` : `${globalStyling.borderRadius}px`,
      borderColor: element.styling.borderColor,
      borderWidth: element.styling.borderWidth ? `${element.styling.borderWidth}px` : undefined,
      textAlign: element.styling.alignment as any,
      width: element.styling.width,
      height: element.styling.height,
    };

    switch (element.type) {
      case 'header':
        return (
          <div style={style} className="bg-white rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">AB</span>
              </div>
              <div>
                <h3 className="font-semibold">{element.content.title || 'Ticket Title'}</h3>
                <p className="text-sm text-gray-600">{element.content.company || 'Company Name'}</p>
              </div>
            </div>
          </div>
        );
      
      case 'content':
        return (
          <div style={style} className="bg-white rounded-lg shadow-sm border">
            <h4 className="font-medium mb-2">{element.content.title || 'Content Section'}</h4>
            <p className="text-gray-700">{element.content.text || 'This is sample content text that would appear in the ticket.'}</p>
          </div>
        );
      
      case 'order-item':
        return (
          <div style={style} className="bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{element.content.name || 'Product Name'}</p>
                  <p className="text-sm text-gray-600">Qty: {element.content.quantity || '1'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{element.content.price || '€29.99'}</p>
              </div>
            </div>
          </div>
        );
      
      case 'shipping':
        return (
          <div style={style} className="bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-medium">{element.content.label || 'Shipping Cost'}</span>
              </div>
              <span className="font-semibold text-green-600">{element.content.amount || '€4.99'}</span>
            </div>
          </div>
        );
      
      case 'divider':
        return (
          <div style={style}>
            <hr 
              className="border-t" 
              style={{ 
                borderColor: element.styling.borderColor || globalStyling.primaryColor,
                borderWidth: element.styling.borderWidth || 1
              }} 
            />
          </div>
        );
      
      case 'logo':
        return (
          <div style={style} className="flex justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <Image className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        );
      
      case 'custom-text':
        return (
          <div style={style} className="bg-white rounded-lg shadow-sm border">
            <p>{element.content.text || 'Custom text content'}</p>
          </div>
        );
      
      default:
        return <div style={style}>Unknown element type</div>;
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
    >
      {renderElementContent()}
      
      {/* Element controls overlay */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(element)}
            className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="Edit element"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(element.id)}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="Delete element"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="p-1 bg-gray-600 text-white rounded cursor-move" title="Drag to reorder">
            <Move className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Element editing modal
const ElementEditor: React.FC<{
  element: TemplateElement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (element: TemplateElement) => void;
}> = ({ element, isOpen, onClose, onSave }) => {
  const [editedElement, setEditedElement] = useState<TemplateElement | null>(element);

  React.useEffect(() => {
    setEditedElement(element);
  }, [element]);

  if (!isOpen || !editedElement) return null;

  const updateContent = (updates: any) => {
    setEditedElement(prev => prev ? {
      ...prev,
      content: { ...prev.content, ...updates }
    } : null);
  };

  const updateStyling = (updates: Partial<ElementStyling>) => {
    setEditedElement(prev => prev ? {
      ...prev,
      styling: { ...prev.styling, ...updates }
    } : null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Edit Element</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Content Settings */}
          <div>
            <h4 className="font-medium mb-3">Content</h4>
            <div className="space-y-3">
              {editedElement.type === 'header' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={editedElement.content.title || ''}
                      onChange={(e) => updateContent({ title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      value={editedElement.content.company || ''}
                      onChange={(e) => updateContent({ company: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </>
              )}

              {editedElement.type === 'content' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      value={editedElement.content.title || ''}
                      onChange={(e) => updateContent({ title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea
                      value={editedElement.content.text || ''}
                      onChange={(e) => updateContent({ text: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {editedElement.type === 'order-item' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editedElement.content.name || ''}
                      onChange={(e) => updateContent({ name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input
                        type="number"
                        value={editedElement.content.quantity || 1}
                        onChange={(e) => updateContent({ quantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="text"
                        value={editedElement.content.price || ''}
                        onChange={(e) => updateContent({ price: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </>
              )}

              {editedElement.type === 'shipping' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={editedElement.content.label || ''}
                      onChange={(e) => updateContent({ label: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="text"
                      value={editedElement.content.amount || ''}
                      onChange={(e) => updateContent({ amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </>
              )}

              {editedElement.type === 'custom-text' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Text</label>
                  <textarea
                    value={editedElement.content.text || ''}
                    onChange={(e) => updateContent({ text: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Styling Settings */}
          <div>
            <h4 className="font-medium mb-3">Styling</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={editedElement.styling.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyling({ backgroundColor: e.target.value })}
                  className="w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={editedElement.styling.textColor || '#000000'}
                  onChange={(e) => updateStyling({ textColor: e.target.value })}
                  className="w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="number"
                  value={editedElement.styling.fontSize || 14}
                  onChange={(e) => updateStyling({ fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="8"
                  max="48"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Weight</label>
                <select
                  value={editedElement.styling.fontWeight || 'normal'}
                  onChange={(e) => updateStyling({ fontWeight: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="normal">Normal</option>
                  <option value="semibold">Semibold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Padding</label>
                <input
                  type="number"
                  value={editedElement.styling.padding || 12}
                  onChange={(e) => updateStyling({ padding: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  max="48"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Border Radius</label>
                <input
                  type="number"
                  value={editedElement.styling.borderRadius || 8}
                  onChange={(e) => updateStyling({ borderRadius: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md"
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Alignment</label>
                <select
                  value={editedElement.styling.alignment || 'left'}
                  onChange={(e) => updateStyling({ alignment: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(editedElement);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Interactive Template Builder
const InteractiveTemplateBuilder: React.FC<{
  onSave: (template: TicketTemplate) => void;
  initialTemplate?: TicketTemplate;
}> = ({ onSave, initialTemplate }) => {
  const [template, setTemplate] = useState<TicketTemplate>(
    initialTemplate || {
      id: `template_${Date.now()}`,
      name: '',
      description: '',
      elements: [],
      globalStyling: {
        primaryColor: '#3b82f6',
        secondaryColor: '#6b7280',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#10b981',
        borderRadius: 8,
        fontFamily: 'Inter, sans-serif',
      },
    }
  );

  const [editingElement, setEditingElement] = useState<TemplateElement | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const componentLibrary = [
    {
      type: 'header',
      icon: <Type className="w-5 h-5 text-blue-600" />,
      label: 'Ticket Header',
      description: 'Customer name and ticket title display'
    },
    {
      type: 'content',
      icon: <Edit3 className="w-5 h-5 text-green-600" />,
      label: 'Information Block',
      description: 'Customer message or ticket details'
    },
    {
      type: 'order-item',
      icon: <Package className="w-5 h-5 text-purple-600" />,
      label: 'Product Line',
      description: 'Individual product with pricing'
    },
    {
      type: 'shipping',
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      label: 'Cost Line',
      description: 'Shipping, taxes, or additional charges'
    },
    {
      type: 'divider',
      icon: <Minus className="w-5 h-5 text-gray-600" />,
      label: 'Section Break',
      description: 'Visual line to separate content areas'
    },
    {
      type: 'logo',
      icon: <Image className="w-5 h-5 text-indigo-600" />,
      label: 'Company Logo',
      description: 'Company or brand logo'
    },
    {
      type: 'custom-text',
      icon: <Type className="w-5 h-5 text-orange-600" />,
      label: 'Custom Message',
      description: 'Add your own text or instructions'
    },
  ];

  const handleDrop = useCallback((item: any, index: number) => {
    const newElement: TemplateElement = {
      id: `element_${Date.now()}`,
      type: item.type,
      content: getDefaultContent(item.type),
      styling: {},
      position: index,
    };

    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements.slice(0, index), newElement, ...prev.elements.slice(index)]
        .map((el, i) => ({ ...el, position: i }))
    }));
  }, []);

  const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setTemplate(prev => {
      const newElements = [...prev.elements];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, draggedElement);
      return {
        ...prev,
        elements: newElements.map((el, i) => ({ ...el, position: i }))
      };
    });
  }, []);

  const handleEdit = (element: TemplateElement) => {
    setEditingElement(element);
    setIsEditorOpen(true);
  };

  const handleSaveElement = (updatedElement: TemplateElement) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    }));
  };

  const handleDelete = (elementId: string) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
        .map((el, i) => ({ ...el, position: i }))
    }));
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'header':
        return { title: 'New Ticket', company: 'Company Name' };
      case 'content':
        return { title: 'Content Title', text: 'Content description...' };
      case 'order-item':
        return { name: 'Product Name', quantity: 1, price: '€0.00' };
      case 'shipping':
        return { label: 'Shipping', amount: '€0.00' };
      case 'custom-text':
        return { text: 'Custom text content' };
      default:
        return {};
    }
  };

  const handleSave = () => {
    if (!template.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    onSave(template);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Building Blocks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Building Blocks</h3>
              <div className="space-y-3">
                {componentLibrary.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    type={component.type}
                    icon={component.icon}
                    label={component.label}
                    description={component.description}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Template Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Template Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter template name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={template.description}
                    onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                    placeholder="Describe this template..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <DropZone
                elements={template.elements}
                onDrop={handleDrop}
                onReorder={handleReorder}
                onEdit={handleEdit}
                onDelete={handleDelete}
                globalStyling={template.globalStyling}
              />
            </div>
          </div>

          {/* Brand Colors Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={template.globalStyling.primaryColor}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      globalStyling: { ...prev.globalStyling, primaryColor: e.target.value }
                    }))}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input
                    type="color"
                    value={template.globalStyling.backgroundColor}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      globalStyling: { ...prev.globalStyling, backgroundColor: e.target.value }
                    }))}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input
                    type="color"
                    value={template.globalStyling.textColor}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      globalStyling: { ...prev.globalStyling, textColor: e.target.value }
                    }))}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={template.globalStyling.accentColor}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      globalStyling: { ...prev.globalStyling, accentColor: e.target.value }
                    }))}
                    className="w-full h-10 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Border Radius</label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={template.globalStyling.borderRadius}
                    onChange={(e) => setTemplate(prev => ({
                      ...prev,
                      globalStyling: { ...prev.globalStyling, borderRadius: parseInt(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{template.globalStyling.borderRadius}px</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                Save Template
              </button>
            </div>
          </div>
        </div>

        {/* Element Editor Modal */}
        <ElementEditor
          element={editingElement}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingElement(null);
          }}
          onSave={handleSaveElement}
        />
      </div>
    </DndProvider>
  );
};

export default InteractiveTemplateBuilder;
```

### 2. Design System Specifications

For the admin dashboard prototype, here are the key design specifications that companies can customize:

```css
/* CSS Custom Properties for Dynamic Theming */
:root {
  /* Primary Color Palette */
  --ticket-primary: #3B82F6;
  --ticket-secondary: #6B7280;
  --ticket-background: #FAFAFA;
  --ticket-card-bg: #FFFFFF;
  --ticket-text-primary: #1F2937;
  --ticket-text-secondary: #6B7280;
  --ticket-accent: #10B981;
  --ticket-border: #E5E7EB;
  --ticket-divider: #D1D5DB;
  
  /* Typography Scale */
  --ticket-font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
  --ticket-text-xs: 12px;
  --ticket-text-sm: 14px;
  --ticket-text-base: 16px;
  --ticket-text-lg: 18px;
  --ticket-text-xl: 20px;
  
  /* Spacing System */
  --ticket-spacing-xs: 4px;
  --ticket-spacing-sm: 8px;
  --ticket-spacing-md: 12px;
  --ticket-spacing-lg: 16px;
  --ticket-spacing-xl: 20px;
  --ticket-spacing-2xl: 24px;
  
  /* Border Radius */
  --ticket-radius-sm: 6px;
  --ticket-radius-md: 8px;
  --ticket-radius-lg: 12px;
  --ticket-radius-xl: 16px;
  
  /* Shadows */
  --ticket-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --ticket-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --ticket-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Customizable Ticket Styles */
.ticket-card {
  background: var(--ticket-card-bg);
  border: 1px solid var(--ticket-border);
  border-radius: var(--ticket-radius-lg);
  box-shadow: var(--ticket-shadow-md);
  padding: var(--ticket-spacing-lg);
  font-family: var(--ticket-font-family);
}

.ticket-header {
  font-size: var(--ticket-text-lg);
  font-weight: 600;
  color: var(--ticket-text-primary);
  margin-bottom: var(--ticket-spacing-md);
}

.ticket-company {
  font-size: var(--ticket-text-sm);
  color: var(--ticket-text-secondary);
  margin-bottom: var(--ticket-spacing-sm);
}

.ticket-content {
  font-size: var(--ticket-text-base);
  color: var(--ticket-text-primary);
  line-height: 1.5;
}

.ticket-price {
  font-size: var(--ticket-text-base);
  font-weight: 600;
  color: var(--ticket-text-primary);
}

.ticket-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--ticket-radius-md);
  border: 1px solid var(--ticket-border);
}

.ticket-divider {
  height: 1px;
  background: var(--ticket-divider);
  margin: var(--ticket-spacing-lg) 0;
}
```

### 3. Component Integration Example

```tsx
// pages/templates/create-interactive.tsx
import React from 'react';
import { useRouter } from 'next/router';
import InteractiveTemplateBuilder from '@/components/InteractiveTemplateBuilder';

const InteractiveTemplateCreationPage: React.FC = () => {
  const router = useRouter();

  const handleSaveTemplate = (template: any) => {
    console.log('Saving interactive template:', template);
    
    // For prototype: Save to localStorage (in production, this would connect to backend)
    const existingTemplates = JSON.parse(localStorage.getItem('interactiveTemplates') || '[]');
    const updatedTemplates = [...existingTemplates, template];
    localStorage.setItem('interactiveTemplates', JSON.stringify(updatedTemplates));
    
    alert('Interactive template saved successfully!');
    router.push('/templates');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interactive Template Builder</h1>
              <p className="text-gray-600 mt-1">
                Create custom ticket templates with drag-and-drop functionality
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <InteractiveTemplateBuilder onSave={handleSaveTemplate} />
    </div>
  );
};

export default InteractiveTemplateCreationPage;
```

### 4. Required Dependencies

```json
{
  "dependencies": {
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "lucide-react": "^0.263.1",
    "@tailwindcss/line-clamp": "^0.4.4"
  }
}
```

### 5. Key Features for Company Administrators

- **No-Code Template Builder**: Intuitive drag-and-drop interface requiring zero technical knowledge
- **Brand Consistency**: Apply company logos, colors, and fonts to maintain brand identity
- **Live Customer Preview**: See exactly how tickets will appear to your customers in real-time
- **Business-Focused Components**: Pre-built elements for orders, appointments, support, shipping, and more
- **Template Library**: Save and organize multiple templates for different business scenarios
- **User-Friendly Controls**: Simple point-and-click customization designed for business users
- **Instant Feedback**: Real-time preview updates as you make changes
- **Professional Results**: Create polished, branded ticket designs without design expertise
- **Multi-Device Ready**: Templates work seamlessly across desktop, tablet, and mobile devices
- **Easy Template Management**: Duplicate, edit, and organize templates with simple controls



## Ticket Detail Page Implementation

### Overview
The ticket detail page provides a comprehensive view of individual tickets with sections for content, timeline, actions, and feedback. It includes a live preview system for template customization.

### Layout Structure
```typescript
// components/TicketDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { Ticket, TimelineStep, TicketTemplate } from '../types/ticket';

interface TicketDetailPageProps {
  ticket: Ticket;
  template?: TicketTemplate;
  isPreviewMode?: boolean;
  onTemplateUpdate?: (template: TicketTemplate) => void;
}

export const TicketDetailPage: React.FC<TicketDetailPageProps> = ({
  ticket,
  template,
  isPreviewMode = false,
  onTemplateUpdate
}) => {
  const [isOriginalExpanded, setIsOriginalExpanded] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with company info */}
      <TicketDetailHeader ticket={ticket} />
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto">
        {/* Ticket content section */}
        <TicketContentSection ticket={ticket} template={template} />
        
        <div className="px-4 space-y-4">
          {/* Content summary card */}
          <ContentSummaryCard ticket={ticket} />
          
          {/* Original content card (collapsible) */}
          {ticket.originalEmailContent && (
            <OriginalContentCard 
              content={ticket.originalEmailContent}
              isExpanded={isOriginalExpanded}
              onToggle={() => setIsOriginalExpanded(!isOriginalExpanded)}
            />
          )}
          
          {/* Timeline card */}
          <TimelineCard timeline={ticket.timeline} />
          
          {/* Actions card */}
          <ActionsCard actions={ticket.actions} />
          
          {/* Feedback card */}
          <FeedbackCard 
            value={feedbackText}
            onChange={setFeedbackText}
            onSubmit={() => console.log('Feedback submitted:', feedbackText)}
          />
        </div>
      </div>
      
      {/* Live preview panel (if in template mode) */}
      {isPreviewMode && template && (
        <LivePreviewPanel 
          template={template}
          ticket={ticket}
          onUpdate={onTemplateUpdate}
        />
      )}
    </div>
  );
};
```

### Header Component
```typescript
// components/TicketDetailHeader.tsx
interface TicketDetailHeaderProps {
  ticket: Ticket;
  onCompanyClick?: () => void;
}

export const TicketDetailHeader: React.FC<TicketDetailHeaderProps> = ({
  ticket,
  onCompanyClick
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onCompanyClick}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 flex-1 mx-4"
          >
            <SenderAvatar 
              avatarUrl={ticket.senderAvatar}
              senderName={ticket.companyName}
              size={32}
            />
            <span className="text-lg font-semibold text-gray-900 truncate">
              {ticket.companyName}
            </span>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Content Section Component
```typescript
// components/TicketContentSection.tsx
interface TicketContentSectionProps {
  ticket: Ticket;
  template?: TicketTemplate;
}

export const TicketContentSection: React.FC<TicketContentSectionProps> = ({
  ticket,
  template
}) => {
  const getIconForTicket = () => {
    switch (ticket.section) {
      case 'orders': return <PackageIcon className="w-5 h-5" />;
      case 'appointments': return <CalendarIcon className="w-5 h-5" />;
      case 'support': return <HeadphonesIcon className="w-5 h-5" />;
      default: return <InfoIcon className="w-5 h-5" />;
    }
  };

  const getSectionColor = () => {
    switch (ticket.section) {
      case 'orders': return 'text-purple-600';
      case 'appointments': return 'text-green-600';
      case 'support': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white w-full min-h-[120px]">
      <div className="p-5">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {ticket.title}
        </h1>
        
        {/* Status update with icon */}
        {ticket.statusUpdate && (
          <div className="flex items-start space-x-3">
            <div className={getSectionColor()}>
              {getIconForTicket()}
            </div>
            <p className="text-sm font-medium text-gray-800 line-clamp-2 flex-1">
              {ticket.statusUpdate}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Timeline Component
```typescript
// components/TimelineCard.tsx
interface TimelineCardProps {
  timeline?: TimelineStep[];
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ timeline }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!timeline || timeline.length === 0) return null;
  
  const visibleSteps = isExpanded ? timeline : timeline.slice(0, 2);
  const hasMore = timeline.length > 2;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => hasMore && setIsExpanded(!isExpanded)}
      >
        <h3 className="text-base font-bold text-gray-900">Timeline</h3>
        {hasMore && (
          <div className="flex items-center space-x-1 text-gray-500">
            <span className="text-xs font-medium">
              {isExpanded ? 'Show less' : 'Show more'}
            </span>
            <ChevronDownIcon 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-4">
        {visibleSteps.map((step, index) => (
          <TimelineStepItem 
            key={index}
            step={step}
            isLast={index === visibleSteps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

// Timeline step component
interface TimelineStepItemProps {
  step: TimelineStep;
  isLast: boolean;
}

const TimelineStepItem: React.FC<TimelineStepItemProps> = ({ step, isLast }) => {
  const [showEmail, setShowEmail] = useState(false);
  
  return (
    <div className="flex space-x-3">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${
          step.status === 'completed' ? 'bg-green-500' : 
          step.status === 'inProgress' ? 'bg-blue-500' : 'bg-gray-300'
        }`} />
        {!isLast && <div className="w-0.5 h-8 bg-gray-200 mt-1" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
          <span className="text-xs text-gray-500">
            {step.date.toLocaleDateString()}
          </span>
        </div>
        
        {step.emailContent && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {step.emailContent}
          </p>
        )}
        
        {step.originalContent && (
          <button
            onClick={() => setShowEmail(true)}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            View original email
          </button>
        )}
      </div>
      
      {/* Email modal */}
      {showEmail && (
        <EmailModal
          title={step.title}
          content={step.originalContent || ''}
          date={step.date.toLocaleDateString()}
          onClose={() => setShowEmail(false)}
        />
      )}
    </div>
  );
};
```

### Live Preview Panel
```typescript
// components/LivePreviewPanel.tsx
interface LivePreviewPanelProps {
  template: TicketTemplate;
  ticket: Ticket;
  onUpdate?: (template: TicketTemplate) => void;
}

export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  template,
  ticket,
  onUpdate
}) => {
  const [activeSection, setActiveSection] = useState<string>('header');
  
  const updateTemplate = (updates: Partial<TicketTemplate>) => {
    const updatedTemplate = { ...template, ...updates };
    onUpdate?.(updatedTemplate);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <p className="text-sm text-gray-600">Customize ticket appearance</p>
      </div>
      
      <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
        {/* Section selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Section</label>
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="header">Header</option>
            <option value="content">Content</option>
            <option value="timeline">Timeline</option>
            <option value="actions">Actions</option>
          </select>
        </div>
        
        {/* Dynamic controls based on active section */}
        {activeSection === 'header' && (
          <HeaderCustomization 
            template={template}
            onUpdate={updateTemplate}
          />
        )}
        
        {activeSection === 'content' && (
          <ContentCustomization 
            template={template}
            onUpdate={updateTemplate}
          />
        )}
        
        {activeSection === 'timeline' && (
          <TimelineCustomization 
            template={template}
            onUpdate={updateTemplate}
          />
        )}
        
        {activeSection === 'actions' && (
          <ActionsCustomization 
            template={template}
            onUpdate={updateTemplate}
          />
        )}
        
        {/* Preview actions */}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Customization Components
```typescript
// components/customization/HeaderCustomization.tsx
interface HeaderCustomizationProps {
  template: TicketTemplate;
  onUpdate: (updates: Partial<TicketTemplate>) => void;
}

export const HeaderCustomization: React.FC<HeaderCustomizationProps> = ({
  template,
  onUpdate
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Header Settings</h4>
      
      {/* Title styling */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title Font Size
        </label>
        <input
          type="range"
          min="16"
          max="32"
          value={template.styling?.titleFontSize || 20}
          onChange={(e) => onUpdate({
            styling: {
              ...template.styling,
              titleFontSize: parseInt(e.target.value)
            }
          })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">
          {template.styling?.titleFontSize || 20}px
        </span>
      </div>
      
      {/* Background color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Color
        </label>
        <input
          type="color"
          value={template.styling?.backgroundColor || '#ffffff'}
          onChange={(e) => onUpdate({
            styling: {
              ...template.styling,
              backgroundColor: e.target.value
            }
          })}
          className="w-full h-10 rounded border border-gray-300"
        />
      </div>
      
      {/* Show/hide elements */}
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={template.fields?.showCompanyLogo !== false}
            onChange={(e) => onUpdate({
              fields: {
                ...template.fields,
                showCompanyLogo: e.target.checked
              }
            })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Company Logo</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={template.fields?.showStatusUpdate !== false}
            onChange={(e) => onUpdate({
              fields: {
                ...template.fields,
                showStatusUpdate: e.target.checked
              }
            })}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Show Status Update</span>
        </label>
      </div>
    </div>
  );
};
```

### Usage Example
```typescript
// pages/tickets/[id].tsx
import { TicketDetailPage } from '../../components/TicketDetailPage';
import { useState } from 'react';

export default function TicketDetail() {
  const [template, setTemplate] = useState<TicketTemplate | undefined>();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  return (
    <div>
      {/* Toggle preview mode */}
      <button
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        {isPreviewMode ? 'Exit Preview' : 'Customize'}
      </button>
      
      <TicketDetailPage
        ticket={mockTicket}
        template={template}
        isPreviewMode={isPreviewMode}
        onTemplateUpdate={setTemplate}
      />
    </div>
  );
}
```

## 🚀 Next Steps for Admin Dashboard Prototype

1. **Component Integration**: Connect the template builder to your Next.js routing system
2. **Brand Customization**: Allow companies to upload logos and customize color schemes
3. **Template Validation**: Add form validation for required fields and proper formatting
4. **Preview Enhancement**: Implement real-time preview updates as companies customize templates
5. **Template Library**: Create a collection of pre-built templates for different industries
6. **Export Functionality**: Allow companies to export their template configurations
7. **User Experience**: Add tooltips and guided tours for the template builder
8. **Responsive Design**: Ensure the admin dashboard works well on tablets and mobile devices
9. **Template Sharing**: Enable companies to share templates with other departments

## 📋 Prototype Scope

This implementation provides a **clickable prototype** for the Beeylo admin dashboard where companies can:

- **Design Custom Tickets**: Use drag-and-drop functionality to create ticket layouts
- **Live Preview**: See real-time updates as they customize ticket appearance
- **Brand Integration**: Apply company colors, logos, and styling preferences
- **Template Management**: Save, edit, and organize multiple ticket templates
- **User-Friendly Interface**: Intuitive controls for non-technical users

**Note**: This is a UI/UX prototype focused on demonstrating the template creation workflow. No backend integration or data persistence is required at this stage.