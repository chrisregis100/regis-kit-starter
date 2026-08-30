import { Card, CardContent, CardHeader, CardTitle } from "@rk-kit/ui";
import { ProjectsPanel } from "../../../components/projects-panel";
import { requireProtectedContext } from "../../../lib/server-context";
import { listProjects } from "../../../services/project-service";

export default async function DashboardPage() {
  const { organizationId } = await requireProtectedContext();
  const projects = await listProjects(organizationId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of your current workspace.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Projects</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{projects.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Organization</CardTitle></CardHeader>
          <CardContent className="font-mono text-sm">{organizationId}</CardContent>
        </Card>
      </div>
      <ProjectsPanel projects={projects} />
    </div>
  );
}
