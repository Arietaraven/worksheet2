'use client';

import { useActionState, useState } from "react";
import { deleteAccount } from "@/app/actions/auth";
import { SubmitButton } from "@/components/forms/submit-button";

const initialState = { message: "", success: false };

export function DeleteAccountForm() {
  const [confirmed, setConfirmed] = useState(false);
  const [state, formAction] = useActionState(deleteAccount, initialState);

  return (
    <form className="stack" action={formAction}>
      <p className="subheading">
        Deleting your account removes all of your activities. This cannot be
        undone.
      </p>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        I understand the consequences.
      </label>
      {state.message && (
        <p style={{ color: state.success ? "green" : "var(--danger)" }}>
          {state.message}
        </p>
      )}
      <SubmitButton
        className="btn btn-danger"
        pendingLabel="Deleting..."
        disabled={!confirmed}
      >
        Delete account
      </SubmitButton>
      <input type="hidden" name="confirmed" value={String(confirmed)} />
    </form>
  );
}

