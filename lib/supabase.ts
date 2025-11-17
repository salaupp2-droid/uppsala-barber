import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Barber = {
  id: string;
  name: string;
  bio: string;
  instagram: string;
  whatsapp: string;
  photo_url: string;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
};

export type Appointment = {
  id: string;
  barber_id: string;
  service_id: string;
  client_name: string;
  client_phone: string;
  client_instagram?: string;
  date: string;
  time: string;
  comment?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
};

export type Media = {
  id: string;
  barber_id?: string;
  type: 'photo' | 'video';
  url: string;
  description?: string;
  created_at: string;
};
