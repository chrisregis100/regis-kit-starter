import { Badge } from "@rk-kit/ui";

interface Member {
  id: string;
  role: string;
  user?: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

interface TeamMemberRowProps {
  member: Member;
  onRemove?: (memberId: string) => void;
  isRemoving?: boolean;
  canRemove?: boolean;
}

export function TeamMemberRow({
  member,
  onRemove,
  isRemoving,
  canRemove,
}: TeamMemberRowProps) {
  const displayName = member.user?.name ?? member.user?.email ?? "Unknown";
  const email = member.user?.email ?? "";

  return (
    <li className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700"
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900">{displayName}</p>
          {email && <p className="text-xs text-zinc-500">{email}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="capitalize text-xs">
          {member.role}
        </Badge>
        {canRemove && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(member.id)}
            disabled={isRemoving}
            aria-label={`Remove ${displayName}`}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}
