/**
 * Smoke tests for the REST project handlers.
 *
 * The session middleware and the project service are mocked, so these tests
 * exercise only the HTTP boundary: status codes and the JSON envelope
 * ({ data } on success, { error } on failure).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError, UnauthorizedError } from "@rk-kit/errors";
import type { Project } from "@rk-kit/db";
import { requireApiSession } from "../middleware/require-api-session";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "../../services/project-service";
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectHandler,
  listProjectsHandler,
  updateProjectHandler,
} from "./projects.handler";

vi.mock("../middleware/require-api-session", () => ({
  requireApiSession: vi.fn(),
}));

vi.mock("../../services/project-service", () => ({
  listProjects: vi.fn(),
  createProject: vi.fn(),
  getProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
}));

const fakeProject: Project = {
  id: "p1",
  organizationId: "org-1",
  name: "Test",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const jsonRequest = (method: string, body?: unknown) => {
  const init: RequestInit = {
    method,
    headers: { "content-type": "application/json" },
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  return new Request("http://localhost/api/v1/projects", init);
};

beforeEach(() => {
  vi.mocked(requireApiSession).mockReset();
  vi.mocked(requireApiSession).mockResolvedValue({
    organizationId: "org-1",
    userId: "u1",
  });
  vi.mocked(listProjects).mockReset();
  vi.mocked(createProject).mockReset();
  vi.mocked(getProject).mockReset();
  vi.mocked(updateProject).mockReset();
  vi.mocked(deleteProject).mockReset();
});

describe("listProjectsHandler", () => {
  it("returns 200 with a data envelope", async () => {
    vi.mocked(listProjects).mockResolvedValue([fakeProject]);

    const res = await listProjectsHandler(jsonRequest("GET"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      data: [JSON.parse(JSON.stringify(fakeProject))],
    });
  });

  it("returns 401 when the session is missing", async () => {
    vi.mocked(requireApiSession).mockRejectedValue(new UnauthorizedError());

    const res = await listProjectsHandler(jsonRequest("GET"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });
});

describe("createProjectHandler", () => {
  it("returns 201 with the created project", async () => {
    vi.mocked(createProject).mockResolvedValue(fakeProject);

    const res = await createProjectHandler(jsonRequest("POST", { name: "Test" }));
    expect(res.status).toBe(201);
    expect(createProject).toHaveBeenCalledWith("org-1", { name: "Test" });
  });

  it("returns 400 when the body is not valid JSON", async () => {
    const res = await createProjectHandler(
      new Request("http://localhost/api/v1/projects", {
        method: "POST",
        body: "not json",
      }),
    );
    expect(res.status).toBe(400);
    expect(createProject).not.toHaveBeenCalled();
  });
});

describe("getProjectHandler", () => {
  it("returns 404 when the project is missing", async () => {
    vi.mocked(getProject).mockRejectedValue(new NotFoundError("Project"));

    const res = await getProjectHandler(jsonRequest("GET"), "missing");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

describe("updateProjectHandler", () => {
  it("returns 200 with the updated project", async () => {
    vi.mocked(updateProject).mockResolvedValue({ ...fakeProject, name: "New" });

    const res = await updateProjectHandler(
      jsonRequest("PATCH", { name: "New" }),
      "p1",
    );
    expect(res.status).toBe(200);
    expect(updateProject).toHaveBeenCalledWith("org-1", "p1", { name: "New" });
  });
});

describe("deleteProjectHandler", () => {
  it("returns 200 with a deletion acknowledgement", async () => {
    vi.mocked(deleteProject).mockResolvedValue(undefined);

    const res = await deleteProjectHandler(jsonRequest("DELETE"), "p1");
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      data: { id: "p1", deleted: true },
    });
  });
});
