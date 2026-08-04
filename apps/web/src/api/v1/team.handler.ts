/**
 * REST handlers for /api/v1/team.
 *
 * Same boundary contract as the projects handlers. The team service delegates
 * to the Better Auth organization API, which needs the request headers to
 * authorize the acting user, so we forward them alongside the resolved
 * organizationId.
 */
import { BadRequestError } from "@rk-kit/errors";
import {
  getTeam,
  inviteMember,
  removeMember,
} from "../../services/team-service";
import { requireApiSession } from "../middleware/require-api-session";
import { apiHandler, jsonOk } from "../middleware/json-response";

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new BadRequestError("Request body must be valid JSON");
  }
}

export function getTeamHandler(request: Request): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const team = await getTeam(organizationId, request.headers);
    return jsonOk(team);
  });
}

export function inviteMemberHandler(request: Request): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const body = await readJsonBody(request);
    await inviteMember(organizationId, request.headers, body);
    return jsonOk({ invited: true }, 201);
  });
}

export function removeMemberHandler(
  request: Request,
  memberId: string,
): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    await removeMember(organizationId, request.headers, { memberId });
    return jsonOk({ memberId, removed: true });
  });
}
