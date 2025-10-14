import React, { useState } from 'react';
import { Package, Calendar, Euro, Info, Circle, Edit3, Save, X, ChevronLeft } from 'lucide-react';

interface TicketData {
  companyName: string;
  companyLogo?: string;
  orderTitle: string;
  orderSubtitle: string;
  statusMessage: string;
  statusIcon: string;
  summary: {
    title: string;
    content: string;
  };
  content: {
    title: string;
    description: string;
    orderNumber: string;
    items: Array<{
      name: string;
      size: string;
      color: string;
      price: string;
      image?: string;
    }>;
  };
  instructions: {
    title: string;
    items: string[];
  };
  timeline: {
    title: string;
    status: string;
    showMore: boolean;
  };
}

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onChange, 
  className = '', 
  multiline = false,
  placeholder = 'Click to edit...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative group">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 rounded px-2 py-1 outline-none resize-none`}
            autoFocus
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} border-2 border-blue-500 rounded px-2 py-1 outline-none`}
            autoFocus
          />
        )}
        <div className="absolute -right-8 top-0 flex flex-col gap-1">
          <button
            onClick={handleSave}
            className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
            title="Save"
          >
            <Save className="w-3 h-3" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
            title="Cancel"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${className} cursor-pointer hover:bg-blue-50 rounded px-2 py-1 relative group transition-colors`}
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {value || placeholder}
      <Edit3 className="w-3 h-3 absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400" />
    </div>
  );
};

interface TicketPreviewComponentProps {
  ticketData?: TicketData;
  onDataChange?: (data: TicketData) => void;
  className?: string;
}

