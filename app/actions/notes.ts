'use server';

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getUserOrThrow() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  return { supabase, user };
}

export async function createNote(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString() ?? "";

  if (!title) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("notes").insert({
    title,
    content,
    user_id: user.id,
  });

  revalidatePath("/notes");
}

export async function updateNote(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString() ?? "";

  if (!id || !title) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notes");
}

export async function deleteNote(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    return;
  }
  const { supabase, user } = await getUserOrThrow();
  await supabase.from("notes").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/notes");
}

