/**
 * JSON envelope helpers for the REST API (`/api/v1/*`).
 *
 * Success: `{ data: T }`. Errors: `{ error: { code, message, fields? } }`,
 * serialized from the typed @rk-kit/errors hierarchy via handleUnknownError,
 * so internal details never leak to clients.
 */
import { handleUnknownError } from "@rk-kit/errors";

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json({ data }, { status });
}

export function jsonError(error: unknown): Response {
  const { status, body } = handleUnknownError(error);
  return Response.json(body, { status });
}

/**
 * Runs a REST handler and converts any thrown value into the JSON error
 * envelope. Every handler wraps its body in this so error handling is uniform.
 */
export async function apiHandler(
  run: () => Promise<Response>,
): Promise<Response> {
  try {
    return await run();
  } catch (error) {
    return jsonError(error);
  }
}
