import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class GuestbookService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    // Priority: Try to get the backend-specific keys first, then fallback to VITE keys
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL') || 
                        this.configService.get<string>('VITE_SUPABASE_URL');
                        
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY') || 
                        this.configService.get<string>('SUPABASE_KEY') ||
                        this.configService.get<string>('VITE_SUPABASE_ANON_KEY');

    console.log('=== GuestbookService Initializing ===');
    console.log('SUPABASE_URL:', supabaseUrl ? 'LOADED' : 'NOT_FOUND');
    console.log('SUPABASE_KEY:', supabaseKey ? '***found***' : 'NOT_FOUND');

    // Initialize Supabase client
    // We use "as string" or default to empty string to satisfy TypeScript
    this.supabase = createClient(supabaseUrl || '', supabaseKey || '');
  }

  // Requirement: GET/list/select
  async findAll() {
    const { data, error } = await this.supabase
      .from('guestbook') // Ensure this matches your supabase_schema.sql table name
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET Error:', error.message);
      throw new Error(error.message);
    }
    return data;
  }

  // Requirement: POST/insert
  async create(dto: any) {
    // Ensure the DTO matches your table columns (name, message)
    const { data, error } = await this.supabase
      .from('guestbook')
      .insert([
        { 
          name: dto.name, 
          message: dto.message 
        }
      ])
      .select();

    if (error) {
      console.error('Supabase POST Error:', error.message);
      throw new Error(error.message);
    }
    return data;
  }

  // Requirement: Extra methods (PUT/DELETE)
  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string) {
    const { data, error } = await this.supabase
      .from('guestbook')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
}