export interface User {
  id: string;
  email: string;
  full_name: string;
  city?: string;
  profile_image?: string;
  relationship_status?: 'monogamy' | 'polygamy';
}

export interface Partner {
  id: string;
  full_name: string;
  age?: number;
  city?: string;
  car?: string;
  location?: string;
  number_of_kids?: number;
  profile_image?: string;
  partner_image?: string;
}

export interface Match {
  partner_id: string;
  similarity: number;
  match_date: string;
}

export interface ApiError {
  message: string;
  status: number;
} 