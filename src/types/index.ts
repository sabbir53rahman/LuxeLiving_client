export type UserRole = "buyer" | "seller" | "agent" | "admin" | "super_admin";

export interface User {
  id: string;
  userId?: string;
  name: string;
  email: string;
  role: string | UserRole;
  avatar?: string | null;
  image?: string | null;
  profilePhoto?: string | null;
  isVerified?: boolean;
  status?: string;
  contactNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Registration Data Types ───────────────────────────────────────────────────────
export interface BuyerRegistrationData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}

export interface SellerRegistrationData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
}

export interface AgentRegistrationData {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  address: string;
  licenseNumber: string;
  experience: number;
  specialization: string[];
  bio?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Property ─────────────────────────────────────────────────────────────────
export interface IProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images?: string[];
  featured?: boolean;
  rating?: number;
  views?: number;
  agent?: {
    name: string;
    avatar: string;
  };
}

// ─── Viewing ────────────────────────────────────────────────────────────────
export type ViewingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "UNPAID";

export interface IViewing {
  id: string;
  buyerId?: string;
  propertyId?: string;
  agentId?: string | null;
  status: string;
  paymentStatus: string;
  viewingDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  };
  property?: IProperty;
  agent?: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
  } | null;
}

// ─── Mentor ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  _id?: string;
  student?: Pick<User, "id" | "name" | "avatar" | "profilePhoto">;
  mentor?: {
    id: string;
    name: string;
    profilePhoto: string | null;
    expertise: string | null;
  };
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Mentor {
  id: string;
  userId: string;
  user: User;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  registrationNumber?: string | null;
  experience: number;
  hourlyRate: number;
  bio?: string | null;
  expertise?: string | null;
  averageRating: number;
  isAvailable: boolean;
  isDeleted: boolean;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

// ─── Availability ─────────────────────────────────────────────────────────────
export interface TimeSlot {
  id?: string;
  _id?: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Schedule {
  id: string;
  _id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  slots?: TimeSlot[];
  mentorId?: string;
  mentor?: Mentor;
}

export interface AvailabilityDay {
  date: string;
  slots: TimeSlot[];
}

// ─── Booking / Session ───────────────────────────────────────────────────────
export type SessionStatus =
  | "PENDING"
  | "SCHEDULED"
  | "INPROGRESS"
  | "COMPLETED"
  | "CANCELED";
export type PaymentStatus = "PAID" | "UNPAID";


export interface Session {
  id: string;
  _id?: string;
  mentorId: string;
  studentId: string;
  mentor: Mentor;
  student: User;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  meetingLink?: string;
  payment?: {
    id: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
  };
  totalAmount?: number; // Keep for compatibility
  isPaid?: boolean; // Keep for compatibility
  review?: Review;
  createdAt: string;
  updatedAt: string;
}


export type IBooking = Session;

// ─── Admin ────────────────────────────────────────────────────────────────────
export interface IAdminStats {
  totalUsers: number;
  totalMentors: number;
  totalStudents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: IBooking[];
}

export interface IMentorStats {
  totalBookings: number;
  totalReviews: number;
  totalEarnings: number;
  averageRating: number;
  upcomingBookings: IBooking[];
}

export interface IStudentStats {
  totalBookings: number;
  totalReviews: number;
  totalSpent: number;
  upcomingBookings: IBooking[];
}

export type IOverviewStats = IAdminStats | IMentorStats | IStudentStats;

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Query Params ─────────────────────────────────────────────────────────────
export interface MentorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minRate?: number;
  maxRate?: number;
  rating?: number;
  sortBy?: "rating" | "hourlyRate" | "totalSessions";
  sortOrder?: "asc" | "desc";
}

export interface SessionQueryParams {
  page?: number;
  limit?: number;
  status?: SessionStatus;
  role?: "student" | "mentor";
}
