/**
 * Project service — business logic, server-only.
 *
 * Pattern for every business mutation/query:
 *   1. Validate input with Zod (throw ValidationError on failure)
 *   2. Run the query inside withTenant() so RLS policies are enforced
 *
 * The tenant runner is injectable so unit tests can exercise the logic
 * without a real database (see project-service.test.ts).
 */
import { z } from "zod";
import { NotFoundError, ValidationError } from "@rk-kit/errors";
import { withTenant, project, eq, type Project, type TenantTx } from "@rk-kit/db";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(500, "Description is too long").nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/** Signature of withTenant — injectable for tests. */
export type TenantRunner = <T>(
  organizationId: string,
  fn: (tx: TenantTx) => Promise<T>,
) => Promise<T>;

export async function listProjects(
  organizationId: string,
  runInTenant: TenantRunner = withTenant,
): Promise<Project[]> {
  return runInTenant(organizationId, (tx) =>
    tx.select().from(project).limit(50),
  );
}

export async function getProject(
  organizationId: string,
  projectId: string,
  runInTenant: TenantRunner = withTenant,
): Promise<Project> {
  const rows = await runInTenant(organizationId, (tx) =>
    tx.select().from(project).where(eq(project.id, projectId)).limit(1),
  );

  const found = rows[0];
  if (!found) throw new NotFoundError("Project");
  return found;
}

export async function createProject(
  organizationId: string,
  input: unknown,
  runInTenant: TenantRunner = withTenant,
): Promise<Project> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  const rows = await runInTenant(organizationId, (tx) =>
    tx
      .insert(project)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
      })
      .returning(),
  );

  const created = rows[0];
  if (!created) throw new Error("Insert returned no rows");
  return created;
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  input: unknown,
  runInTenant: TenantRunner = withTenant,
): Promise<Project> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  const rows = await runInTenant(organizationId, (tx) =>
    tx
      .update(project)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(project.id, projectId))
      .returning(),
  );

  const updated = rows[0];
  if (!updated) throw new NotFoundError("Project");
  return updated;
}

export async function deleteProject(
  organizationId: string,
  projectId: string,
  runInTenant: TenantRunner = withTenant,
): Promise<void> {
  const rows = await runInTenant(organizationId, (tx) =>
    tx.delete(project).where(eq(project.id, projectId)).returning(),
  );

  if (rows.length === 0) throw new NotFoundError("Project");
}
