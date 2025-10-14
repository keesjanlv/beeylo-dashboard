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
  Actions = 'Actions',
  Orders = 'Orders',
  Appointments = 'Appointments',
  General = 'General',
}

export enum ComponentType {
  TEXT_BLOCK = 'TEXT_BLOCK',
  DIVIDER = 'DIVIDER',
  SPACER = 'SPACER',
  ORDER_ITEMS = 'ORDER_ITEMS',
  SHIPPING_COST = 'SHIPPING_COST',
  LOGO = 'LOGO',
  TOTAL_AMOUNT = 'TOTAL_AMOUNT',
  CUSTOMER_INFO = 'CUSTOMER_INFO',
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingInfo {
  method: string;
  cost: number;
  estimatedDelivery?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

// New types for Interactive Template Builder
export interface TemplateElement {
  id: string;
  type: 'header' | 'content' | 'order-item' | 'shipping' | 'divider' | 'logo' | 'custom-text';
  content: any;
  styling: ElementStyling;
  position: number;
}

export interface ElementStyling {
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

export interface GlobalStyling {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
}

export interface TicketTemplate {
  id: string;
  name: string;
  description: string;
  elements: TemplateElement[];
  globalStyling: GlobalStyling;
}