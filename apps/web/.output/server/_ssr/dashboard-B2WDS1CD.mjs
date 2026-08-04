import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as Route$3 } from "./router-DNhBrzYF.mjs";
import "./index.mjs";
import "./index-0g789sOm.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
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
function DashboardPage() {
  const {
    projects
  } = Route$3.useLoaderData();
  const ctx = Route$3.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Welcome back! Here's an overview of your workspace." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [{
      label: "Projects",
      value: projects.length,
      icon: "📦"
    }, {
      label: "Team members",
      value: "—",
      icon: "👥"
    }, {
      label: "Active sessions",
      value: "1",
      icon: "🟢"
    }, {
      label: "Organization",
      value: ctx.organizationId.slice(0, 8),
      icon: "🏢"
    }].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-gray-200 bg-white p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: stat.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-gray-400", children: stat.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-2xl font-bold text-gray-900", children: stat.value })
      ] })
    ] }) }, stat.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-gray-200 bg-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-gray-100 px-5 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-gray-900", children: "Projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-400", children: [
          projects.length,
          " total"
        ] })
      ] }),
      projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", "aria-hidden": "true", children: "📭" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm font-medium text-gray-500", children: "No projects yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-gray-400", children: "Create your first project to get started." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-gray-100", role: "list", children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 px-5 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600", children: p.name.slice(0, 2).toUpperCase() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-gray-900", children: p.name }),
          p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-gray-400", children: p.description })
        ] })
      ] }, p.id)) })
    ] })
  ] });
}
export {
  DashboardPage as component
};
