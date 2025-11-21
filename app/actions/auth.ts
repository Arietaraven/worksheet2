'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ActionState = { success: boolean; message: string };

function response(message: string, success = false): ActionState {
  return { success, message };
}

export async function signUp(
  _prevState: ActionState | undefined,
  formData?: FormData
) {
  const email = formData?.get("email")?.toString().trim();
  const password = formData?.get("password")?.toString() ?? "";

  if (!email || !password) {
    return response("Email and password are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return response(error.message);
  }

  revalidatePath("/");
  return response("Check your inbox to confirm the new account.", true);
}

export async function signIn(
  _prevState: ActionState | undefined,
  formData?: FormData
) {
  const email = formData?.get("email")?.toString().trim();
  const password = formData?.get("password")?.toString() ?? "";

  if (!email || !password) {
    return response("Email and password are required.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return response(error.message);
  }

  revalidatePath("/");
  return response("Signed in.", true);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/");
}

export async function deleteAccount(
  _prevState: ActionState | undefined,
  formData?: FormData
) {
  if (formData && formData.get("confirmed") !== "true") {
    return response("Confirm the checkbox to delete your account.");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return response("You must be signed in to delete your account.");
  }

  const admin = createSupabaseAdminClient();

  const tables = [
    "todos",
    "photos",
    "food_reviews",
    "food_photos",
    "pokemon_reviews",
    "notes",
  ];

  try {
    await Promise.all(
      tables.map((table) =>
        admin.from(table).delete().eq("user_id", user.id)
      )
    );

    await admin.auth.admin.deleteUser(user.id);
    revalidatePath("/");
    await supabase.auth.signOut();
    revalidatePath("/");
    return response("Account deleted. Goodbye!", true);
  } catch (error) {
    console.error(error);
    return response("Unable to delete account. Please try again.");
  }
}

