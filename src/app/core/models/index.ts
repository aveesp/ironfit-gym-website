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
