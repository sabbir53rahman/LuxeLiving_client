// Agent Types and Interfaces

export interface Agent {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  contactNumber?: string;
  address?: string;
  avatar?: string;
  bio?: string;
  licenseNumber?: string;
  experience?: number;
  specialization?: string[];
  averageRating?: number;
  commissionRate?: number;
  isAvailable?: boolean;
  isActive?: boolean;
  totalReviews?: number;
  profilePhoto?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    needsPasswordChange?: boolean;
    isDeleted?: boolean;
    image?: string;
    profilePhoto?: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfile extends Agent {
  assignedProperties?: Property[];
  reviews?: Review[];
  performanceHistory?: PerformanceMetric[];
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status: 'active' | 'pending' | 'sold' | 'rented';
  agent?: Agent;
  seller: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  views?: number;
}

export interface Review {
  _id: string;
  agentId: string;
  buyerId: string;
  propertyId?: string;
  rating: number;
  comment: string;
  professionalism: number;
  communication: number;
  marketKnowledge: number;
  helpfulness: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Viewing {
  _id: string;
  propertyId: string;
  agentId: string;
  buyerId: string;
  sellerId: string;
  scheduledDate: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
  agent: Agent;
  buyer: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface PerformanceMetric {
  _id: string;
  agentId: string;
  metric: string;
  value: number;
  period: string;
  createdAt: string;
}

export interface AgentRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  licenseNumber?: string;
  experience?: number;
  bio?: string;
  specialization?: string[];
  commissionRate?: number;
}

export interface AgentUpdateData {
  name?: string;
  contactNumber?: string;
  address?: string;
  bio?: string;
  specialization?: string[];
  commissionRate?: number;
  experience?: number;
  isAvailable?: boolean;
  profilePhoto?: string;
}

export interface AgentSearchParams {
  search?: string;
  specialization?: string;
  minRating?: number;
  maxRating?: number;
  minExperience?: number;
  maxExperience?: number;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'experience' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AgentReviewData {
  agentId: string;
  rating: number;
  comment: string;
  professionalism: number;
  communication: number;
  marketKnowledge: number;
  helpfulness: number;
  propertyId?: string;
}

export interface ViewingUpdateData {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  feedback?: string;
}
