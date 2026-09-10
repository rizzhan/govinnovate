"use client";

import { applyToChallenge } from "@/lib/actions/domain";
import { Field, inputCls, SubmitButton } from "@/components/ui";

export function ApplyForm({ challengeId }: { challengeId: number }) {
  return (
    <form action={applyToChallenge} className="space-y-4">
      <input type="hidden" name="challenge_id" value={challengeId} />
      <Field label="Solution Summary">
        <textarea
          name="solution_summary"
          rows={3}
          required
          className={inputCls}
          placeholder="How will your solution meet the stated outcome?"
        />
      </Field>
      <Field label="Technological Readiness Level">
        <input
          type="text"
          name="tech_readiness"
          required
          className={inputCls}
          placeholder="e.g. TRL 7 – System prototype demonstrated in operational environment"
        />
      </Field>
      <Field label="What differentiates you?">
        <textarea
          name="differentiator"
          rows={2}
          className={inputCls}
          placeholder="Cost advantage, deployment track record, unique capability..."
        />
      </Field>
      <Field label="Funding Ask (₹)">
        <input type="number" name="ask_amount" min={0} className={inputCls} placeholder="5000000" />
      </Field>
      <div className="flex justify-end">
        <SubmitButton>Submit Application</SubmitButton>
      </div>
    </form>
  );
}