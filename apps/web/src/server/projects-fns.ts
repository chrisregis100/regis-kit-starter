/**
 * Project server functions — the front (TanStack Start) boundary.
 *
 * Each function validates its input, resolves the tenant from the session via
 * requireOrganization (never trusting a client-provided org id), then delegates
 * to the project service. Routes import these in loaders and event handlers.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireOrganization } from "@rk-kit/auth";
import {
  createProject,
  createProjectSchema,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  updateProjectSchema,
} from "../services/project-service";

const projectIdSchema = z.object({
  id: z.string().min(1, "Project id is required"),
});

const updateProjectFnSchema = projectIdSchema.extend({
  data: updateProjectSchema,
});

export const listProjectsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return listProjects(organizationId);
  },
);

export const getProjectFn = createServerFn({ method: "GET" })
  .validator(projectIdSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return getProject(organizationId, ctx.data.id);
  });

export const createProjectFn = createServerFn({ method: "POST" })
  .validator(createProjectSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return createProject(organizationId, ctx.data);
  });

export const updateProjectFn = createServerFn({ method: "POST" })
  .validator(updateProjectFnSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    return updateProject(organizationId, ctx.data.id, ctx.data.data);
  });

export const deleteProjectFn = createServerFn({ method: "POST" })
  .validator(projectIdSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    await deleteProject(organizationId, ctx.data.id);
    return { success: true };
  });
