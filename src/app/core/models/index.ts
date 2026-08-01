export interface Gym {
  id: string;
  name: string;
  slug: string;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  address: string;
  price: number;
  priceLabel: string;
  images: string[];
  amenities: string[];
  facilities: string[];
  openNow: boolean;
  hours: { day: string; open: string; close: string }[];
  phone: string;
  whatsapp: string;
  website?: string;
  trainers: Trainer[];
  plans: MembershipPlan[];
  lat?: number;
  lng?: number;
  tags: string[];
  featured: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  slug: string;
  photo: string;
  title: string;
  specializations: string[];
  certifications: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  clients: number;
  bio: string;
  social: { instagram?: string; facebook?: string; youtube?: string };
  timings: string[];
  gymId?: string;
  gymName?: string;
  reviews: Review[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  features: string[];
  popular: boolean;
  color: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorAvatar: string;
  image: string;
  date: string;
  readTime: number;
  tags: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export type UserRole = 'user' | 'owner' | 'admin' | 'superadmin';
export type UserStatus = 'active' | 'pending' | 'rejected';

/** Lifecycle of a booking enquiry as it is worked by staff. */
export type BookingStatus = 'pending' | 'contacted' | 'converted' | 'closed';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  gymId: string | null;
  gymName: string | null;
  status: BookingStatus;
  createdAt: string;
}

// ── Nutritionists ──
export interface Nutritionist {
  id: string;
  name: string;
  slug: string;
  photo: string;
  title: string;
  bio: string;
  specializations: string[];
  certifications: string[];
  languages: string[];
  /** Years of practice. */
  experience: number;
  consultationFee: number;
  /** 'Online' and/or 'In-person'. */
  consultationModes: string[];
  email: string;
  phone: string;
  rating: number;
  reviewCount: number;
  clients: number;
  gymId: string | null;
  gymName: string | null;
  active: boolean;
  createdAt: string;
}

// ── Offers ──
export type OfferType = 'percentage' | 'fixed';
export type OfferScope = 'sitewide' | 'gym';

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  type: OfferType;
  value: number;
  scope: OfferScope;
  gymId: string | null;
  gymName: string | null;
  validFrom: string;
  validUntil: string;
  /** 0 means unlimited. */
  usageLimit: number;
  usedCount: number;
  active: boolean;
  /** Server-computed: active, in date, and not exhausted. Admin list only. */
  live?: boolean;
  createdAt: string;
}

// ── CMS ──
export interface CmsSite {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;
}

export interface CmsHome {
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroTitleEnd: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  statGyms: string;
  statGymsLabel: string;
  statTrainers: string;
  statTrainersLabel: string;
  statMembers: string;
  statMembersLabel: string;
}

export interface CmsFaqItem {
  question: string;
  answer: string;
}

export interface CmsContent {
  site: CmsSite;
  home: CmsHome;
  faqs: { items: CmsFaqItem[] };
}

export type CmsSectionName = keyof CmsContent;

export interface AdminStats {
  users: { total: number; members: number; owners: number; admins: number; pendingOwners: number };
  gyms: { total: number; featured: number };
  blogs: { total: number };
  bookings: { total: number; pending: number };
}

/** Roles a user may pick at signup — 'admin' is never self-assignable. */
export type RequestableRole = Extract<UserRole, 'user' | 'owner'>;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
}
