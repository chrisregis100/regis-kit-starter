import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Pencil, Plus, Trash, Tray } from "@phosphor-icons/react";
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rk-kit/ui";
import type { Project } from "@rk-kit/db";
import {
  createProjectFn,
  deleteProjectFn,
  updateProjectFn,
} from "../../server/projects-fns";

interface ProjectsPanelProps {
  projects: Project[];
}

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);

  const handleOpenCreate = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditing(project);
    setIsFormOpen(true);
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Projects</h2>
          <span className="text-xs text-muted-foreground">
            {projects.length} total
          </span>
        </div>
        <Button size="sm" onClick={handleOpenCreate}>
          <Plus weight="bold" className="h-4 w-4" aria-hidden="true" />
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Tray weight="duotone" className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            No projects yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border" role="list">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-semibold text-primary">
                {project.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.name}
                </p>
                {project.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleOpenEdit(project)}
                aria-label={`Edit ${project.name}`}
              >
                <Pencil weight="bold" className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setDeleting(project)}
                aria-label={`Delete ${project.name}`}
              >
                <Trash weight="bold" className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <ProjectFormDialog
        key={editing?.id ?? "new"}
        open={isFormOpen}
        project={editing}
        onOpenChange={setIsFormOpen}
        onSaved={() => router.invalidate()}
      />

      <DeleteProjectDialog
        project={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={() => router.invalidate()}
      />
    </div>
  );
}

interface ProjectFormDialogProps {
  open: boolean;
  project: Project | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void> | void;
}

function ProjectFormDialog({
  open,
  project,
  onOpenChange,
  onSaved,
}: ProjectFormDialogProps) {
  const isEdit = project !== null;
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const trimmedDescription = description.trim();
      if (isEdit) {
        await updateProjectFn({
          data: {
            id: project.id,
            data: {
              name: name.trim(),
              description: trimmedDescription === "" ? null : trimmedDescription,
            },
          },
        });
      } else {
        await createProjectFn({
          data: {
            name: name.trim(),
            description: trimmedDescription === "" ? undefined : trimmedDescription,
          },
        });
      }
      await onSaved();
      onOpenChange(false);
    } catch {
      setError(
        isEdit
          ? "Failed to update the project. Please try again."
          : "Failed to create the project. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the project details below."
              : "Create a project in your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="projectName">Name</Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marketing site"
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="projectDescription">Description</Label>
            <Input
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional short description"
              maxLength={500}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              loadingText={isEdit ? "Saving…" : "Creating…"}
            >
              {isEdit ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteProjectDialogProps {
  project: Project | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => Promise<void> | void;
}

function DeleteProjectDialog({
  project,
  onOpenChange,
  onDeleted,
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!project) return;
    setError(null);
    setIsDeleting(true);

    try {
      await deleteProjectFn({ data: { id: project.id } });
      await onDeleted();
      onOpenChange(false);
    } catch {
      setError("Failed to delete the project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={project !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">{project?.name}</span>.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            isLoading={isDeleting}
            loadingText="Deleting…"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
