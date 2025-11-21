import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { DeleteAccountForm } from "@/components/auth/delete-account-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

const activities = [
  {
    title: "Activity 1 · Todos",
    description: "Personal Supabase-backed to-do list with CRUD + persistence.",
    href: "/todos",
  },
  {
    title: "Activity 2 · Drive Lite",
    description: "Upload photo URLs, search, and sort your personal drive.",
    href: "/drive",
  },
  {
    title: "Activity 3 · Food Reviews",
    description: "Gallery of dishes plus nested reviews for each item.",
    href: "/food",
  },
  {
    title: "Activity 4 · Pokémon Reviews",
    description: "Search Pokédex data and leave structured reviews.",
    href: "/pokemon",
  },
  {
    title: "Activity 5 · Markdown Notes",
    description: "Full Markdown editor with live preview & CRUD.",
    href: "/notes",
  },
];

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="stack" style={{ gap: 32 }}>
        <section className="card stack">
          <div>
            <p className="pill">Worksheet</p>
            <h1 className="heading">Worksheet 2</h1>
            <p className="subheading">
              Sign in or create a account to unlock all activities.
            </p>
          </div>
          <div className="grid grid-2">
            <div className="card stack">
              <h2>Log in</h2>
              <SignInForm />
            </div>
            <div className="card stack">
              <h2>Create an account</h2>
              <SignUpForm />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="stack" style={{ gap: 32 }}>
      <section className="card stack">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p className="pill">Welcome back</p>
          <h1 className="heading">Choose an activity</h1>
          <p className="subheading">
            Authenticated as <strong>{user.email}</strong>.
          </p>
        </div>
        <div className="grid grid-2">
          {activities.map((activity) => (
            <article key={activity.href} className="card stack">
              <div className="stack">
                <h3 style={{ margin: 0 }}>{activity.title}</h3>
                <p className="subheading" style={{ margin: 0 }}>
                  {activity.description}
                </p>
              </div>
              <Link href={activity.href} className="btn btn-primary">
                Open
              </Link>
            </article>
          ))}
        </div>
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "var(--surface-muted)",
          }}
        >
          <h3 style={{ margin: 0 }}>Session</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <form action={signOut}>
              <button className="btn btn-secondary" type="submit">
                Log out
              </button>
            </form>
            <details>
              <summary className="btn btn-danger" style={{ cursor: "pointer" }}>
                Delete account
              </summary>
              <DeleteAccountForm />
            </details>
          </div>
        </div>
      </section>
    </main>
  );
}
