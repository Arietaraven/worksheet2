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

export async function createFoodPhoto(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();

  if (!name || !url) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("food_photos").insert({
    name,
    image_url: url,
    user_id: user.id,
  });
  revalidatePath("/food");
}

export async function updateFoodPhoto(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const url = formData.get("url")?.toString().trim();

  if (!id || !name || !url) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("food_photos")
    .update({ name, image_url: url })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/food");
}

export async function deleteFoodPhoto(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("food_reviews").delete().eq("food_id", id);
  await supabase.from("food_photos").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/food");
}

export async function createFoodReview(formData: FormData) {
  const foodId = formData.get("foodId")?.toString();
  const rating = Number(formData.get("rating"));
  const content = formData.get("content")?.toString().trim();

  if (!foodId || !content || Number.isNaN(rating)) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("food_reviews").insert({
    food_id: foodId,
    rating,
    content,
    user_id: user.id,
  });

  revalidatePath("/food");
}

export async function updateFoodReview(formData: FormData) {
  const id = formData.get("id")?.toString();
  const rating = Number(formData.get("rating"));
  const content = formData.get("content")?.toString().trim();

  if (!id || !content || Number.isNaN(rating)) {
    return;
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("food_reviews")
    .update({ rating, content })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/food");
}

export async function deleteFoodReview(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    return;
  }
  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("food_reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/food");
}

