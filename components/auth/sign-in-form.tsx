'use client';

import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = { message: "", success: false };

export function SignInForm() {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form className="stack" action={formAction}>
      <div className="stack">
        <label>
          Email
          <input className="input" name="email" type="email" required />
        </label>
        <label>
          Password
          <input className="input" name="password" type="password" required />
        </label>
      </div>
      {state.message && (
        <p style={{ color: state.success ? "green" : "var(--danger)" }}>
          {state.message}
        </p>
      )}
      <SubmitButton pendingLabel="Signing in...">Log in</SubmitButton>
    </form>
  );
}

