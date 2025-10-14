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