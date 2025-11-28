'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTodo(formData: FormData) {
  const title = formData.get('title')?.toString().trim();
  if (!title) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to create todos');
  }

  await supabase
    .from('todos')
    .insert({ title, user_id: user.id, completed: false });

  revalidatePath('/todos');
}

export async function toggleTodo(formData: FormData) {
  const id = formData.get('id')?.toString();
  const completed = formData.get('completed')?.toString() === 'true';

  if (!id) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update todos');
  }

  await supabase
    .from('todos')
    .update({ completed: !completed })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/todos');
}

export async function renameTodo(formData: FormData) {
  const id = formData.get('id')?.toString();
  const title = formData.get('title')?.toString().trim();

  if (!id || !title) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update todos');
  }

  await supabase
    .from('todos')
    .update({ title })
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/todos');
}

export async function deleteTodo(formData: FormData) {
  const id = formData.get('id')?.toString();
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to delete todos');
  }

  await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  revalidatePath('/todos');
}
