"use client";

import type { Project } from "@rk-kit/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@rk-kit/ui";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "../app/actions";

interface ProjectsPanelProps {
  projects: Project[];
}

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  const router = useRouter();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEdit(project: Project) {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description ?? "");
  }

  function handleReset() {
    setEditingProject(null);
    setName("");
    setDescription("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      if (editingProject) {
        await updateProjectAction(editingProject.id, {
          name: name.trim(),
          description: description.trim() || null,
        });
      } else {
        await createProjectAction({
          name: name.trim(),
          ...(description.trim() ? { description: description.trim() } : {}),
        });
      }
      handleReset();
      router.refresh();
    } catch {
      setError("Could not save the project.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(projectId: string) {
    setError(null);
    try {
      await deleteProjectAction(projectId);
      router.refresh();
    } catch {
      setError("Could not delete the project.");
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader><CardTitle>Projects ({projects.length})</CardTitle></CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">Create your first project.</p>
          ) : (
            <ul className="divide-y divide-border">
              {projects.map((project) => (
                <li key={project.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{project.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Button type="button" size="sm" variant="ghost" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{editingProject ? "Edit project" : "New project"}</CardTitle></CardHeader>
        <CardContent>
          {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="project-description">Description</Label>
              <Input
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" isLoading={isSaving}>Save</Button>
              {editingProject && <Button type="button" variant="outline" onClick={handleReset}>Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
