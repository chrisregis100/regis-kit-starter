import { c as createServerRpc, g as getSession } from "./helpers-CjQ5R2cq.mjs";
import { c as createServerFn, g as getRequest } from "./index.mjs";
import { z as redirect } from "../_libs/tanstack__router-core.mjs";
import "./index-0g789sOm.mjs";
import "../_libs/react.mjs";
import "./errors--trM2I6Z.mjs";
import "node:async_hooks";
import "node:stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
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
const getServerSession_createServerFn_handler = createServerRpc({
  id: "1f1668e7d7965c9a082c0b0989defd920f33a45fe76095a317d6e6231b218e1e",
  name: "getServerSession",
  filename: "src/lib/session-fns.ts"
}, (opts) => getServerSession.__executeServer(opts));
const getServerSession = createServerFn({
  method: "GET"
}).handler(getServerSession_createServerFn_handler, async () => {
  const request = getRequest();
  return getSession(request.headers);
});
const getProtectedContext_createServerFn_handler = createServerRpc({
  id: "356f475d7b5ed59d19b74277a577057b2938b4ed49cda35795f6e2468f046cbe",
  name: "getProtectedContext",
  filename: "src/lib/session-fns.ts"
}, (opts) => getProtectedContext.__executeServer(opts));
const getProtectedContext = createServerFn({
  method: "GET"
}).handler(getProtectedContext_createServerFn_handler, async () => {
  const request = getRequest();
  const authSession = await getSession(request.headers);
  if (!authSession) throw redirect({
    to: "/login"
  });
  const organizationId = authSession.session.activeOrganizationId;
  if (!organizationId) throw redirect({
    to: "/onboarding"
  });
  return {
    session: authSession.session,
    user: authSession.user,
    organizationId
  };
});
export {
  getProtectedContext_createServerFn_handler,
  getServerSession_createServerFn_handler
};
