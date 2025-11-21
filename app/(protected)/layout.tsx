import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="stack" style={{ gap: 24 }}>
      <header className="card" style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <h1 className="heading" style={{ fontSize: 24, margin: 0 }}>
            Multiple Activities
          </h1>
          <p className="subheading" style={{ marginBottom: 0 }}>
            Signed in as {user.email}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-secondary">
            Dashboard
          </Link>
          <form action={signOut}>
            <button type="submit" className="btn btn-secondary">
              Log out
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}

