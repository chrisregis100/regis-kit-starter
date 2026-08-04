/**
 * REST route: /api/v1/team — list organization members and invitations.
 * Thin wiring only; logic lives in api/v1/team.handler.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import { getTeamHandler } from "../../../api/v1/team.handler";

export const Route = createFileRoute("/api/v1/team")({
  server: {
    handlers: {
      GET: ({ request }) => getTeamHandler(request),
    },
  },
});
