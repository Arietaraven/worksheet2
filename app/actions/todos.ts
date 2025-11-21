'use server';

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getUserOrThrow() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in.");
  }

  return { supabase, user };
}

export async function createTodo(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  if (!title) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("todos").insert({
    title,
    completed: false,
    user_id: user.id,
  });

  revalidatePath("/todos");
}

export async function toggleTodo(formData: FormData) {
  const id = formData.get("id")?.toString();
  const completed = formData.get("completed")?.toString() === "true";

  if (!id) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("todos")
    .update({ completed: !completed })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/todos");
}

export async function renameTodo(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();

  if (!id || !title) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("todos")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/todos");
}

export async function deleteTodo(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("todos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/todos");
}

