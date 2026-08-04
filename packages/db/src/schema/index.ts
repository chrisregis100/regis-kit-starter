/**
 * Combined schema export.
 * Import this file in drizzle.config.ts and in the db client.
 */

// Auth tables (managed by Better Auth)
export {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
} from "./auth.js";

// Business domain tables (add new tables here as the product grows)
export { project } from "./business.js";
export type { Project, NewProject } from "./business.js";
