'use client';

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SubmitButton } from "@/components/forms/submit-button";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type NoteCardProps = {
  note: Note;
  updateAction: (formData: FormData) => void | Promise<void>;
  deleteAction: (formData: FormData) => void | Promise<void>;
};

export function NoteCard({ note, updateAction, deleteAction }: NoteCardProps) {
  const [mode, setMode] = useState<"preview" | "raw">("preview");

  return (
    <article className="card stack">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{note.title}</h3>
          <p className="subheading" style={{ margin: 0 }}>
            {new Date(note.created_at).toLocaleString()}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className={`btn ${mode === "preview" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMode("preview")}
          >
            Preview
          </button>
          <button
            type="button"
            className={`btn ${mode === "raw" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setMode("raw")}
          >
            Raw
          </button>
        </div>
      </header>

      <section
        style={{
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 16,
          background: mode === "preview" ? "var(--surface-muted)" : "transparent",
          minHeight: 100,
        }}
      >
        {mode === "preview" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
        ) : (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {note.content}
          </pre>
        )}
      </section>

      <form action={updateAction} className="grid" style={{ gap: 12 }}>
        <input type="hidden" name="id" value={note.id} />
        <label>
          Title
          <input className="input" name="title" defaultValue={note.title} required />
        </label>
        <label>
          Markdown
          <textarea className="textarea" name="content" defaultValue={note.content} required />
        </label>
        <SubmitButton className="btn btn-secondary" pendingLabel="Saving...">
          Save note
        </SubmitButton>
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="id" value={note.id} />
        <SubmitButton className="btn btn-danger" pendingLabel="Deleting...">
          Delete note
        </SubmitButton>
      </form>
    </article>
  );
}

