import {
  deleteProjectHandler,
  getProjectHandler,
  updateProjectHandler,
} from "../../../../../api/v1/projects.handler";

interface ProjectRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: ProjectRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  return getProjectHandler(request, id);
}

export async function PATCH(
  request: Request,
  context: ProjectRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  return updateProjectHandler(request, id);
}

export async function DELETE(
  request: Request,
  context: ProjectRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  return deleteProjectHandler(request, id);
}
