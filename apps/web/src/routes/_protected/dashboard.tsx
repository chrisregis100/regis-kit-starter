import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start-client-core";
import { getRequest } from "@tanstack/start/server";
import { withTenant, project } from "@rk-kit/db";
import { requireOrganization } from "@rk-kit/auth";
import type { Project } from "@rk-kit/db";

const getDashboardData = createServerFn().handler(async () => {
  const request = getRequest();
  const { organizationId } = await requireOrganization(request.headers);

  const projects = await withTenant(organizationId, (tx) =>
    tx.select().from(project).limit(10),
  );

  return { projects, organizationId };
});

export const Route = createFileRoute("/_protected/dashboard")({
  loader: () => getDashboardData(),
  component: DashboardPage,
  pendingComponent: DashboardSkeleton,
});

function DashboardPage() {
  const { projects } = Route.useLoaderData();
  const ctx = Route.useRouteContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Projects", value: projects.length, icon: "📦" },
          { label: "Team members", value: "—", icon: "👥" },
          { label: "Active sessions", value: "1", icon: "🟢" },
          { label: "Organization", value: ctx.organizationId.slice(0, 8), icon: "🏢" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Projects</h2>
          <span className="text-xs text-gray-400">{projects.length} total</span>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl" aria-hidden="true">📭</span>
            <p className="mt-4 text-sm font-medium text-gray-500">No projects yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Create your first project to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100" role="list">
            {projects.map((p: Project) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                  {p.description && (
                    <p className="truncate text-xs text-gray-400">{p.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-gray-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-gray-200" />
    </div>
  );
}
