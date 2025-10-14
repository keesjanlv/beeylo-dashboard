import React, { useState, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { 
  Ticket, 
  ComponentType, 
  OrderItem, 
  ShippingInfo, 
  CustomerInfo 
} from '@/types/ticket';
import { 
  Package, 
  Truck, 
  User, 
  CreditCard, 
  Image as ImageIcon,
  GripVertical,
  Trash2,
  Plus,
  Edit3
} from 'lucide-react';

interface DraggableElement {
  id: string;
  type: ComponentType;
  content: any;
  style?: React.CSSProperties;
}

interface InteractiveTicketPreviewProps {
  ticket?: Ticket;
  elements: DraggableElement[];
  onElementsChange: (elements: DraggableElement[]) => void;
  onTicketChange?: (ticket: Ticket) => void;
}

const InteractiveTicketPreview: React.FC<InteractiveTicketPreviewProps> = ({
  ticket,
  elements,
  onElementsChange,
  onTicketChange
}) => {
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editingTicketField, setEditingTicketField] = useState<string | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    drop: (item: { type: ComponentType }, monitor) => {
      if (!monitor.didDrop()) {
        const newElement: DraggableElement = {
          id: `element-${Date.now()}`,
          type: item.type,
          content: getDefaultContent(item.type),
          style: {}
        };
        onElementsChange([...elements, newElement]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  const getDefaultContent = (type: ComponentType) => {
    switch (type) {
      case ComponentType.TEXT:
        return { text: 'Click to edit text', fontSize: 16, color: '#000000' };
      case ComponentType.ORDER_ITEMS:
        return {
          items: [
            { id: '1', name: 'Sample Product', quantity: 1, price: 29.99, description: 'Product description' }
          ] as OrderItem[]
        };
      case ComponentType.SHIPPING_COST:
        return {
          method: 'Standard Shipping',
          cost: 5.99,
          estimatedDelivery: '3-5 business days'
        } as ShippingInfo;
      case ComponentType.CUSTOMER_INFO:
        return {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          address: {
            street: '123 Main St',
            city: 'New York',
            postalCode: '10001',
            country: 'USA'
          }
        } as CustomerInfo;
      case ComponentType.LOGO:
        return { src: '', alt: 'Company Logo', width: 120, height: 60 };
      case ComponentType.DIVIDER:
        return { color: '#e5e7eb', thickness: 1, style: 'solid' };
      case ComponentType.TOTAL_AMOUNT:
        return { amount: 35.98, currency: 'USD', label: 'Total' };
      default:
        return {};
    }
  };

  const moveElement = (dragIndex: number, hoverIndex: number) => {
    const dragElement = elements[dragIndex];
    const newElements = [...elements];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, dragElement);
    onElementsChange(newElements);
  };

  const updateElement = (id: string, newContent: any) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, content: { ...el.content, ...newContent } } : el
    );
    onElementsChange(newElements);
  };

  const deleteElement = (id: string) => {
    onElementsChange(elements.filter(el => el.id !== id));
  };

  const updateTicketField = (field: string, value: any) => {
    if (ticket && onTicketChange) {
      onTicketChange({ ...ticket, [field]: value });
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Ticket Preview</h2>
        
        {/* Ticket Header - Editable */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {editingTicketField === 'title' ? (
                <input
                  type="text"
                  value={ticket?.title || ''}
                  onChange={(e) => updateTicketField('title', e.target.value)}
                  onBlur={() => setEditingTicketField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTicketField(null)}
                  className="text-2xl font-bold border-b-2 border-blue-500 outline-none bg-transparent w-full"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-2xl font-bold cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => setEditingTicketField('title')}
                >
                  {ticket?.title || 'Click to edit title'}
                  <Edit3 className="inline w-4 h-4 ml-2 opacity-50" />
                </h1>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {ticket?.date ? new Date(ticket.date).toLocaleDateString() : 'Today'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">From: </span>
              {editingTicketField === 'sender' ? (
                <input
                  type="text"
                  value={ticket?.sender || ''}
                  onChange={(e) => updateTicketField('sender', e.target.value)}
                  onBlur={() => setEditingTicketField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTicketField(null)}
                  className="border-b border-blue-500 outline-none bg-transparent"
                  autoFocus
                />
              ) : (
                <span 
                  className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => setEditingTicketField('sender')}
                >
                  {ticket?.sender || 'Click to edit sender'}
                </span>
              )}
            </div>
            <div>
              <span className="font-medium">Company: </span>
              {editingTicketField === 'companyName' ? (
                <input
                  type="text"
                  value={ticket?.companyName || ''}
                  onChange={(e) => updateTicketField('companyName', e.target.value)}
                  onBlur={() => setEditingTicketField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTicketField(null)}
                  className="border-b border-blue-500 outline-none bg-transparent"
                  autoFocus
                />
              ) : (
                <span 
                  className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => setEditingTicketField('companyName')}
                >
                  {ticket?.companyName || 'Click to edit company'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Droppable Content Area */}
        <div 
          ref={drop}
          className={`bg-white rounded-lg shadow-sm border min-h-96 p-6 ${
            isOver ? 'border-blue-500 border-dashed bg-blue-50' : ''
          }`}
        >
          {elements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Drag elements here to build your ticket</p>
            </div>
          ) : (
            <div className="space-y-4">
              {elements.map((element, index) => (
                <DraggableElementComponent
                  key={element.id}
                  element={element}
                  index={index}
                  moveElement={moveElement}
                  updateElement={updateElement}
                  deleteElement={deleteElement}
                  isEditing={editingElement === element.id}
                  setEditing={setEditingElement}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DraggableElementComponentProps {
  element: DraggableElement;
  index: number;
  moveElement: (dragIndex: number, hoverIndex: number) => void;
  updateElement: (id: string, content: any) => void;
  deleteElement: (id: string) => void;
  isEditing: boolean;
  setEditing: (id: string | null) => void;
}

const DraggableElementComponent: React.FC<DraggableElementComponentProps> = ({
  element,
  index,
  moveElement,
  updateElement,
  deleteElement,
  isEditing,
  setEditing
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'draggable-element',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      moveElement(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'draggable-element',
    item: () => ({ id: element.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const renderElementContent = () => {
    switch (element.type) {
      case ComponentType.TEXT:
        return isEditing ? (
          <textarea
            value={element.content.text}
            onChange={(e) => updateElement(element.id, { text: e.target.value })}
            onBlur={() => setEditing(null)}
            className="w-full p-2 border rounded resize-none"
            style={{ fontSize: element.content.fontSize, color: element.content.color }}
            autoFocus
          />
        ) : (
          <p 
            className="cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => setEditing(element.id)}
            style={{ fontSize: element.content.fontSize, color: element.content.color }}
          >
            {element.content.text}
          </p>
        );

      case ComponentType.ORDER_ITEMS:
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5" />
              <h3 className="font-semibold">Order Items</h3>
            </div>
            {element.content.items.map((item: OrderItem, idx: number) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${item.price.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case ComponentType.SHIPPING_COST:
        return (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium">{element.content.method}</div>
                <div className="text-sm text-gray-600">{element.content.estimatedDelivery}</div>
              </div>
            </div>
            <div className="font-semibold">${element.content.cost.toFixed(2)}</div>
          </div>
        );

      case ComponentType.CUSTOMER_INFO:
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5" />
              <h3 className="font-semibold">Customer Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">{element.content.name}</div>
                <div className="text-gray-600">{element.content.email}</div>
                {element.content.phone && (
                  <div className="text-gray-600">{element.content.phone}</div>
                )}
              </div>
              {element.content.address && (
                <div className="text-gray-600">
                  <div>{element.content.address.street}</div>
                  <div>{element.content.address.city}, {element.content.address.postalCode}</div>
                  <div>{element.content.address.country}</div>
                </div>
              )}
            </div>
          </div>
        );

      case ComponentType.TOTAL_AMOUNT:
        return (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-lg">{element.content.label}</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {element.content.currency} ${element.content.amount.toFixed(2)}
            </div>
          </div>
        );

      case ComponentType.LOGO:
        return (
          <div className="text-center">
            {element.content.src ? (
              <img 
                src={element.content.src} 
                alt={element.content.alt}
                style={{ width: element.content.width, height: element.content.height }}
                className="mx-auto"
              />
            ) : (
              <div 
                className="mx-auto bg-gray-200 rounded flex items-center justify-center"
                style={{ width: element.content.width, height: element.content.height }}
              >
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        );

      case ComponentType.DIVIDER:
        return (
          <hr 
            style={{ 
              borderColor: element.content.color,
              borderWidth: element.content.thickness,
              borderStyle: element.content.style
            }}
          />
        );

      default:
        return <div>Unknown element type</div>;
    }
  };

  return (
    <div
      ref={ref}
      className={`group relative border rounded-lg p-4 ${
        isDragging ? 'opacity-50' : ''
      } hover:border-blue-300 transition-colors`}
      data-handler-id={handlerId}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => deleteElement(element.id)}
          className="p-1 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="p-1 text-gray-400 cursor-move">
          <GripVertical className="w-4 h-4" />
        </div>
      </div>
      
      {renderElementContent()}
    </div>
  );
};

export { InteractiveTicketPreview };