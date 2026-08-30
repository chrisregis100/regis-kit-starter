import { removeMemberHandler } from "../../../../../../api/v1/team.handler";

interface MemberRouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  request: Request,
  context: MemberRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  return removeMemberHandler(request, id);
}
