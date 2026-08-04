import { c as createServerRpc, r as requireOrganization } from "./helpers-CjQ5R2cq.mjs";
import { c as createServerFn, g as getRequest } from "./index.mjs";
import { p as project, g as getDb, s as sql } from "./index-0g789sOm.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
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
async function withTenant(organizationId, fn) {
  if (!organizationId || organizationId.trim() === "") {
    throw new Error("[rk-kit/db] withTenant: organizationId must not be empty");
  }
  return getDb().transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.current_organization_id', ${organizationId}, true)`);
    return fn(tx);
  });
}
object({
  name: string().min(1, "Name is required").max(100, "Name is too long"),
  description: string().max(500, "Description is too long").optional()
});
async function listProjects(organizationId, runInTenant = withTenant) {
  return runInTenant(
    organizationId,
    (tx) => tx.select().from(project).limit(50)
  );
}
const getDashboardData_createServerFn_handler = createServerRpc({
  id: "95d159cdf051cfa2a6ec9a6231ed8d383d460449e14d7d130899f402e5c49690",
  name: "getDashboardData",
  filename: "src/routes/_protected/dashboard.tsx"
}, (opts) => getDashboardData.__executeServer(opts));
const getDashboardData = createServerFn({
  method: "GET"
}).handler(getDashboardData_createServerFn_handler, async () => {
  const request = getRequest();
  const {
    organizationId
  } = await requireOrganization(request.headers);
  const projects = await listProjects(organizationId);
  return {
    projects,
    organizationId
  };
});
export {
  getDashboardData_createServerFn_handler
};
