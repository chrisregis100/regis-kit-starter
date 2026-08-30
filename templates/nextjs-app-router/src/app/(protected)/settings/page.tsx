import { SettingsForm } from "../../../components/settings-form";
import { requireProtectedContext } from "../../../lib/server-context";

export default async function SettingsPage() {
  const { user } = await requireProtectedContext();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>
      <SettingsForm user={user} />
    </div>
  );
}
