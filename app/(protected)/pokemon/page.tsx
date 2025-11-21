import {
  createPokemonReview,
  deletePokemonReview,
  updatePokemonReview,
} from "@/app/actions/pokemon";
import { SubmitButton } from "@/components/forms/submit-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchParams = {
  q?: string;
  sort?: string;
};

const sortOptions = [
  { value: "name_asc", label: "Pokemon A → Z" },
  { value: "name_desc", label: "Pokemon Z → A" },
  { value: "date_desc", label: "Newest reviews" },
  { value: "date_asc", label: "Oldest reviews" },
];

async function fetchPokemon(name: string) {
  if (!name) return null;
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name.toLowerCase())}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default async function PokemonPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const pokemonName = searchParams.q?.trim() ?? "";
  const sort = searchParams.sort ?? "date_desc";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let reviewsQuery = supabase
    .from("pokemon_reviews")
    .select("*")
    .eq("user_id", user?.id || "");

  switch (sort) {
    case "name_asc":
      reviewsQuery = reviewsQuery.order("pokemon_name", { ascending: true });
      break;
    case "name_desc":
      reviewsQuery = reviewsQuery.order("pokemon_name", { ascending: false });
      break;
    case "date_asc":
      reviewsQuery = reviewsQuery.order("created_at", { ascending: true });
      break;
    default:
      reviewsQuery = reviewsQuery.order("created_at", { ascending: false });
  }

  const [{ data: reviews }, pokemon] = await Promise.all([
    reviewsQuery,
    pokemonName ? fetchPokemon(pokemonName) : Promise.resolve(null),
  ]);

  return (
    <section className="stack" style={{ gap: 32 }}>
      <div className="card stack">
        <p className="pill">Activity 4</p>
        <h2 className="heading" style={{ fontSize: 32 }}>
          Pokémon Review App
        </h2>
        <p className="subheading">
          Search the public Pokédex, then leave reviews that only you can see.
        </p>
        <form method="get" className="grid grid-2" style={{ gap: 12 }}>
          <label>
            Pokémon name
            <input
              className="input"
              name="q"
              defaultValue={pokemonName}
              placeholder="Pikachu"
            />
          </label>
          <label>
            Sort reviews
            <select name="sort" defaultValue={sort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-secondary" type="submit">
            Search & sort
          </button>
        </form>
      </div>

      {pokemonName && (
        <div className="card stack">
          <h3 style={{ margin: 0 }}>Pokédex result</h3>
          {pokemon ? (
            <>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <img
                  src={pokemon.sprites.front_default ?? ""}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  style={{ imageRendering: "pixelated" }}
                />
                <div>
                  <p className="pill" style={{ textTransform: "capitalize" }}>
                    {pokemon.name}
                  </p>
                  <p>Height: {pokemon.height} · Weight: {pokemon.weight}</p>
                  <p>
                    Types:{" "}
                    {pokemon.types
                      .map((t: any) => t.type.name)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>No Pokémon found for “{pokemonName}”.</p>
          )}
        </div>
      )}

      <div className="card stack">
        <h3 style={{ margin: 0 }}>Create a review</h3>
        <form action={createPokemonReview} className="grid" style={{ gap: 12 }}>
          <label>
            Pokémon
            <input
              className="input"
              name="pokemon"
              defaultValue={pokemon?.name ?? pokemonName}
              placeholder="e.g. bulbasaur"
              required
            />
          </label>
          <label>
            Title
            <input className="input" name="title" placeholder="Quick take" required />
          </label>
          <label>
            Rating (1-5)
            <input className="input" type="number" name="rating" min={1} max={5} required />
          </label>
          <label>
            Review
            <textarea className="textarea" name="content" placeholder="Thoughts..." required />
          </label>
          <SubmitButton pendingLabel="Publishing...">Publish review</SubmitButton>
        </form>
      </div>

      <div className="stack">
        {reviews?.length ? (
          reviews.map((review) => (
            <article key={review.id} className="card stack">
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                <p className="pill" style={{ textTransform: "capitalize" }}>
                  {review.pokemon_name}
                </p>
                <span className="subheading" style={{ margin: 0 }}>
                  {new Date(review.created_at).toLocaleString()}
                </span>
              </div>
              <strong>
                {review.title} · {review.rating}/5
              </strong>
              <p>{review.content}</p>

              <form action={updatePokemonReview} className="grid" style={{ gap: 12 }}>
                <input type="hidden" name="id" value={review.id} />
                <label>
                  Title
                  <input className="input" name="title" defaultValue={review.title} />
                </label>
                <label>
                  Rating
                  <input
                    className="input"
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    defaultValue={review.rating}
                  />
                </label>
                <label>
                  Review
                  <textarea
                    className="textarea"
                    name="content"
                    defaultValue={review.content}
                  />
                </label>
                <SubmitButton className="btn btn-secondary" pendingLabel="Saving...">
                  Save review
                </SubmitButton>
              </form>
              <form action={deletePokemonReview}>
                <input type="hidden" name="id" value={review.id} />
                <SubmitButton className="btn btn-danger" pendingLabel="Deleting...">
                  Delete review
                </SubmitButton>
              </form>
            </article>
          ))
        ) : (
          <p className="card">No reviews yet. Write your first one!</p>
        )}
      </div>
    </section>
  );
}

