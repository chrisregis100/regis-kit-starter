import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Buildings, CaretRight } from "@phosphor-icons/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ThemeToggle,
} from "@rk-kit/ui";
import { Logo } from "../shared/Logo";
import { selectOrganizationFn } from "../../server/session-fns";

interface OrganizationOption {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
}

interface SelectOrganizationClientProps {
  organizations: OrganizationOption[];
  userName: string;
}

export function SelectOrganizationClient({
  organizations,
  userName,
}: SelectOrganizationClientProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (organizationId: string) => {
    setError(null);
    setSelectedId(organizationId);

    try {
      await selectOrganizationFn({ data: { organizationId } });
      await navigate({ to: "/dashboard" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not open this organisation. Please try again.",
      );
      setSelectedId(null);
    }
  };

  return (
    <div className="relative w-full max-w-md space-y-6">
      <div className="absolute -top-16 right-0">
        <ThemeToggle />
      </div>

      <div className="flex justify-center">
        <Logo />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Choose a workspace
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back{userName ? `, ${userName}` : ""}. Select the organisation
          you want to open.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your organisations</CardTitle>
          <CardDescription>
            You belong to {organizations.length} workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {error && (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <ul className="space-y-2" role="list">
            {organizations.map((org) => {
              const isLoading = selectedId === org.id;

              return (
                <li key={org.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(org.id)}
                    disabled={selectedId !== null}
                    aria-label={`Open ${org.name}`}
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt=""
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <Buildings
                          weight="duotone"
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">
                        {org.name}
                      </span>
                      {org.slug && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {org.slug}
                        </span>
                      )}
                    </span>
                    {isLoading ? (
                      <span className="text-xs text-muted-foreground">
                        Opening…
                      </span>
                    ) : (
                      <CaretRight
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
