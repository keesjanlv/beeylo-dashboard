import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Plus, Trash2, Save, Type,
  DollarSign, Package, Edit3, GripVertical
} from 'lucide-react';
import { TemplateElement, ElementStyling, TicketTemplate, GlobalStyling } from '@/types/ticket';
import TicketPreviewComponent from './TicketPreviewComponent';

// Draggable component library item
const DraggableComponent: React.FC<{
  type: string;
  label: string;
  fieldName: string;
}> = ({ type, label, fieldName }) => {
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
      className={`px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label} = [{fieldName}]</span>
        <Plus className="w-4 h-4 text-gray-400" />
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
  onTextEdit?: (index: number, newContent: string) => void;
}> = ({ element, index, onReorder, onEdit, onDelete, globalStyling, onTextEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.content.text || '');
  
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

  const handleTextClick = () => {
    if (element.content.text !== undefined) {
      setIsEditing(true);
      setEditText(element.content.text);
    }
  };

  const handleTextSave = () => {
    if (onTextEdit) {
      onTextEdit(index, editText);
    }
    setIsEditing(false);
  };

  const handleTextCancel = () => {
    setEditText(element.content.text || '');
    setIsEditing(false);
  };

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
      case 'user-first-name':
        return (
          <div style={style} className="bg-blue-50 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">USER FIRST NAME</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'John'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'user-full-name':
        return (
          <div style={style} className="bg-indigo-50 rounded-lg shadow-sm border border-indigo-200">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs text-indigo-600 font-medium">USER FULL NAME</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'John Doe'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'user-last-name':
        return (
          <div style={style} className="bg-purple-50 rounded-lg shadow-sm border border-purple-200">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600 font-medium">USER LAST NAME</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'Doe'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'order-time':
        return (
          <div style={style} className="bg-green-50 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">ORDER TIME</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'March 15, 2024 at 2:30 PM'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'shipping-number':
        return (
          <div style={style} className="bg-orange-50 rounded-lg shadow-sm border border-orange-200">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-orange-600 font-medium">SHIPPING NUMBER</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'TSH123456789'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'products':
        return (
          <div style={style} className="bg-red-50 rounded-lg shadow-sm border border-red-200">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs text-red-600 font-medium">PRODUCTS</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || 'Nike Air Max 270, Adidas Ultraboost 22'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div style={style} className="bg-green-50 rounded-lg shadow-sm border border-green-200">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">PRICING</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || '€159.98'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
          </div>
        );
      
      case 'shipping':
        return (
          <div style={style} className="bg-blue-50 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">SHIPPING</p>
                <p className="font-semibold text-gray-900">{element.content.placeholder || '€4.99'}</p>
                <p className="text-xs text-gray-500 font-mono">{element.content.text}</p>
              </div>
            </div>
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
      <div 
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
      </div>
      
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
          {element.type !== 'products' && (
            <button
              onClick={() => onDelete(element.id)}
              className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              title="Delete element"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
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
  onTextEdit?: (index: number, newContent: string) => void;
}> = ({ elements, onDrop, onReorder, onEdit, onDelete, globalStyling, onTextEdit }) => {
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
              onTextEdit={onTextEdit}
            />
          ))
        )}
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
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      type="text"
                      value={editedElement.content.company || ''}
                      onChange={(e) => updateContent({ company: e.target.value })}
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea
                      value={editedElement.content.text || ''}
                      onChange={(e) => updateContent({ text: e.target.value })}
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Quantity</label>
                      <input
                        type="number"
                        value={editedElement.content.quantity || 1}
                        onChange={(e) => updateContent({ quantity: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input
                        type="text"
                        value={editedElement.content.price || ''}
                        onChange={(e) => updateContent({ price: e.target.value })}
                        className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="text"
                      value={editedElement.content.amount || ''}
                      onChange={(e) => updateContent({ amount: e.target.value })}
                      className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                    className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full h-10 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={editedElement.styling.textColor || '#000000'}
                  onChange={(e) => updateStyling({ textColor: e.target.value })}
                  className="w-full h-10 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="number"
                  value={editedElement.styling.fontSize || 14}
                  onChange={(e) => updateStyling({ fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  min="8"
                  max="48"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Font Weight</label>
                <select
                  value={editedElement.styling.fontWeight || 'normal'}
                  onChange={(e) => updateStyling({ fontWeight: e.target.value as any })}
                  className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                  className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Alignment</label>
                <select
                  value={editedElement.styling.alignment || 'left'}
                  onChange={(e) => updateStyling({ alignment: e.target.value as any })}
                  className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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

// Helper function to create standard template
const createStandardTicketTemplate = (): TemplateElement[] => {
  return [
    {
      id: 'header-1',
      type: 'ticket-header',
      content: { text: 'Order Confirmation' },
      styling: {
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        alignment: 'center'
      },
      position: 0
    },
    {
      id: 'info-1',
      type: 'information-block',
      content: { 
        text: 'Thank you for your order! Your items are being prepared for shipment.',
        label: 'Order Status'
      },
      styling: {
        backgroundColor: '#f3f4f6',
        textColor: '#374151',
        fontSize: 14,
        padding: 16,
        borderRadius: 8
      },
      position: 1
    },
    {
      id: 'product-1',
      type: 'product-line',
      content: {
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: '/api/placeholder/80/80',
        description: 'High-quality wireless headphones with noise cancellation'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        fontSize: 14,
        padding: 16,
        borderRadius: 8
      },
      position: 2
    },
    {
      id: 'product-2',
      type: 'product-line',
      content: {
        name: 'Bluetooth Speaker',
        price: 149.99,
        quantity: 2,
        image: '/api/placeholder/80/80',
        description: 'Portable Bluetooth speaker with premium sound quality'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        fontSize: 14,
        padding: 16,
        borderRadius: 8
      },
      position: 3
    },
    {
      id: 'section-break-1',
      type: 'section-break',
      content: { text: 'Order Summary' },
      styling: {
        backgroundColor: '#e5e7eb',
        textColor: '#374151',
        fontSize: 16,
        fontWeight: 'semibold',
        padding: 12,
        alignment: 'center'
      },
      position: 4
    },
    {
      id: 'cost-1',
      type: 'cost-line',
      content: {
        label: 'Subtotal',
        amount: 599.97,
        currency: 'USD'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        fontSize: 14,
        padding: 8
      },
      position: 5
    },
    {
      id: 'cost-2',
      type: 'cost-line',
      content: {
        label: 'Shipping',
        amount: 15.00,
        currency: 'USD'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        fontSize: 14,
        padding: 8
      },
      position: 6
    },
    {
      id: 'cost-3',
      type: 'cost-line',
      content: {
        label: 'Tax',
        amount: 48.00,
        currency: 'USD'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        fontSize: 14,
        padding: 8
      },
      position: 7
    },
    {
      id: 'cost-4',
      type: 'cost-line',
      content: {
        label: 'Total',
        amount: 662.97,
        currency: 'USD',
        isTotal: true
      },
      styling: {
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 12
      },
      position: 8
    },
    {
      id: 'info-2',
      type: 'information-block',
      content: {
        text: 'Your order will be shipped within 2-3 business days. You will receive a tracking number via email once your order has been dispatched.',
        label: 'Shipping Information'
      },
      styling: {
        backgroundColor: '#eff6ff',
        textColor: '#1e40af',
        fontSize: 14,
        padding: 16,
        borderRadius: 8
      },
      position: 9
    },
    {
      id: 'logo-1',
      type: 'company-logo',
      content: {
        text: 'Your Company',
        logoUrl: '/api/placeholder/120/40'
      },
      styling: {
        backgroundColor: '#ffffff',
        textColor: '#374151',
        fontSize: 12,
        padding: 20,
        alignment: 'center'
      },
      position: 10
    },
    {
      id: 'message-1',
      type: 'custom-message',
      content: {
        text: 'Thank you for choosing us! If you have any questions, please contact our support team at support@company.com'
      },
      styling: {
        backgroundColor: '#f9fafb',
        textColor: '#6b7280',
        fontSize: 12,
        padding: 16,
        alignment: 'center',
        borderRadius: 8
      },
      position: 11
    }
  ];
};

// Main Interactive Template Builder
const InteractiveTemplateBuilder: React.FC<{
  onSave: (template: TicketTemplate) => void;
  initialTemplate?: TicketTemplate;
}> = ({ onSave, initialTemplate }) => {
  const [template, setTemplate] = useState<TicketTemplate>(
    initialTemplate || {
      id: `template_${Date.now()}`,
      name: 'Standard Order Template',
      description: 'A comprehensive order confirmation template with all essential elements',
      elements: createStandardTicketTemplate(),
      globalStyling: {
        primaryColor: '#1f2937',
        secondaryColor: '#64748b',
        backgroundColor: '#ffffff',
        textColor: '#374151',
        accentColor: '#3b82f6',
        borderRadius: 8,
        fontFamily: 'Inter, sans-serif',
      },
    }
  );

  const [editingElement, setEditingElement] = useState<TemplateElement | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const componentLibrary = [
    {
      type: 'user-first-name',
      label: 'User First Name',
      fieldName: 'first_name'
    },
    {
      type: 'user-full-name',
      label: 'User Full Name',
      fieldName: 'full_name'
    },
    {
      type: 'user-last-name',
      label: 'User Last Name',
      fieldName: 'last_name'
    },
    {
      type: 'order-time',
      label: 'Order Time',
      fieldName: 'order_time'
    },
    {
      type: 'shipping-number',
      label: 'Shipping Number',
      fieldName: 'shipping_number'
    },
    {
      type: 'products',
      label: 'Products',
      fieldName: 'products'
    },
    {
      type: 'pricing',
      label: 'Pricing',
      fieldName: 'pricing'
    },
    {
      type: 'shipping',
      label: 'Shipping',
      fieldName: 'shipping'
    },
    {
      type: 'order-number',
      label: 'Order Number',
      fieldName: 'order_number'
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

  const handleTextEdit = (index: number, newContent: string) => {
    setTemplate(prev => {
      const updatedElements = [...prev.elements];
      const element = updatedElements[index];
      
      updatedElements[index] = {
        ...element,
        content: { ...element.content, text: newContent }
      };
      
      return {
        ...prev,
        elements: updatedElements
      };
    });
  };



  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'user-first-name':
        return { text: '{{user.firstName}}', placeholder: 'John' };
      case 'user-full-name':
        return { text: '{{user.firstName}} {{user.lastName}}', placeholder: 'John Doe' };
      case 'user-last-name':
        return { text: '{{user.lastName}}', placeholder: 'Doe' };
      case 'order-time':
        return { text: '{{order.timestamp}}', placeholder: 'March 15, 2024 at 2:30 PM' };
      case 'shipping-number':
        return { text: '{{shipping.trackingNumber}}', placeholder: 'TSH123456789' };
      case 'products':
        return { text: '{{order.products}}', placeholder: 'Nike Air Max 270, Adidas Ultraboost 22' };
      case 'pricing':
        return { text: '{{order.total}}', placeholder: '€159.98' };
      case 'shipping':
        return { text: '{{shipping.cost}}', placeholder: '€4.99' };
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Building Blocks */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border-0 p-6 sticky top-6" style={{boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'}}>
              <h3 className="text-lg font-semibold mb-4">Mapping Fields</h3>
              <div className="space-y-2">
                {componentLibrary.map((component) => (
                  <DraggableComponent
                    key={component.type}
                    type={component.type}
                    label={component.label}
                    fieldName={component.fieldName}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Template Builder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border-0 p-6 mb-6" style={{boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'}}>
              <h3 className="text-lg font-semibold mb-4">Template Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template Name</label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter template name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={template.description}
                    onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border-0 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    rows={2}
                    placeholder="Describe this template..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border-0 p-6" style={{boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'}}>
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div
                style={{
                  fontFamily: template.globalStyling.fontFamily || 'Inter, sans-serif'
                }}
              >
                <TicketPreviewComponent
                  className="mx-auto"
                  onDataChange={(data) => {
                    // Update template elements based on ticket data changes
                    console.log('Ticket data changed:', data);
                  }}
                />
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