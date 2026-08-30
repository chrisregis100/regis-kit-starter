import { inviteMemberHandler } from "../../../../../api/v1/team.handler";

export function POST(request: Request): Promise<Response> {
  return inviteMemberHandler(request);
}
