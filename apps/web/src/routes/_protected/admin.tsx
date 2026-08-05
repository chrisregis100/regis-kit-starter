import { createFileRoute, redirect } from "@tanstack/react-router";
import type { Icon } from "@phosphor-icons/react";
import {
  Buildings,
  Pulse,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@rk-kit/ui";
import { getAdminDashboardFn } from "../../server/admin-fns";
import type { AdminActiveSession } from "../../services/admin-service";

export const Route = createFileRoute("/_protected/admin")({
  beforeLoad: ({ context }) => {
    if (!context.isAdmin) throw redirect({ to: "/dashboard" });
  },
  loader: () => getAdminDashboardFn(),
  component: AdminPage,
  pendingComponent: AdminSkeleton,
});

const stats: {
  label: string;
  icon: Icon;
  getValue: (data: {
    totalUsers: number;
    totalOrganizations: number;
    activeSessionCount: number;
  }) => string | number;
}[] = [
  { label: "Total users", icon: UsersThree, getValue: ({ totalUsers }) => totalUsers },
  { label: "Organizations", icon: Buildings, getValue: ({ totalOrganizations }) => totalOrganizations },
  { label: "Active sessions", icon: Pulse, getValue: ({ activeSessionCount }) => activeSessionCount },
];

function AdminPage() {
  const data = Route.useLoaderData();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck weight="duotone" className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Platform-wide overview. Visible only to the platform administrator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, icon: Icon, getValue }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <Icon weight="duotone" className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-0.5 text-2xl font-bold text-foreground">
                  {getValue(data)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Users currently connected across the platform, with their IP address
            and device.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {data.activeSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Pulse weight="duotone" className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">No active sessions.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {data.activeSessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SessionRow({ session }: { session: AdminActiveSession }) {
  const initials = session.userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <li className="flex items-center gap-4 px-5 py-3">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {session.userName}
        </p>
        <p className="truncate text-xs text-muted-foreground">{session.userEmail}</p>
      </div>
      <div className="hidden min-w-0 flex-1 sm:block">
        <p className="truncate text-xs text-muted-foreground" title={session.userAgent ?? undefined}>
          {session.userAgent ?? "Unknown device"}
        </p>
        <p className="text-xs text-muted-foreground/70">
          Expires {new Date(session.expiresAt).toLocaleString()}
        </p>
      </div>
      <Badge variant="secondary" className="font-mono">
        {session.ipAddress ?? "—"}
      </Badge>
    </li>
  );
}

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Active sessions Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border" role="list">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="hidden min-w-0 flex-1 sm:block space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
