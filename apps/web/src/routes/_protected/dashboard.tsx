import { createFileRoute } from "@tanstack/react-router";
import type { Icon } from "@phosphor-icons/react";
import { Pulse, Buildings, FolderOpen, UsersThree } from "@phosphor-icons/react";
import { Skeleton } from "@rk-kit/ui";
import type { Project } from "@rk-kit/db";
import { listProjectsFn } from "../../server/projects-fns";
import { ProjectsPanel } from "../../components/dashboard/ProjectsPanel";

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () => listProjectsFn(),
  component: DashboardPage,
  pendingComponent: DashboardSkeleton,
});

const stats: {
  label: string;
  icon: Icon;
  getValue: (ctx: { projects: Project[]; organizationId: string }) => string | number;
}[] = [
  { label: "Projects", icon: FolderOpen, getValue: ({ projects }) => projects.length },
  { label: "Team members", icon: UsersThree, getValue: () => "—" },
  { label: "Active sessions", icon: Pulse, getValue: () => "1" },
  { label: "Organization", icon: Buildings, getValue: ({ organizationId }) => organizationId.slice(0, 8) },
];

function DashboardPage() {
  const projects = Route.useLoaderData();
  const ctx = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, icon: Icon, getValue }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4 md:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon weight="duotone" className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 text-2xl font-bold text-foreground">
                  {getValue({ projects, organizationId: ctx.organizationId })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectsPanel projects={projects} />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      
      {/* ProjectsPanel Skeleton */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 md:px-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <ul className="divide-y divide-border" role="list">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3 md:gap-4 md:px-5">
              <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
