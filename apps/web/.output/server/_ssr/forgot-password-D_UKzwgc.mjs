import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent, L as Label$1, I as Input, B as Button, k as CardFooter } from "./Select-1pGyLj6A.mjs";
import { a as authClient } from "./auth-client-wxD50esn.mjs";
import "../_libs/react-dom.mjs";
import "./index-0g789sOm.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
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
function ForgotPasswordPage() {
  const [email, setEmail] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isSuccess, setIsSuccess] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password"
      });
      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gray-50 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-white", children: "RK" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-semibold text-gray-900", children: "RK Kit" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Reset your password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: isSuccess ? "Check your inbox for the reset link." : "Enter your email and we'll send a reset link." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-green-50 px-4 py-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-green-700", children: "Password reset email sent!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-green-600", children: "Check your spam folder if you don't see it within a minute." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "email", children: "Email address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, autoComplete: "email", autoFocus: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Sending…" : "Send reset link" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
        "Remembered it?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "font-medium text-blue-600 hover:text-blue-700 transition-colors", children: "Sign in" })
      ] }) })
    ] })
  ] }) });
}
export {
  ForgotPasswordPage as component
};
