/* eslint-disable @next/next/no-img-element */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createPhoto,
  deletePhoto,
  updatePhoto,
} from "@/app/actions/photos";
import { SubmitButton } from "@/components/forms/submit-button";

type SearchParams = {
  query?: string;
  sort?: string;
};

const sortOptions = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "name_asc", label: "Name A → Z" },
  { value: "name_desc", label: "Name Z → A" },
];

export default async function DrivePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = searchParams?.query?.trim() ?? "";
  const sort = searchParams?.sort ?? "date_desc";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let builder = supabase
    .from("photos")
    .select("*")
    .eq("user_id", user?.id || "");

  if (query) {
    builder = builder.ilike("name", `%${query}%`);
  }

  switch (sort) {
    case "name_asc":
      builder = builder.order("name", { ascending: true });
      break;
    case "name_desc":
      builder = builder.order("name", { ascending: false });
      break;
    case "date_asc":
      builder = builder.order("created_at", { ascending: true });
      break;
    default:
      builder = builder.order("created_at", { ascending: false });
  }

  const { data: photos } = await builder;

  return (
    <section className="stack" style={{ gap: 32 }}>
      <div className="card stack">
        <p className="pill">Activity 2</p>
        <h2 className="heading" style={{ fontSize: 32 }}>
          Google Drive “Lite”
        </h2>
        <p className="subheading">
          Manage photo. Use the search and sort
          controls to quickly find what you need.
        </p>

        <form
          action={createPhoto}
          className="grid"
          style={{ gap: 12, maxWidth: 600 }}
        >
          <label>
            File name
            <input className="input" name="name" placeholder="Vacation.jpg" required />
          </label>
          <label>
            Image URL
            <input
              className="input"
              name="url"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </label>
          <SubmitButton pendingLabel="Uploading...">Save photo</SubmitButton>
        </form>
      </div>

      <div className="card stack">
        <form className="grid grid-2" style={{ gap: 16 }} method="get">
          <label>
            Search by name
            <input className="input" name="query" defaultValue={query} placeholder="e.g. sunset" />
          </label>
          <label>
            Sort
            <select name="sort" defaultValue={sort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-secondary" type="submit">
            Apply filters
          </button>
        </form>
      </div>

      <div className="grid grid-2">
        {photos?.length ? (
          photos.map((photo) => (
            <article key={photo.id} className="card stack">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="pill">{photo.name}</div>
                <span className="subheading" style={{ margin: 0 }}>
                  {new Date(photo.created_at).toLocaleString()}
                </span>
              </div>
              {photo.image_url && (
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                  }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.name}
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                </div>
              )}
              <form
                action={updatePhoto}
                className="stack"
              >
                <input type="hidden" name="id" value={photo.id} />
                <label>
                  Name
                  <input className="input" name="name" defaultValue={photo.name} required />
                </label>
                <label>
                  Image URL
                  <input className="input" name="url" defaultValue={photo.image_url ?? ""} required />
                </label>
                <SubmitButton className="btn btn-secondary" pendingLabel="Saving...">
                  Update
                </SubmitButton>
              </form>
              <form
                action={deletePhoto}
                method="post"
                style={{ marginTop: 'auto' }}
              >
                <input type="hidden" name="id" value={photo.id} />
                <SubmitButton className="btn btn-danger" pendingLabel="Removing...">
                  Delete
                </SubmitButton>
              </form>
            </article>
          ))
        ) : (
          <p className="card">No photos yet. Add one above!</p>
        )}
      </div>
    </section>
  );
}

