import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { C as Card, g as CardHeader, h as CardTitle, i as CardDescription, j as CardContent, L as Label$1, I as Input, B as Button } from "./Select-1pGyLj6A.mjs";
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
function OnboardingClient() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState("choose");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Set up your workspace" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-gray-500", children: "Create a new organization or join an existing one." })
    ] }),
    step === "choose" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setStep("create"),
          className: "flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-colors hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: "🏢" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900", children: "Create" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: "Start a new organization" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setStep("join"),
          className: "flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-5 text-left transition-colors hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: "🤝" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-900", children: "Join" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500", children: "Accept an invitation" })
          ]
        }
      )
    ] }),
    step === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateOrgForm,
      {
        onBack: () => setStep("choose"),
        onSuccess: () => navigate({ to: "/dashboard" })
      }
    ),
    step === "join" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      JoinOrgForm,
      {
        onBack: () => setStep("choose"),
        onSuccess: () => navigate({ to: "/dashboard" })
      }
    )
  ] });
}
function CreateOrgForm({
  onBack,
  onSuccess
}) {
  const [name, setName] = reactExports.useState("");
  const [slug, setSlug] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleNameChange = (value) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.organization.create({ name, slug });
      if (result.error || !result.data) {
        setError(result.error?.message ?? "Failed to create organization.");
        return;
      }
      await authClient.organization.setActive({
        organizationId: result.data.id
      });
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Create organization" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your organization is the shared workspace for your team." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "org-name", children: "Organization name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "org-name",
            type: "text",
            required: true,
            value: name,
            onChange: (e) => handleNameChange(e.target.value),
            placeholder: "Acme Corp"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "org-slug", children: "URL slug" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "org-slug",
            type: "text",
            required: true,
            value: slug,
            onChange: (e) => setSlug(e.target.value),
            placeholder: "acme-corp"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-400", children: [
          "app.example.com/",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-600", children: slug || "your-slug" })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "text-sm text-red-600", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onBack, className: "flex-1", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "flex-1",
            disabled: isLoading || !name || !slug,
            children: isLoading ? "Creating…" : "Create"
          }
        )
      ] })
    ] }) })
  ] });
}
function JoinOrgForm({
  onBack,
  onSuccess
}) {
  const [token, setToken] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId: token
      });
      if (result.error) {
        setError(result.error.message ?? "Invalid or expired invitation.");
        return;
      }
      onSuccess();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Join organization" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Enter the invitation code sent to your email." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label$1, { htmlFor: "invite-token", children: "Invitation code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "invite-token",
            type: "text",
            required: true,
            value: token,
            onChange: (e) => setToken(e.target.value),
            placeholder: "Paste invitation ID here"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "text-sm text-red-600", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onBack, className: "flex-1", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "flex-1", disabled: isLoading || !token, children: isLoading ? "Joining…" : "Join" })
      ] })
    ] }) })
  ] });
}
function OnboardingPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-2 font-bold text-gray-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": "true", className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white", children: "RK" }),
      "RK Kit"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OnboardingClient, {})
  ] });
}
export {
  OnboardingPage as component
};
