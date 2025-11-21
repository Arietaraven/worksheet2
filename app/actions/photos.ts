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
    throw new Error("Authentication required.");
  }

  return { supabase, user };
}

export async function createPhoto(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();

  if (!name || !url) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("photos").insert({
    name,
    image_url: url,
    user_id: user.id,
  });

  revalidatePath("/drive");
}

export async function updatePhoto(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();

  if (!id || !name || !url) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("photos")
    .update({ name, image_url: url })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/drive");
}

export async function deletePhoto(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("photos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/drive");
}

