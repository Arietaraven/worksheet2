import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createTodo,
  deleteTodo,
  renameTodo,
  toggleTodo,
} from "@/app/actions/todos";
import { SubmitButton } from "@/components/forms/submit-button";

export default async function TodosPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: true });

  return (
    <section className="stack">
      <div className="card stack">
        <div>
          <p className="pill">Activity 1</p>
          <h2 className="heading" style={{ fontSize: 32 }}>
            Supabase To-do List
          </h2>
          <p className="subheading">
            Create, read, update, and delete todos bound to your account.
          </p>
        </div>
        <form
          action={async (formData) => {
            await createTodo(formData);
          }}
          className="stack"
          style={{ maxWidth: 480 }}
        >
          <label>
            New task
            <input className="input" name="title" placeholder="Ship feature" />
          </label>
          <SubmitButton pendingLabel="Adding...">Add todo</SubmitButton>
        </form>
      </div>

      <ul className="list">
        {todos?.length ? (
          todos.map((todo) => (
            <li key={todo.id} className="list-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <strong>{todo.title}</strong>
                <form
                  action={async (formData) => {
                    await toggleTodo(formData);
                  }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <input
                    type="hidden"
                    name="completed"
                    value={String(todo.completed)}
                  />
                  <SubmitButton className="btn btn-secondary" pendingLabel="Saving...">
                    {todo.completed ? "Mark incomplete" : "Mark complete"}
                  </SubmitButton>
                </form>
              </div>

              <form
                action={async (formData) => {
                  await renameTodo(formData);
                }}
                className="stack"
                style={{ marginTop: 8 }}
              >
                <input type="hidden" name="id" value={todo.id} />
                <label>
                  Update title
                  <input
                    className="input"
                    name="title"
                    defaultValue={todo.title}
                  />
                </label>
                <SubmitButton className="btn btn-secondary" pendingLabel="Updating...">
                  Save changes
                </SubmitButton>
              </form>
              <form
                action={async (formData) => {
                  await deleteTodo(formData);
                }}
              >
                <input type="hidden" name="id" value={todo.id} />
                <SubmitButton className="btn btn-danger" pendingLabel="Deleting...">
                  Delete
                </SubmitButton>
              </form>
            </li>
          ))
        ) : (
          <li className="card">No todos yet. Add your first task!</li>
        )}
      </ul>
    </section>
  );
}

