"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/blog/actions";

const initial: ActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">write</h1>
      <p className="text-sm text-ink-soft">Enter the admin password to post.</p>
      <label className="block text-xs uppercase tracking-widest text-ink-faint">
        password
        <input
          type="password"
          name="password"
          className="field mt-2"
          autoComplete="current-password"
          required
        />
      </label>
      {state.error && <p className="text-sm text-flower">{state.error}</p>}
      <button type="submit" className="btn btn-solid" disabled={pending}>
        {pending ? "…" : "unlock"}
      </button>
    </form>
  );
}
