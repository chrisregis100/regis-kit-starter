import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent } from "./Select-1pGyLj6A.mjs";
import { B as Badge } from "./Badge-BB4IYZzi.mjs";
import "../_libs/react-dom.mjs";
import "./index-0g789sOm.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
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
function BillingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Billing" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Manage your subscription and payment details." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Current plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your active subscription" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Starter" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-blue-100 bg-blue-50 px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-blue-800", children: "You are on the free Starter plan." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-blue-700", children: "Payment integration is not yet enabled in this version of the boilerplate. Upgrade functionality will be added once a payment provider is configured." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Included in your plan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: ["Up to 3 team members", "1 organization", "5 GB storage", "Community support"].map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-4 w-4 flex-shrink-0 text-green-500", fill: "currentColor", viewBox: "0 0 20 20", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fillRule: "evenodd", d: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z", clipRule: "evenodd" }) }),
            feature
          ] }, feature)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Upgrade to Pro" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Unlock unlimited team members and advanced features." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl font-bold text-gray-900", children: "$29" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-400", children: "/month" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", disabled: true, className: "w-full cursor-not-allowed rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-400", "aria-label": "Upgrade unavailable — payment not yet integrated", children: "Upgrade (coming soon)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-center text-xs text-gray-400", children: "Payment integration coming in a future release." })
      ] })
    ] })
  ] });
}
export {
  BillingPage as component
};
