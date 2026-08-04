/**
 * Organization service — server-only.
 *
 * All queries run inside withTenant() so RLS policies are enforced.
 * Never call this from client code.
 */
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "@tanstack/start/server";
import { z } from "zod";
import { withTenant, project } from "@rk-kit/db";
import { requireOrganization } from "@rk-kit/auth";

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

/**
 * List all projects for the currently active organization.
 * Guards: requires authenticated session + active organization.
 */
export const listProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    const { organizationId } = await requireOrganization(request.headers);

    return withTenant(organizationId, (tx) =>
      tx.select().from(project),
    );
  },
);

/**
 * Create a new project in the active organization.
 */
export const createProject = createServerFn({ method: "POST" })
  .validator(CreateProjectSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const { organizationId } = await requireOrganization(request.headers);

    const newProject = await withTenant(organizationId, (tx) =>
      tx
        .insert(project)
        .values({
          id: crypto.randomUUID(),
          organizationId,
          name: data.name,
          description: data.description ?? null,
        })
        .returning(),
    );

    return newProject[0];
  });
