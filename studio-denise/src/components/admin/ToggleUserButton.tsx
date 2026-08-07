"use client";

import { useFormState } from "react-dom";
import { toggleUserActiveAction } from "@/app/actions/admin";
import { SubmitButton } from "@/components/SubmitButton";

export function ToggleUserButton({ userId, active }: { userId: string; active: boolean }) {
  const [state, action] = useFormState(toggleUserActiveAction, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="userId" value={userId} />
      {state?.error && <p className="mb-2 text-sm text-danger">{state.error}</p>}
      <SubmitButton
        className={
          active
            ? "btn-outline border-danger/40 py-2.5 text-sm text-danger hover:bg-danger/5"
            : "btn-outline py-2.5 text-sm"
        }
      >
        {active ? "Bloquear acesso" : "Reativar acesso"}
      </SubmitButton>
    </form>
  );
}
