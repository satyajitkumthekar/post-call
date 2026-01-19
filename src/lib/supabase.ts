import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  result: string;
  video_url: string | null;
  thumbnail_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type TextTestimonial = {
  id: string;
  author: string;
  title: string;
  text: string;
  rating: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type MessageTestimonial = {
  id: string;
  text: string;
  name: string;
  screenshot_url: string | null;
  is_active: boolean;
  created_at: string;
};
