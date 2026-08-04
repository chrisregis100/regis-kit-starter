import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter, L as Link } from "../_libs/tanstack__react-router.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent, L as Label$1, I as Input, B as Button, k as CardFooter } from "./Select-1pGyLj6A.mjs";
import { a as authClient } from "./auth-client-wxD50esn.mjs";
import { R as Route$6 } from "./router-DNhBrzYF.mjs";
import "../_libs/react-dom.mjs";
import "./index-0g789sOm.mjs";
import "./index.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
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
function ResetPasswordPage() {
  const {
    token
  } = Route$6.useSearch();
  const router = useRouter();
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    setIsLoading(true);
    try {
      await authClient.resetPassword({
        newPassword: password,
        token
      });
      await router.navigate({
        to: "/login"
      });
    } catch {
      setError("Could not reset password. The link may have expired.");
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Set new password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Choose a strong password for your account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: "mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "password", children: "New password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", placeholder: "At least 8 characters", value: password, onChange: (e) => setPassword(e.target.value), required: true, autoComplete: "new-password", autoFocus: true, minLength: 8 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "confirmPassword", children: "Confirm password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirmPassword", type: "password", placeholder: "Repeat your password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, autoComplete: "new-password", minLength: 8 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Updating…" : "Update password" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm text-blue-600 hover:text-blue-700 transition-colors", children: "Back to sign in" }) })
    ] })
  ] }) });
}
export {
  ResetPasswordPage as component
};
