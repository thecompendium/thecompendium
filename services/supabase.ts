import { createClient } from '@supabase/supabase-js';
import { Publication, Achievement, TeamMember, Event, AchievementSubmission } from '../types';

const SUPABASE_URL = 'https://ekrrilidqrjbddapdfkc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcnJpbGlkcXJqYmRkYXBkZmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDE5NjMsImV4cCI6MjA4NjU3Nzk2M30.ZlAv0AHqKjdBAep0KuniTazBBjfSrnKTvnR5qlLqeK8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const normalize = (item: any) => {
  if (!item) return item;
  return {
    ...item,
    image_url: item.image_url || item.imageurl || item.ImageURL || "",
    registration_link: item.registration_link || item.registrationlink || "",
    summary_file_url: item.summary_file_url || item.summaryfileurl || "",
    roll_number: item.roll_number || item.rollnumber || "",
    work_url: item.work_url || item.workurl || "",
  };
};

export const storageService = {
  async uploadFile(file: File, folder: string): Promise<string> {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const fullPath = `${folder}/${fileName}`;
    
    console.log(`[Storage] Uploading ${file.name} to ${fullPath}...`);
    const { error } = await supabase.storage
      .from('the_compendium_files')
      .upload(fullPath, file, { cacheControl: '3600', upsert: true });

    if (error) throw new Error(`Storage Error: ${error.message}`);

    const { data: { publicUrl } } = supabase.storage
      .from('the_compendium_files')
      .getPublicUrl(fullPath);

    console.log(`[Storage] Success! URL: ${publicUrl}`);
    return publicUrl;
  }
};

export const api = {
  config: {
    async get(key: string) {
      try {
        const { data, error } = await supabase.from('site_config').select('value').eq('key', key).maybeSingle();
        if (error) {
          if (error.code === 'PGRST204' || error.code === 'PGRST205') throw new Error("TABLE_MISSING");
          return null;
        }
        return data?.value || null;
      } catch (e: any) {
        return null;
      }
    },
    async set(key: string, value: string) {
      const { error } = await supabase.from('site_config').upsert({ key, value }, { onConflict: 'key' });
      if (error) throw error;
    }
  },
  publications: {
    async getAll() {
      const { data, error } = await supabase.from('publications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(normalize);
    },
    async create(pub: Partial<Publication>) {
      const payload = { 
        title: pub.title,
        category: pub.category,
        author: pub.author,
        date: pub.date,
        summary: pub.summary,
        imageurl: pub.image_url,
        image_url: pub.image_url,
        file_url: pub.file_url
        // 'link' removed as it does not exist in your schema
      };
      const { data, error } = await supabase.from('publications').insert([payload]).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async update(id: string, pub: Partial<Publication>) {
      const payload = { 
        title: pub.title,
        category: pub.category,
        author: pub.author,
        summary: pub.summary,
        imageurl: pub.image_url,
        image_url: pub.image_url,
        file_url: pub.file_url
        // 'link' removed as it does not exist in your schema
      };
      const { data, error } = await supabase.from('publications').update(payload).eq('id', id).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async delete(id: string) {
      const { error } = await supabase.from('publications').delete().eq('id', id);
      if (error) throw error;
    }
  },
  achievements: {
    async getAll() {
      const { data, error } = await supabase.from('achievements').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(normalize);
    },
    async create(ach: Partial<Achievement>) {
      const payload = { 
        name: ach.name,
        rollnumber: ach.roll_number,
        department: ach.department,
        category: ach.category,
        description: ach.description,
        imageurl: ach.image_url,
        work_url: ach.work_url
      };
      const { data, error } = await supabase.from('achievements').insert([payload]).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async update(id: string, ach: Partial<Achievement>) {
      const payload = { 
        name: ach.name,
        rollnumber: ach.roll_number,
        department: ach.department,
        category: ach.category,
        description: ach.description,
        imageurl: ach.image_url,
        work_url: ach.work_url
      };
      const { data, error } = await supabase.from('achievements').update(payload).eq('id', id).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async delete(id: string) {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
    },
    async getAllSubmissions() {
      const { data, error } = await supabase.from('achievement_submissions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async createSubmission(sub: Partial<AchievementSubmission>) {
      const { data, error } = await supabase.from('achievement_submissions').insert([sub]).select();
      if (error) throw error;
      return data?.[0];
    },
    async deleteSubmission(id: string) {
      const { error } = await supabase.from('achievement_submissions').delete().eq('id', id);
      if (error) throw error;
    }
  },
  team: {
    async getAll() {
      const { data, error } = await supabase.from('team').select('*');
      if (error) throw error;
      return (data || []).map(normalize);
    },
    async delete(id: string) {
      const { error } = await supabase.from('team').delete().eq('id', id);
      if (error) throw error;
    }
  },
  events: {
    async getAll() {
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(normalize);
    },
    async create(event: Partial<Event>) {
      const payload = { 
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        imageurl: event.image_url,
        category: event.category,
        registration_link: event.registration_link,
        summary_file_url: event.summary_file_url
      };
      const { data, error } = await supabase.from('events').insert([payload]).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async update(id: string, event: Partial<Event>) {
      const payload = { 
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        imageurl: event.image_url,
        category: event.category,
        registration_link: event.registration_link,
        summary_file_url: event.summary_file_url
      };
      const { data, error } = await supabase.from('events').update(payload).eq('id', id).select();
      if (error) throw error;
      return normalize(data?.[0]);
    },
    async delete(id: string) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    }
  }
};