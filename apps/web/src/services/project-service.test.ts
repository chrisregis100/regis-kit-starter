/**
 * Unit tests for the project service — no database required.
 * The tenant runner is injected as a fake that records calls.
 */
import { describe, expect, it, vi } from "vitest";
import { NotFoundError, ValidationError } from "@rk-kit/errors";
import type { Project } from "@rk-kit/db";
import {
  createProject,
  createProjectSchema,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
  updateProjectSchema,
  type TenantRunner,
} from "./project-service";

const fakeProject: Project = {
  id: "p1",
  organizationId: "org-1",
  name: "Test",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeFakeRunner(result: unknown): TenantRunner {
  // The fake resolves with a canned result and never touches a database.
  return vi.fn(async (_organizationId, _fn) => result) as TenantRunner;
}

describe("createProjectSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = createProjectSchema.safeParse({ name: "My project" });
    expect(parsed.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const parsed = createProjectSchema.safeParse({ name: "" });
    expect(parsed.success).toBe(false);
  });

  it("rejects an overlong description", () => {
    const parsed = createProjectSchema.safeParse({
      name: "ok",
      description: "x".repeat(501),
    });
    expect(parsed.success).toBe(false);
  });
});

describe("listProjects", () => {
  it("runs inside the tenant context of the given organization", async () => {
    const runner = makeFakeRunner([fakeProject]);
    const projects = await listProjects("org-1", runner);

    expect(projects).toEqual([fakeProject]);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(runner).toHaveBeenCalledWith("org-1", expect.any(Function));
  });
});

describe("createProject", () => {
  it("throws ValidationError on invalid input without touching the db", async () => {
    const runner = makeFakeRunner([fakeProject]);

    await expect(
      createProject("org-1", { name: "" }, runner),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(runner).not.toHaveBeenCalled();
  });

  it("creates a project inside the tenant context", async () => {
    const runner = makeFakeRunner([fakeProject]);
    const created = await createProject("org-1", { name: "Test" }, runner);

    expect(created).toEqual(fakeProject);
    expect(runner).toHaveBeenCalledWith("org-1", expect.any(Function));
  });
});

describe("updateProjectSchema", () => {
  it("accepts a partial payload", () => {
    expect(updateProjectSchema.safeParse({ name: "Renamed" }).success).toBe(true);
    expect(updateProjectSchema.safeParse({ description: null }).success).toBe(true);
  });

  it("rejects an empty payload", () => {
    expect(updateProjectSchema.safeParse({}).success).toBe(false);
  });
});

describe("getProject", () => {
  it("returns the project when found", async () => {
    const runner = makeFakeRunner([fakeProject]);
    const found = await getProject("org-1", "p1", runner);

    expect(found).toEqual(fakeProject);
    expect(runner).toHaveBeenCalledWith("org-1", expect.any(Function));
  });

  it("throws NotFoundError when the project is missing", async () => {
    const runner = makeFakeRunner([]);

    await expect(getProject("org-1", "missing", runner)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});

describe("updateProject", () => {
  it("throws ValidationError on empty input without touching the db", async () => {
    const runner = makeFakeRunner([fakeProject]);

    await expect(
      updateProject("org-1", "p1", {}, runner),
    ).rejects.toBeInstanceOf(ValidationError);
    expect(runner).not.toHaveBeenCalled();
  });

  it("returns the updated project", async () => {
    const updated = { ...fakeProject, name: "Renamed" };
    const runner = makeFakeRunner([updated]);

    const result = await updateProject("org-1", "p1", { name: "Renamed" }, runner);
    expect(result).toEqual(updated);
  });

  it("throws NotFoundError when the project does not exist", async () => {
    const runner = makeFakeRunner([]);

    await expect(
      updateProject("org-1", "missing", { name: "x" }, runner),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("deleteProject", () => {
  it("resolves when a row is deleted", async () => {
    const runner = makeFakeRunner([fakeProject]);
    await expect(deleteProject("org-1", "p1", runner)).resolves.toBeUndefined();
  });

  it("throws NotFoundError when nothing is deleted", async () => {
    const runner = makeFakeRunner([]);
    await expect(
      deleteProject("org-1", "missing", runner),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
