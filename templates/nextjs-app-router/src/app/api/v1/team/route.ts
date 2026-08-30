import { getTeamHandler } from "../../../../api/v1/team.handler";

export function GET(request: Request): Promise<Response> {
  return getTeamHandler(request);
}
