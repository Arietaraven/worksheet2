'use client';

import { type ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  pendingLabel = "Saving...",
  children,
  className = "btn btn-primary",
  disabled,
}: {
  pendingLabel?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={status.pending || disabled}
    >
      {status.pending ? pendingLabel : children}
    </button>
  );
}

