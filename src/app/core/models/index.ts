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
  /** Where enquiries for this gym are forwarded. */
  email?: string;
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
  /** Independent trainer working out of partner gyms rather than employed by one. */
  freelance?: boolean;
  /** Monthly fee in ₹. Required for freelance trainers, shown on their card. */
  monthlyRate?: number;
  /** Gyms a freelance trainer is available at. */
  gyms?: { id: string | null; name: string }[];
  /** Where booking requests for this trainer are forwarded. */
  email?: string;
  phone?: string;
  /** Undefined on seeded trainers — only an explicit false hides a profile. */
  active?: boolean;
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

/** What an enquiry is about. Derived server-side from the attached subject. */
export type InquiryType = 'gym' | 'trainer' | 'nutritionist' | 'general';

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  type: InquiryType;
  /** Denormalised gym/trainer/nutritionist name, so the list needs no lookup. */
  subjectName: string | null;
  gymId: string | null;
  gymName: string | null;
  trainerId: string | null;
  trainerName: string | null;
  nutritionistId: string | null;
  nutritionistName: string | null;
  status: BookingStatus;
  createdAt: string;
  /** Whether the enquiry was forwarded to the provider by email. */
  notifyStatus?: 'sent' | 'failed' | 'no-provider-email' | 'mail-not-configured';
  providerEmail?: string | null;
  notified?: boolean;
  confirmationSent?: boolean;
}

/** Payload for the public enquiry endpoint. Attach at most one subject. */
export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  interest?: string;
  message: string;
  gymId?: string;
  gymName?: string;
  trainerId?: string;
  trainerName?: string;
  nutritionistId?: string;
  nutritionistName?: string;
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
// ── Bulk spreadsheet import (gyms, trainers, nutritionists) ──
export type BulkRowStatus = 'created' | 'valid' | 'duplicate' | 'invalid';

export interface BulkImportRowResult {
  /** Spreadsheet row number, so an error points at the line to fix. */
  row: number;
  name: string;
  slug: string;
  status: BulkRowStatus;
  error?: string;
  id?: string;
}

export interface BulkImportResult {
  dryRun: boolean;
  total: number;
  created: number;
  /** Only present on a dry run — how many rows would import. */
  valid?: number;
  duplicates: number;
  invalid: number;
  results: BulkImportRowResult[];
}

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
