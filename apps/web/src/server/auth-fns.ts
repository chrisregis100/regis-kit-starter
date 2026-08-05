/**
 * Public auth server functions (no session required).
 *
 * These run on the server and are safe to call from public routes.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { userExistsByEmail } from "@rk-kit/auth";

const emailInput = z.object({
  email: z.string().email("A valid email address is required"),
});

/**
 * Whether an account exists for the submitted email.
 *
 * SECURITY NOTE: exposing this result enables user enumeration. It is used
 * intentionally to give explicit "email not found" feedback on the
 * forgot-password form, per product decision.
 */
export const checkEmailExistsFn = createServerFn({ method: "POST" })
  .validator(emailInput)
  .handler(async (ctx) => {
    return { exists: await userExistsByEmail(ctx.data.email) };
  });
