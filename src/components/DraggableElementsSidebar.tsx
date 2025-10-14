import React from 'react';
import { useDrag } from 'react-dnd';
import { ComponentType } from '@/types/ticket';
import {
  Type,
  Package,
  Truck,
  User,
  CreditCard,
  Image as ImageIcon,
  Minus,
  Space,
  Building
} from 'lucide-react';

interface DraggableElementProps {
  type: ComponentType;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, icon, label, description }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-4 bg-white border rounded-lg cursor-move hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      } hover:border-blue-300`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-blue-600">{icon}</div>
        <div className="font-medium text-sm">{label}</div>
      </div>
      <div className="text-xs text-gray-600">{description}</div>
    </div>
  );
};

const DraggableElementsSidebar: React.FC = () => {
  const elements: DraggableElementProps[] = [
    {
      type: ComponentType.TEXT,
      icon: <Type className="w-5 h-5" />,
      label: 'Text Block',
      description: 'Add editable text content'
    },
    {
      type: ComponentType.ORDER_ITEMS,
      icon: <Package className="w-5 h-5" />,
      label: 'Order Items',
      description: 'Display ordered products with quantities and prices'
    },
    {
      type: ComponentType.SHIPPING_COST,
      icon: <Truck className="w-5 h-5" />,
      label: 'Shipping Info',
      description: 'Show shipping method, cost, and delivery time'
    },
    {
      type: ComponentType.CUSTOMER_INFO,
      icon: <User className="w-5 h-5" />,
      label: 'Customer Info',
      description: 'Display customer details and address'
    },
    {
      type: ComponentType.TOTAL_AMOUNT,
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Total Amount',
      description: 'Show final total with currency'
    },
    {
      type: ComponentType.LOGO,
      icon: <Building className="w-5 h-5" />,
      label: 'Company Logo',
      description: 'Add your company logo or branding'
    },
    {
      type: ComponentType.DIVIDER,
      icon: <Minus className="w-5 h-5" />,
      label: 'Divider',
      description: 'Add visual separation between sections'
    },
    {
      type: ComponentType.SPACER,
      icon: <Space className="w-5 h-5" />,
      label: 'Spacer',
      description: 'Add vertical spacing between elements'
    }
  ];

  return (
    <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Ticket Elements</h2>
        <p className="text-sm text-gray-600">
          Drag elements to the preview area to build your ticket template
        </p>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700 mb-2">Content Elements</div>
        {elements.slice(0, 4).map((element) => (
          <DraggableElement key={element.type} {...element} />
        ))}

        <div className="text-sm font-medium text-gray-700 mb-2 mt-6">Layout Elements</div>
        {elements.slice(4).map((element) => (
          <DraggableElement key={element.type} {...element} />
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Tips</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Click on text elements to edit them directly</li>
          <li>• Drag elements to reorder them</li>
          <li>• Use dividers to separate sections</li>
          <li>• Add spacers for better visual spacing</li>
        </ul>
      </div>
    </div>
  );
};

export { DraggableElementsSidebar };