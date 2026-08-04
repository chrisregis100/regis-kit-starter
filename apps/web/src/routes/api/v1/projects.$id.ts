/**
 * REST route: /api/v1/projects/:id — single-resource endpoints.
 * Thin wiring only; logic lives in api/v1/projects.handler.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import {
  deleteProjectHandler,
  getProjectHandler,
  updateProjectHandler,
} from "../../../api/v1/projects.handler";

export const Route = createFileRoute("/api/v1/projects/$id")({
  server: {
    handlers: {
      GET: ({ request, params }) => getProjectHandler(request, params.id),
      PATCH: ({ request, params }) => updateProjectHandler(request, params.id),
      DELETE: ({ request, params }) => deleteProjectHandler(request, params.id),
    },
  },
});
