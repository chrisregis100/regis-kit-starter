import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent, L as Label$1, I as Input, B as Button, S as Separator$1 } from "./Select-1pGyLj6A.mjs";
import { a as authClient } from "./auth-client-wxD50esn.mjs";
import { b as Route$2 } from "./router-DNhBrzYF.mjs";
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
function SettingsPage() {
  const ctx = Route$2.useRouteContext();
  const router = useRouter();
  const [name, setName] = reactExports.useState(ctx.user.name);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState(null);
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);
    try {
      const result = await authClient.updateUser({
        name
      });
      if (result.error) {
        setMessage({
          type: "error",
          text: result.error.message ?? "Update failed."
        });
      } else {
        setMessage({
          type: "success",
          text: "Profile updated."
        });
        await router.invalidate();
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred."
      });
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500", children: "Manage your account preferences." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Update your display name and account details." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { role: "alert", className: ["mb-4 rounded-lg px-4 py-3 text-sm", message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"].join(" "), children: message.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleProfileSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "name", children: "Display name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, maxLength: 100 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", value: ctx.user.email, disabled: true, className: "bg-gray-50 text-gray-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: "Email cannot be changed." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isSaving, children: isSaving ? "Saving…" : "Save changes" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator$1, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-red-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-red-700", children: "Danger zone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Irreversible actions for your account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: "Account deletion is not yet implemented in this version. Contact support if you need to delete your account." }) })
    ] })
  ] });
}
export {
  SettingsPage as component
};
