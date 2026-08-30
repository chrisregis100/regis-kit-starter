import {
  createProjectHandler,
  listProjectsHandler,
} from "../../../../api/v1/projects.handler";

export function GET(request: Request): Promise<Response> {
  return listProjectsHandler(request);
}

export function POST(request: Request): Promise<Response> {
  return createProjectHandler(request);
}
