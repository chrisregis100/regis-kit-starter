import { Badge, Card, CardContent, CardHeader, CardTitle } from "@rk-kit/ui";
import { redirect } from "next/navigation";
import { requireProtectedContext } from "../../../lib/server-context";
import { getAdminDashboardData } from "../../../services/admin-service";

export default async function AdminPage() {
  const { isAdmin } = await requireProtectedContext();
  if (!isAdmin) redirect("/dashboard");

  const data = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide usage and active sessions.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Users" value={data.totalUsers} />
        <Metric label="Organizations" value={data.totalOrganizations} />
        <Metric label="Active sessions" value={data.activeSessionCount} />
      </div>
      <Card>
        <CardHeader><CardTitle>Active sessions</CardTitle></CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {data.activeSessions.map((session) => (
              <li key={session.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{session.userName}</p>
                  <p className="truncate text-sm text-muted-foreground">{session.userEmail}</p>
                </div>
                <Badge variant="secondary">{session.ipAddress ?? "Unknown IP"}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: number;
}

function Metric({ label, value }: MetricProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
}
