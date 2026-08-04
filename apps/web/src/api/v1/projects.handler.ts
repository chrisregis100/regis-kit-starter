/**
 * REST handlers for /api/v1/projects.
 *
 * Each handler: authorize (session cookie → organizationId), delegate to the
 * project service (which validates input and enforces tenant isolation), and
 * return the JSON envelope. Validation and SQL live in the service — handlers
 * only translate HTTP ⇆ service calls.
 */
import { BadRequestError } from "@rk-kit/errors";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../../services/project-service";
import { requireApiSession } from "../middleware/require-api-session";
import { apiHandler, jsonOk } from "../middleware/json-response";

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new BadRequestError("Request body must be valid JSON");
  }
}

export function listProjectsHandler(request: Request): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const projects = await listProjects(organizationId);
    return jsonOk(projects);
  });
}

export function createProjectHandler(request: Request): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const body = await readJsonBody(request);
    const created = await createProject(organizationId, body);
    return jsonOk(created, 201);
  });
}

export function getProjectHandler(
  request: Request,
  projectId: string,
): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const project = await getProject(organizationId, projectId);
    return jsonOk(project);
  });
}

export function updateProjectHandler(
  request: Request,
  projectId: string,
): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    const body = await readJsonBody(request);
    const updated = await updateProject(organizationId, projectId, body);
    return jsonOk(updated);
  });
}

export function deleteProjectHandler(
  request: Request,
  projectId: string,
): Promise<Response> {
  return apiHandler(async () => {
    const { organizationId } = await requireApiSession(request);
    await deleteProject(organizationId, projectId);
    return jsonOk({ id: projectId, deleted: true });
  });
}
