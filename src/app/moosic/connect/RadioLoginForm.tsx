"use client";

import { useActionState } from "react";
import { radioLoginAction, type RadioLoginState } from "./actions";

const initial: RadioLoginState = {};

export function RadioLoginForm() {
  const [state, formAction, pending] = useActionState(radioLoginAction, initial);

  return (
    <form action={formAction} className="space-y-4">
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
        {pending ? "…" : "authorize spotify →"}
      </button>
    </form>
  );
}
