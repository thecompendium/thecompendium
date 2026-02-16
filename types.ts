
export interface Publication {
  id: string;
  title: string;
  category: 'Article' | 'College News' | 'Annual Magazine';
  author: string;
  date: string;
  summary: string;
  image_url: string;
  file_url?: string;
  file_mime_type?: string;
  link?: string;
  created_at?: string;
}

export interface Achievement {
  id: string;
  name: string;
  roll_number: string;
  department: string;
  category: string;
  description: string;
  image_url: string;
  work_url?: string;
  created_at?: string;
}

export interface AchievementSubmission {
  id: string;
  name: string;
  year: string;
  branch: string;
  phone: string;
  email: string;
  description: string;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string;
  category?: string;
  registration_link?: string;
  summary_file_url?: string;
  created_at?: string;
}

export interface JourneyLeader {
  id: string;
  name: string;
  role: string;
  image_url: string;
  tagline?: string;
  reflection?: string;
}

export interface JourneyYear {
  id: string;
  year: number;
  title: string;
  description: string;
  main_image: string;
  events: string[];
  new_editions?: string[];
  leaders: JourneyLeader[];
  gallery: string[];
  domain_heads?: JourneyLeader[];
}

export enum Page {
  Home = 'home',
  News = 'news',
  Events = 'events',
  Achievements = 'achievements',
  About = 'about',
  Contact = 'contact',
  AdminLogin = 'admin-login',
  Games = 'games'
}