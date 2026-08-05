import { useCallback, useEffect, useState } from "react";

type Operator = "+" | "-";

interface Challenge {
  a: number;
  b: number;
  operator: Operator;
  answer: number;
}

const OPERATORS: readonly Operator[] = ["+", "-"];

function randomInt(max: number): number {
  return Math.floor(Math.random() * max) + 1;
}

/** Builds a small arithmetic challenge with a non-negative answer. */
function createChallenge(): Challenge {
  const operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)] as Operator;
  let a = randomInt(9);
  let b = randomInt(9);
  if (operator === "-" && b > a) [a, b] = [b, a];
  const answer = operator === "+" ? a + b : a - b;
  return { a, b, operator, answer };
}

export interface UseMathChallenge {
  /** Human-readable question, e.g. "7 + 3". Empty until generated on the client. */
  question: string;
  /** Whether a challenge has been generated (client-only, avoids hydration mismatch). */
  isReady: boolean;
  input: string;
  setInput: (value: string) => void;
  isCorrect: boolean;
  regenerate: () => void;
}

/**
 * Lightweight, client-only "are you human?" arithmetic challenge.
 *
 * The challenge is generated in an effect (never during SSR) so the random
 * values cannot cause a hydration mismatch. It is a low-friction bot deterrent,
 * not a cryptographic guarantee.
 */
export function useMathChallenge(): UseMathChallenge {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    setChallenge(createChallenge());
  }, []);

  const regenerate = useCallback(() => {
    setChallenge(createChallenge());
    setInput("");
  }, []);

  const isCorrect =
    challenge !== null && input.trim() !== "" && Number(input) === challenge.answer;

  return {
    question: challenge ? `${challenge.a} ${challenge.operator} ${challenge.b}` : "",
    isReady: challenge !== null,
    input,
    setInput,
    isCorrect,
    regenerate,
  };
}
