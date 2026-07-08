export interface Booking {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  zip?: string;
  serviceType: string;
  urgency: "Standard" | "Same-day" | "Emergency";
  date: string;
  timeSlot: string;
  description?: string;
  status?: string;
  technician?: string;
  createdAt?: string;
}

export interface Lead {
  id?: string;
  name: string;
  phone: string;
  zip: string;
  serviceType: string;
  urgency: "Standard" | "Same-day" | "Emergency";
  estimatedRange: string;
  preferredDate?: string;
  preferredTime?: string;
  status?: string;
  createdAt?: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  pricingRange: string;
}

export interface Message {
  role: "user" | "assistant" | "model";
  text: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  servicePerformed: string;
  text: string;
  date: string;
  avatarUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "pricing" | "services" | "emergencies" | "general";
}
