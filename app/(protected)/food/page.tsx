import {
  createFoodPhoto,
  createFoodReview,
  deleteFoodPhoto,
  deleteFoodReview,
  updateFoodPhoto,
  updateFoodReview,
} from "@/app/actions/food";
import { SubmitButton } from "@/components/forms/submit-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchParams = {
  sort?: string;
};

const sortOptions = [
  { label: "Name A → Z", value: "name_asc" },
  { label: "Name Z → A", value: "name_desc" },
  { label: "Newest first", value: "date_desc" },
  { label: "Oldest first", value: "date_asc" },
];

export default async function FoodPage({
  searchParams = {},
}: {
  searchParams?: SearchParams;
}) {
  const sort = searchParams.sort ?? "date_desc";

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("food_photos")
    .select("*, food_reviews(*)")
    .eq("user_id", user?.id || "");

  switch (sort) {
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    case "date_asc":
      query = query.order("created_at", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: foods } = await query;

  return (
    <section className="stack" style={{ gap: 32 }}>
      <div className="card stack">
        <p className="pill">Activity 3</p>
        <h2 className="heading" style={{ fontSize: 32 }}>
          Food Review App
        </h2>
        <p className="subheading">
          Upload food photos, then collect ratings & reviews. Each review is
          linked to its parent dish.
        </p>
        <form action={createFoodPhoto} className="grid" style={{ gap: 12 }}>
          <label>
            Dish name
            <input className="input" name="name" placeholder="Spicy ramen" required />
          </label>
          <label>
            Image URL
            <input className="input" name="url" placeholder="https://..." required />
          </label>
          <SubmitButton pendingLabel="Saving...">Add dish</SubmitButton>
        </form>
      </div>

      <div className="card">
        <form method="get" style={{ display: "flex", gap: 12 }}>
          <label style={{ flex: 1 }}>
            Sort dishes
            <select name="sort" defaultValue={sort}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-secondary" type="submit">
            Sort
          </button>
        </form>
      </div>

      <div className="stack">
        {foods?.length ? (
          foods.map((food) => (
            <article key={food.id} className="card stack">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <h3 style={{ margin: 0 }}>{food.name}</h3>
                <span className="subheading" style={{ margin: 0 }}>
                  {new Date(food.created_at).toLocaleString()}
                </span>
              </div>
              {food.image_url && (
                <img
                  src={food.image_url}
                  alt={food.name}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                  }}
                />
              )}
              <form action={updateFoodPhoto} className="grid" style={{ gap: 12 }}>
                <input type="hidden" name="id" value={food.id} />
                <label>
                  Name
                  <input className="input" defaultValue={food.name} name="name" required />
                </label>
                <label>
                  Image URL
                  <input
                    className="input"
                    defaultValue={food.image_url ?? ""}
                    name="url"
                    required
                  />
                </label>
                <SubmitButton className="btn btn-secondary" pendingLabel="Updating...">
                  Save dish
                </SubmitButton>
              </form>
              <form action={deleteFoodPhoto}>
                <input type="hidden" name="id" value={food.id} />
                <SubmitButton className="btn btn-danger" pendingLabel="Removing...">
                  Delete dish
                </SubmitButton>
              </form>

              <hr className="divider" />
              <h4 style={{ margin: 0 }}>Reviews</h4>

              <form action={createFoodReview} className="grid" style={{ gap: 12 }}>
                <input type="hidden" name="foodId" value={food.id} />
                <label>
                  Rating (1-5)
                  <input className="input" type="number" min={1} max={5} name="rating" required />
                </label>
                <label>
                  Thoughts
                  <textarea className="textarea" name="content" placeholder="Tell us more..." required />
                </label>
                <SubmitButton pendingLabel="Posting...">Add review</SubmitButton>
              </form>

              <div className="stack">
                {food.food_reviews?.length ? (
                  food.food_reviews.map((review: any) => (
                    <div key={review.id} className="list-item">
                      <strong>Rating: {review.rating}/5</strong>
                      <p>{review.content}</p>
                      <form action={updateFoodReview} className="grid" style={{ gap: 8 }}>
                        <input type="hidden" name="id" value={review.id} />
                        <label>
                          Rating
                          <input
                            className="input"
                            type="number"
                            name="rating"
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
                            required
                          />
                        </label>
                        <SubmitButton className="btn btn-secondary" pendingLabel="Updating...">
                          Update review
                        </SubmitButton>
                      </form>
                      <form action={deleteFoodReview}>
                        <input type="hidden" name="id" value={review.id} />
                        <SubmitButton className="btn btn-danger" pendingLabel="Deleting...">
                          Delete review
                        </SubmitButton>
                      </form>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="card">No dishes yet. Add one above!</p>
        )}
      </div>
    </section>
  );
}

