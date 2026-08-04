import { createFileRoute } from "@tanstack/react-router";
import { listProjects } from "../services/org.server";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorCard } from "../components/shared/ErrorCard";

export const Route = createFileRoute("/_dashboard/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RegisKit" }] }),
  loader: () => listProjects(),
  pendingComponent: () => (
    <div className="flex h-64 items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <ErrorCard
      message={error instanceof Error ? error.message : "Failed to load dashboard."}
      onRetry={reset}
    />
  ),
  component: DashboardOverview,
});

function DashboardOverview() {
  const projects = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Welcome to your workspace dashboard.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Team members" value="—" />
        <StatCard label="Plan" value="Starter" badge="Free" />
      </div>

      {/* Projects list */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Projects</h2>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium text-zinc-900">No projects yet</p>
            <p className="mt-1 text-xs text-zinc-500">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {projects.map((project) => (
              <li key={project.id} className="px-5 py-3">
                <p className="text-sm font-medium text-zinc-900">{project.name}</p>
                {project.description && (
                  <p className="text-xs text-zinc-500">{project.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string | number;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-zinc-900">{value}</span>
        {badge && (
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
