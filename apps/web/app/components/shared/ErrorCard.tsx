import { Card, CardContent, CardHeader, CardTitle } from "@rk-kit/ui";

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorCardProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-red-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-500">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Try again
          </button>
        )}
      </CardContent>
    </Card>
  );
}
