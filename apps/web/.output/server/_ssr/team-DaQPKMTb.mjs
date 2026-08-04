import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as Route$1, d as createSsrRpc } from "./router-DNhBrzYF.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { c as createServerFn } from "./index.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent, L as Label$1, I as Input, B as Button, A as Avatar, b as AvatarFallback } from "./Select-1pGyLj6A.mjs";
import { B as Badge } from "./Badge-BB4IYZzi.mjs";
import { i as inviteMemberSchema, r as removeMemberSchema } from "./team-service-DJux0L2k.mjs";
import "./index-0g789sOm.mjs";
import "../_libs/react-dom.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "node:crypto";
import "../_libs/zod.mjs";
import "node:fs";
import "node:fs/promises";
import "node:os";
import "node:path";
import "fs";
import "path";
import "os";
import "events";
import "util/types";
import "dns";
import "net";
import "tls";
import "string_decoder";
import "./errors--trM2I6Z.mjs";
const inviteMemberFn = createServerFn({
  method: "POST"
}).validator(inviteMemberSchema).handler(createSsrRpc("f7d07888c791e8f5a0ed774969d6a5a34f3ae35ccd6f56b9a04689e0e203ebe6"));
const removeMemberFn = createServerFn({
  method: "POST"
}).validator(removeMemberSchema).handler(createSsrRpc("9de02c8d8a94b82aa7cc98a214d61bcfa2f665a56b1f1085294a3f06af3d0887"));
function TeamPage() {
  const {
    members,
    invitations,
    organizationId
  } = Route$1.useLoaderData();
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = reactExports.useState("");
  const [inviteRole, setInviteRole] = reactExports.useState("member");
  const [isInviting, setIsInviting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const handleInvite = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsInviting(true);
    try {
      await inviteMemberFn({
        data: {
          email: inviteEmail,
          role: inviteRole
        }
      });
      setSuccess(`Invitation sent to ${inviteEmail}.`);
      setInviteEmail("");
      await router.invalidate();
    } catch {
      setError("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };
  const handleRemoveMember = async (memberId) => {
    try {
      await removeMemberFn({
        data: {
          memberId
        }
      });
      await router.invalidate();
    } catch {
      setError("Failed to remove member.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Team" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Manage members and invitations for this organization." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Invite a member" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Send an invitation by email." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600", children: error }),
        success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "status", className: "mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700", children: success }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleInvite, className: "flex flex-col gap-4 sm:flex-row sm:items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "inviteEmail", children: "Email address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "inviteEmail", type: "email", placeholder: "colleague@company.com", value: inviteEmail, onChange: (e) => setInviteEmail(e.target.value), required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 sm:w-36", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "inviteRole", children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "inviteRole", value: inviteRole, onChange: (e) => setInviteRole(e.target.value), className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "member", children: "Member" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin", children: "Admin" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isInviting, children: isInviting ? "Sending…" : "Send invite" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          members.length,
          " member",
          members.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: members.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", "aria-hidden": "true", children: "👥" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-gray-500", children: "No members yet." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-gray-100", role: "list", children: members.map((member) => {
        const displayName = member.user?.name ?? member.userId;
        const initials = displayName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-gray-900", children: displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-gray-400", children: member.user?.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: member.role === "admin" ? "default" : "secondary", children: member.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRemoveMember(member.id), className: "text-red-500 hover:text-red-700 hover:bg-red-50", "aria-label": `Remove ${displayName}`, children: "Remove" })
        ] }, member.id);
      }) }) })
    ] }),
    invitations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Pending invitations" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          invitations.length,
          " pending"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-gray-100", role: "list", children: invitations.map((inv) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400", "aria-hidden": "true", children: "?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-gray-700", children: inv.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Invitation pending" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: inv.role })
      ] }, inv.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-300", children: [
      "org: ",
      organizationId
    ] })
  ] });
}
export {
  TeamPage as component
};
