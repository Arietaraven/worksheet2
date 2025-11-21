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

export async function createPokemonReview(formData: FormData) {
  const pokemon = formData.get("pokemon")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const rating = Number(formData.get("rating"));

  if (!pokemon || !title || !content || Number.isNaN(rating)) {
    return { success: false, message: "All fields are required." };
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase.from("pokemon_reviews").insert({
    pokemon_name: pokemon.toLowerCase(),
    title,
    content,
    rating,
    user_id: user.id,
  });

  revalidatePath("/pokemon");
  return { success: true };
}

export async function updatePokemonReview(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const rating = Number(formData.get("rating"));

  if (!id || !title || !content || Number.isNaN(rating)) {
    return { success: false, message: "Missing review data." };
  }

  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("pokemon_reviews")
    .update({ title, content, rating })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/pokemon");
  return { success: true };
}

export async function deletePokemonReview(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    return { success: false, message: "Review id missing." };
  }
  const { supabase, user } = await getUserOrThrow();
  await supabase
    .from("pokemon_reviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/pokemon");
  return { success: true };
}

