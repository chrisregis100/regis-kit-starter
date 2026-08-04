import { c as createServerRpc, r as requireOrganization } from "./helpers-CjQ5R2cq.mjs";
import { c as createServerFn, g as getRequest } from "./index.mjs";
import "./index-0g789sOm.mjs";
import { g as getTeam, i as inviteMemberSchema, a as inviteMember, r as removeMemberSchema, b as removeMember } from "./team-service-DJux0L2k.mjs";
import "../_libs/react.mjs";
import "./errors--trM2I6Z.mjs";
import "node:async_hooks";
import "node:stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "util";
import "crypto";
import "stream";
import "../_libs/isbot.mjs";
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
const getTeamData_createServerFn_handler = createServerRpc({
  id: "0834354134f0327befc08250d042611d8535da1a18f3e253772a80c024b963d4",
  name: "getTeamData",
  filename: "src/routes/_protected/team.tsx"
}, (opts) => getTeamData.__executeServer(opts));
const getTeamData = createServerFn({
  method: "GET"
}).handler(getTeamData_createServerFn_handler, async () => {
  const request = getRequest();
  const {
    organizationId
  } = await requireOrganization(request.headers);
  const team = await getTeam(organizationId, request.headers);
  return {
    organizationId,
    ...team
  };
});
const inviteMemberFn_createServerFn_handler = createServerRpc({
  id: "f7d07888c791e8f5a0ed774969d6a5a34f3ae35ccd6f56b9a04689e0e203ebe6",
  name: "inviteMemberFn",
  filename: "src/routes/_protected/team.tsx"
}, (opts) => inviteMemberFn.__executeServer(opts));
const inviteMemberFn = createServerFn({
  method: "POST"
}).validator(inviteMemberSchema).handler(inviteMemberFn_createServerFn_handler, async (ctx) => {
  const request = getRequest();
  const {
    organizationId
  } = await requireOrganization(request.headers);
  await inviteMember(organizationId, request.headers, ctx.data);
  return {
    success: true
  };
});
const removeMemberFn_createServerFn_handler = createServerRpc({
  id: "9de02c8d8a94b82aa7cc98a214d61bcfa2f665a56b1f1085294a3f06af3d0887",
  name: "removeMemberFn",
  filename: "src/routes/_protected/team.tsx"
}, (opts) => removeMemberFn.__executeServer(opts));
const removeMemberFn = createServerFn({
  method: "POST"
}).validator(removeMemberSchema).handler(removeMemberFn_createServerFn_handler, async (ctx) => {
  const request = getRequest();
  const {
    organizationId
  } = await requireOrganization(request.headers);
  await removeMember(organizationId, request.headers, ctx.data);
  return {
    success: true
  };
});
export {
  getTeamData_createServerFn_handler,
  inviteMemberFn_createServerFn_handler,
  removeMemberFn_createServerFn_handler
};
