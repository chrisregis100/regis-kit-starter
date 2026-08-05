import { Input, Label } from "@rk-kit/ui";
import type { UseMathChallenge } from "./use-math-challenge";

interface MathChallengeFieldProps {
  challenge: UseMathChallenge;
  id?: string;
}

/** Renders the "are you human?" arithmetic field bound to a useMathChallenge instance. */
export function MathChallengeField({ challenge, id = "human-check" }: MathChallengeFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        Quick check: what is {challenge.isReady ? challenge.question : "…"}?
      </Label>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="Your answer"
        value={challenge.input}
        onChange={(e) => challenge.setInput(e.target.value.replace(/[^\d-]/g, ""))}
        disabled={!challenge.isReady}
        required
      />
    </div>
  );
}
