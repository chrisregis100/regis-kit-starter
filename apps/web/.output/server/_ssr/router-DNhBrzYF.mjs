import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, O as Outlet, H as HeadContent, S as Scripts } from "../_libs/tanstack__react-router.mjs";
import { z as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, a as getServerFnById } from "./index.mjs";
import { a as auth } from "./index-0g789sOm.mjs";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
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
const appCss = "/assets/app-DOkpVTsQ.css";
const Route$c = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RK Kit — SaaS Starter" },
      { name: "description", content: "Modern SaaS starter built with TanStack Start" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  component: RootDocument
});
function RootDocument() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Document, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
function Document({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "h-full antialiased", children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$a = () => import("./index-DVQX2R93.mjs");
const Route$b = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getServerSession = createServerFn({
  method: "GET"
}).handler(createSsrRpc("1f1668e7d7965c9a082c0b0989defd920f33a45fe76095a317d6e6231b218e1e"));
const getProtectedContext = createServerFn({
  method: "GET"
}).handler(createSsrRpc("356f475d7b5ed59d19b74277a577057b2938b4ed49cda35795f6e2468f046cbe"));
const $$splitComponentImporter$9 = () => import("../_protected-DZRRaLKt.mjs");
const Route$a = createFileRoute("/_protected")({
  beforeLoad: async () => getProtectedContext(),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./forgot-password-D_UKzwgc.mjs");
const Route$9 = createFileRoute("/forgot-password")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./login-DaQEvlM6.mjs");
const Route$8 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./onboarding-DUkyGiQW.mjs");
const Route$7 = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Set up your workspace — RK Kit"
    }]
  }),
  beforeLoad: async () => {
    const session = await getServerSession();
    if (!session) throw redirect({
      to: "/login"
    });
    if (session.session.activeOrganizationId) {
      throw redirect({
        to: "/dashboard"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./reset-password-BLcuwyJd.mjs");
const Route$6 = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    token: typeof search["token"] === "string" ? search["token"] : ""
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./signup-DxqhehJ3.mjs");
const Route$5 = createFileRoute("/signup")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./billing-B3G6xtY2.mjs");
const Route$4 = createFileRoute("/_protected/billing")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./dashboard-B2WDS1CD.mjs");
const getDashboardData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("95d159cdf051cfa2a6ec9a6231ed8d383d460449e14d7d130899f402e5c49690"));
const Route$3 = createFileRoute("/_protected/dashboard")({
  loader: () => getDashboardData(),
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  pendingComponent: DashboardSkeleton
});
function DashboardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-48 rounded-lg bg-gray-200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: Array.from({
      length: 4
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 rounded-xl bg-gray-200" }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 rounded-xl bg-gray-200" })
  ] });
}
const $$splitComponentImporter$1 = () => import("./settings-BKV0D-hL.mjs");
const Route$2 = createFileRoute("/_protected/settings")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./team-DaQPKMTb.mjs");
const getTeamData = createServerFn({
  method: "GET"
}).handler(createSsrRpc("0834354134f0327befc08250d042611d8535da1a18f3e253772a80c024b963d4"));
const Route$1 = createFileRoute("/_protected/team")({
  loader: () => getTeamData(),
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  pendingComponent: TeamSkeleton
});
function TeamSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-6 animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-24 rounded-lg bg-gray-200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 rounded-xl bg-gray-200" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64 rounded-xl bg-gray-200" })
  ] });
}
const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request)
    }
  }
});
const IndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const ProtectedRoute = Route$a.update({
  id: "/_protected",
  getParentRoute: () => Route$c
});
const ForgotPasswordRoute = Route$9.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$c
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$c
});
const OnboardingRoute = Route$7.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$c
});
const ResetPasswordRoute = Route$6.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$c
});
const SignupRoute = Route$5.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$c
});
const ProtectedBillingRoute = Route$4.update({
  id: "/billing",
  path: "/billing",
  getParentRoute: () => ProtectedRoute
});
const ProtectedDashboardRoute = Route$3.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => ProtectedRoute
});
const ProtectedSettingsRoute = Route$2.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => ProtectedRoute
});
const ProtectedTeamRoute = Route$1.update({
  id: "/team",
  path: "/team",
  getParentRoute: () => ProtectedRoute
});
const ApiAuthSplatRoute = Route.update({
  id: "/api/auth/$",
  path: "/api/auth/$",
  getParentRoute: () => Route$c
});
const ProtectedRouteChildren = {
  ProtectedBillingRoute,
  ProtectedDashboardRoute,
  ProtectedSettingsRoute,
  ProtectedTeamRoute
};
const ProtectedRouteWithChildren = ProtectedRoute._addFileChildren(
  ProtectedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  ProtectedRoute: ProtectedRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute,
  OnboardingRoute,
  ResetPasswordRoute,
  SignupRoute,
  ApiAuthSplatRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0
  });
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$6 as R,
  Route$3 as a,
  Route$2 as b,
  Route$1 as c,
  createSsrRpc as d,
  Route$a as e,
  router as r
};
