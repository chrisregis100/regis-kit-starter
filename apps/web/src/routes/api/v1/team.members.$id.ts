/**
 * REST route: /api/v1/team/members/:id — remove a member.
 * Thin wiring only; logic lives in api/v1/team.handler.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import { removeMemberHandler } from "../../../api/v1/team.handler";

export const Route = createFileRoute("/api/v1/team/members/$id")({
  server: {
    handlers: {
      DELETE: ({ request, params }) => removeMemberHandler(request, params.id),
    },
  },
});
