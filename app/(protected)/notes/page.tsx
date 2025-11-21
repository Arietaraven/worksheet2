import { createNote } from "@/app/actions/notes";
import { SubmitButton } from "@/components/forms/submit-button";
import { NoteCard } from "@/components/notes/note-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NotesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user?.id || "")
    .order("created_at", { ascending: false });

  return (
    <section className="stack" style={{ gap: 32 }}>
      <div className="card stack">
        <p className="pill">Activity 5</p>
        <h2 className="heading" style={{ fontSize: 32 }}>
          Markdown Notes
        </h2>
        <p className="subheading">
          Capture knowledge in Markdown, then edit with raw + preview modes.
        </p>
        <form action={createNote} className="grid" style={{ gap: 12 }}>
          <label>
            Title
            <input className="input" name="title" placeholder="Sprint retro" required />
          </label>
          <label>
            Markdown
            <textarea
              className="textarea"
              name="content"
              placeholder="## Agenda"
              required
            />
          </label>
          <SubmitButton pendingLabel="Creating...">Create note</SubmitButton>
        </form>
      </div>

      <div className="stack">
        {notes?.length ? (
          notes.map((note) => <NoteCard key={note.id} note={note} />)
        ) : (
          <p className="card">No notes yet. Create one above.</p>
        )}
      </div>
    </section>
  );
}

