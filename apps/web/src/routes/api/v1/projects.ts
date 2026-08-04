/**
 * REST route: /api/v1/projects — collection endpoints.
 * Thin wiring only; logic lives in api/v1/projects.handler.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  createProjectHandler,
  listProjectsHandler,
} from "../../../api/v1/projects.handler";

export const Route = createFileRoute("/api/v1/projects")({
  server: {
    handlers: {
      GET: ({ request }) => listProjectsHandler(request),
      POST: ({ request }) => createProjectHandler(request),
    },
  },
});
