import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing — RegisKit" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Current plan</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold text-zinc-900">Starter</span>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-500">Free — up to 3 members</p>
          </div>
          <button
            type="button"
            disabled
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white opacity-60 cursor-not-allowed"
          >
            Upgrade
          </button>
        </div>
      </div>

      {/* Coming soon notice */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center">
        <div className="text-3xl mb-3">🚧</div>
        <h3 className="text-sm font-semibold text-zinc-900">
          Billing coming soon
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Payment processing and subscription management will be available in a
          future release. This is a placeholder page.
        </p>
      </div>
    </div>
  );
}
