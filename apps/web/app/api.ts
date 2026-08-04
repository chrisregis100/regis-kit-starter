/**
 * TanStack Start API handler — catch-all for API routes.
 *
 * Handles the file-based API routes under app/routes/api/*.
 */
import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from "@tanstack/start/api";

export default createStartAPIHandler(defaultAPIFileRouteHandler);
