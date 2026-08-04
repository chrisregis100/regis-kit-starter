import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import { O as Outlet, L as Link, u as useRouter } from "./_libs/tanstack__react-router.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, A as Avatar, b as AvatarFallback, c as DropdownMenuContent, d as DropdownMenuLabel, e as DropdownMenuSeparator, f as DropdownMenuItem } from "./_ssr/Select-1pGyLj6A.mjs";
import { a as authClient } from "./_ssr/auth-client-wxD50esn.mjs";
import { e as Route$a } from "./_ssr/router-DNhBrzYF.mjs";
import "./_libs/react-dom.mjs";
import "./_ssr/index-0g789sOm.mjs";
import "./_ssr/index.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/isbot.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "node:async_hooks";
import "node:crypto";
import "./_libs/zod.mjs";
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
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM13 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7zM3 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zM13 15a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) })
  },
  {
    label: "Team",
    href: "/team",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" }) })
  },
  {
    label: "Settings",
    href: "/settings",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
    ] })
  },
  {
    label: "Billing",
    href: "/billing",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) })
  }
];
function Sidebar({ organizationId: _organizationId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-56 flex-shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 items-center border-b border-gray-100 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-white", children: "RK" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900", children: "RK Kit" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-1 flex-col gap-1 p-3", "aria-label": "Main navigation", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.href,
        className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 [&.active]:bg-blue-50 [&.active]:font-medium [&.active]:text-blue-700",
        activeProps: { className: "active" },
        children: [
          item.icon,
          item.label
        ]
      },
      item.href
    )) })
  ] });
}
function TopBar({ user }) {
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    await router.navigate({ to: "/login" });
  };
  const initials = user.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "lg:hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100",
        "aria-label": "Open sidebar",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-gray-50 transition-colors",
          "aria-label": "User menu",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-7 w-7", children: [
              user.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.image, alt: user.name, className: "h-full w-full rounded-full object-cover" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: initials })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden font-medium text-gray-700 sm:block", children: user.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuLabel, { className: "flex flex-col gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: user.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-gray-500", children: user.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/settings", className: "cursor-pointer", children: "Settings" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DropdownMenuItem,
          {
            onClick: handleSignOut,
            className: "text-red-600 focus:text-red-600 cursor-pointer",
            children: "Sign out"
          }
        )
      ] })
    ] })
  ] });
}
function DashboardShell({ children, user, organizationId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen overflow-hidden bg-gray-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, { organizationId }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { user }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto px-6 py-6", children })
    ] })
  ] });
}
function ProtectedLayout() {
  const ctx = Route$a.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardShell, { user: ctx.user, organizationId: ctx.organizationId, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
export {
  ProtectedLayout as component
};