const TicketPreviewComponent: React.FC<TicketPreviewComponentProps> = ({
  ticketData: initialData,
  onDataChange,
  className = ''
}) => {
  const [ticketData, setTicketData] = useState<TicketData>(initialData || {
    companyName: 'Zalando',
    orderTitle: 'Order shipped',
    orderSubtitle: 'Nike Air Max 90 + 2 others',
    statusMessage: 'On the way, will be delivered today',
    statusIcon: '📦',
    summary: {
      title: 'Summary',
      content: 'Your Zalando order is on its way.'
    },
    content: {
      title: 'Content',
      description: 'Your package with order number ZAL-87654 is being shipped with DHL. You can track it with the code: 12345678.',
      orderNumber: 'ZAL-87654',
      items: [
        {
          name: 'Nike Air Max 90',
          size: '43',
          color: 'Black/White',
          price: '€ 129,99',
          image: '👟'
        },
        {
          name: 'Adidas Continental 80',
          size: '42',
          color: 'White',
          price: '€ 89,99',
          image: '👟'
        },
        {
          name: 'Calvin Klein T-shirt',
          size: 'L',
          color: 'White',
          price: '€ 39,99',
          image: '👕'
        }
      ]
    },
    instructions: {
      title: 'Instructions',
      items: [
        'Track your package with the number above',
        'Make sure someone is available for delivery',
        'Return period is 30 days after receipt'
      ]
    },
    timeline: {
      title: 'Timeline',
      status: 'Delivered',
      showMore: false
    }
  });

  const updateTicketData = (path: string, value: any) => {
    const newData = { ...ticketData };
    const keys = path.split('.');
    let current: any = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setTicketData(newData);
    onDataChange?.(newData);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setTicketData(prev => {
      const newItems = [...prev.content.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { 
        ...prev, 
        content: { ...prev.content, items: newItems }
      };
    });
  };

  const addItem = () => {
    const newItem = {
      name: 'New Product',
      size: 'M',
      color: 'Black',
      price: '€ 0,00',
      image: '📦'
    };
    setTicketData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: [...prev.content.items, newItem]
      }
    }));
  };

  const removeItem = (index: number) => {
    setTicketData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        items: prev.content.items.filter((_, i) => i !== index)
      }
    }));
  };

  const getCompanyInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className={`w-full max-w-md mx-auto bg-gray-50 min-h-screen ${className}`}>
       {/* Header Card */}
       <div className="bg-white p-4 shadow-sm border-b border-gray-100">
         <div className="flex items-center gap-3">
           <ChevronLeft className="w-6 h-6 text-gray-600" />
           <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
             <span className="text-white text-sm font-bold">
               {getCompanyInitial(ticketData.companyName)}
             </span>
           </div>
           <EditableText
             value={ticketData.companyName}
             onChange={(value) => updateTicketData('companyName', value)}
             className="font-semibold text-lg"
           />
         </div>
       </div>

       {/* Order Status Card */}
        <div className="bg-white mx-4 mt-6 p-5 rounded-xl shadow-sm border border-gray-100">
          <EditableText
            value={ticketData.orderTitle}
            onChange={(value) => updateTicketData('orderTitle', value)}
            className="text-xl font-bold text-gray-900 mb-1"
          />
          <EditableText
            value={ticketData.orderSubtitle}
            onChange={(value) => updateTicketData('orderSubtitle', value)}
            className="text-gray-600 mb-4"
          />
          <div className="flex items-center space-x-3 bg-yellow-50 p-3 rounded-lg">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <EditableText
              value={ticketData.statusMessage}
              onChange={(value) => updateTicketData('statusMessage', value)}
              className="text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Summary</h3>
          <EditableText
            value={ticketData.summary.content}
            onChange={(value) => updateTicketData('summary.content', value)}
            className="text-gray-600 text-sm leading-relaxed"
            multiline
          />
        </div>

        {/* Content Card */}
        <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
         <EditableText
           value={ticketData.content.description}
           onChange={(value) => updateTicketData('content.description', value)}
           className="text-gray-600 text-sm mb-4"
           multiline
         />

         {/* Product Items */}
           <div className="space-y-3">
             {ticketData.content.items.map((item, index) => (
               <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                 <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl shadow-inner">
                   {item.image || '📦'}
                 </div>
                 <div className="flex-1 min-w-0">
                   <EditableText
                     value={item.name}
                     onChange={(value) => updateItem(index, 'name', value)}
                     className="font-semibold text-gray-900 text-base mb-2 leading-tight"
                   />
                   <div className="flex flex-wrap gap-2 mb-2">
                     <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md">
                       <span className="text-xs font-medium text-blue-700 mr-1">Size:</span>
                       <EditableText
                         value={item.size}
                         onChange={(value) => updateItem(index, 'size', value)}
                         className="text-xs font-semibold text-blue-900"
                       />
                     </div>
                     <div className="flex items-center bg-green-50 px-2 py-1 rounded-md">
                       <span className="text-xs font-medium text-green-700 mr-1">Color:</span>
                       <EditableText
                         value={item.color}
                         onChange={(value) => updateItem(index, 'color', value)}
                         className="text-xs font-semibold text-green-900"
                       />
                     </div>
                     <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                       <span className="text-xs font-medium text-gray-700">Qty: 1</span>
                     </div>
                   </div>
                   <EditableText
                     value={item.price}
                     onChange={(value) => updateItem(index, 'price', value)}
                     className="text-lg font-bold text-gray-900 bg-yellow-50 px-2 py-1 rounded-md inline-block"
                   />
                 </div>
                 <button
                   onClick={() => removeItem(index)}
                   className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                   title="Remove item"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>

         {/* Remove the Add Product button section */}
         {/* 
         <button
           onClick={addItem}
           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
         >
           + Add Product
         </button>
         */}
       </div>

       {/* Instructions Card */}
       <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
         <ul className="space-y-1">
           {ticketData.instructions.items.map((instruction, index) => (
             <li key={index} className="flex items-start space-x-2">
               <span className="text-gray-400 mt-1">•</span>
               <EditableText
                 value={instruction}
                 onChange={(value) => {
                   const newItems = [...ticketData.instructions.items];
                   newItems[index] = value;
                   updateTicketData('instructions.items', newItems);
                 }}
                 className="text-gray-600 text-sm flex-1 leading-relaxed"
               />
             </li>
           ))}
         </ul>
       </div>

       {/* Action Buttons Card */}
       <div className="bg-white mx-4 mt-4 p-5 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
         <div className="grid grid-cols-2 gap-3">
           <button className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
             Track
           </button>
           <button className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
             Return
           </button>
           <button className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
             Contact
           </button>
           <button className="flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
             Invoice
           </button>
         </div>
       </div>

       {/* Timeline Card */}
       <div className="bg-white mx-4 mt-4 mb-8 p-5 rounded-xl shadow-sm border border-gray-100">
         <div className="flex items-center justify-between mb-3">
           <h3 className="font-semibold text-gray-900">Timeline</h3>
           <button className="text-gray-400 text-sm">Show more ▼</button>
         </div>
         <div className="flex items-center space-x-3">
           <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full"></div>
           </div>
           <EditableText
             value={ticketData.timeline.status}
             onChange={(value) => updateTicketData('timeline.status', value)}
             className="font-medium text-gray-900 leading-relaxed"
           />
         </div>
       </div>
     </div>
  );
};

export default TicketPreviewComponent;