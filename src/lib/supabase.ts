import { createClient } from '@supabase/supabase-js';
import { LOCAL_MEMORY, mockAPI } from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (!LOCAL_MEMORY) {
    throw new Error('Missing Supabase environment variables');
  }
}

export const supabase = LOCAL_MEMORY ? null : createClient(supabaseUrl, supabaseAnonKey);

export const getUser = async () => {
  if (LOCAL_MEMORY) {
    return await mockAPI.getUser();
  }
  
  const { data: { user }, error } = await supabase!.auth.getUser();
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  if (LOCAL_MEMORY) {
    return await mockAPI.signOut();
  }
  
  const { error } = await supabase!.auth.signOut();
  if (error) throw error;
};

export const uploadLogo = async (file: File, startupId: string) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.uploadLogo(file, startupId);
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${startupId}/logo.${fileExt}`;
  
  const { data, error } = await supabase!.storage
    .from('startup-logos')
    .upload(fileName, file, {
      upsert: true
    });

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase!.storage
    .from('startup-logos')
    .getPublicUrl(fileName);

  return publicUrl;
};

export const createStartup = async (startupData: any) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.createStartup(startupData);
  }
  
  const { data, error } = await supabase!
    .from('startups')
    .insert([startupData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getStartups = async (userId: string) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.getStartups(userId);
  }
  
  const { data, error } = await supabase!
    .from('startups')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getSubmissionJobs = async (userId: string) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.getSubmissionJobs(userId);
  }
  
  const { data, error } = await supabase!
    .from('submission_jobs')
    .select(`
      *,
      startup:startups(name, url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getSubmissionResults = async (jobId: string) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.getSubmissionResults(jobId);
  }
  
  const { data, error } = await supabase!
    .from('submission_results')
    .select('*')
    .eq('job_id', jobId)
    .order('directory_name');

  if (error) throw error;
  return data;
};

export const createSubmissionJob = async (jobData: any) => {
  if (LOCAL_MEMORY) {
    return await mockAPI.createSubmissionJob(jobData);
  }
  
  const { data, error } = await supabase!
    .from('submission_jobs')
    .insert([jobData])
    .select()
    .single();

  if (error) throw error;
  return data;
};