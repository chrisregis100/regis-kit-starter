/**
 * REST route: /api/v1/team/invitations — create an invitation.
 * Thin wiring only; logic lives in api/v1/team.handler.ts.
 */
import { createFileRoute } from "@tanstack/react-router";
import { inviteMemberHandler } from "../../../api/v1/team.handler";

export const Route = createFileRoute("/api/v1/team/invitations")({
  server: {
    handlers: {
      POST: ({ request }) => inviteMemberHandler(request),
    },
  },
});
