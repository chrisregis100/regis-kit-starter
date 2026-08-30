import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { cp } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  createInterface,
  type Interface as ReadlineInterface,
} from "node:readline/promises";
import { fileURLToPath } from "node:url";

interface CliOptions {
  projectName: string;
  targetDir: string;
}

type AppFramework = "tanstack-start" | "nextjs-app-router";

interface OAuthProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
}

interface ProjectConfig {
  framework: AppFramework;
  projectName: string;
  databaseName: string;
  postgresUser: string;
  postgresPassword: string;
  applicationDatabasePassword: string;
  betterAuthSecret: string;
  betterAuthUrl: string;
  port: number;
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
}

const DEFAULT_TEMPLATE_REPO = "chrisregis100/regis-kit-starter";
const configuredTemplateRepo = process.env["RK_KIT_TEMPLATE_REPO"]?.trim();
const templateRepo = configuredTemplateRepo || DEFAULT_TEMPLATE_REPO;

const EXCLUDED_TOP_LEVEL_DIRS = new Set([
  "node_modules",
  ".git",
  ".turbo",
  ".output",
  ".pnpm-store",
  "packages/create-rk-kit",
  "dist",
]);

const EXCLUDED_TOP_LEVEL_FILES = new Set([".env"]);
const NEXTJS_TEMPLATE_PATH = join("templates", "nextjs-app-router");

const color = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
};

const isInteractive = process.stdout.isTTY && !process.env.CI;
let readlineInterface: ReadlineInterface | undefined;
let nonInteractiveAnswers: string[] | undefined;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rgbColor([r, g, b]: [number, number, number]): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

async function typewrite(text: string, delay: number): Promise<void> {
  if (!isInteractive) {
    process.stdout.write(text);
    return;
  }

  for (const char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
}

class Spinner {
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private interval: ReturnType<typeof setInterval> | null = null;
  private frameIndex = 0;

  start(message: string): void {
    if (!isInteractive) return;
    this.stop();
    this.frameIndex = 0;
    this.interval = setInterval(() => {
      const frame = this.frames[this.frameIndex % this.frames.length]!;
      process.stdout.write(`\r${color.cyan(frame)} ${message}`);
      this.frameIndex++;
    }, 80);
  }

  stop(options: { message?: string; success?: boolean } = {}): void {
    if (!this.interval) {
      if (options.message) {
        const prefix =
          options.success === false ? color.red("✗") : color.green("✓");
        console.log(`${prefix} ${options.message}`);
      }
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
    process.stdout.write("\r\x1b[K");

    if (options.message) {
      const prefix =
        options.success === false ? color.red("✗") : color.green("✓");
      console.log(`${prefix} ${options.message}`);
    }
  }
}

async function printBanner(): Promise<void> {
  const lines = [
    "  ██████╗ ██╗  ██╗    ██╗  ██╗██╗████████╗",
    "  ██╔══██╗██║ ██╔╝    ██║ ██╔╝██║╚══██╔══╝",
    "  ██████╔╝█████╔╝     █████╔╝ ██║   ██║   ",
    "  ██╔══██╗██╔═██╗     ██╔═██╗ ██║   ██║   ",
    "  ██║  ██║██║  ██╗    ██║  ██╗██║   ██║   ",
    "  ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝   ╚═╝   ",
  ];

  const colors: [number, number, number][] = [
    [0, 255, 255],
    [0, 200, 255],
    [0, 150, 255],
    [100, 100, 255],
    [200, 100, 255],
    [255, 0, 255],
  ];
  const fallbackColor = colors[colors.length - 1]!;

  console.log();

  if (!isInteractive) {
    for (let i = 0; i < lines.length; i++) {
      const [r, g, b] = colors[i] ?? fallbackColor;
      console.log(`${rgbColor([r, g, b])}${lines[i]}\x1b[0m`);
    }
    console.log();
    console.log("  Welcome to RK Kit — your SaaS starter CLI");
    console.log();
    return;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [r, g, b] = colors[i] ?? fallbackColor;
    process.stdout.write(`${rgbColor([r, g, b])}${line}\x1b[0m\n`);
    await sleep(50);
  }

  console.log();
  await typewrite("  Welcome to RK Kit — your SaaS starter CLI", 25);
  console.log();
  console.log();
}

function exitWithError(message: string): never {
  console.error(color.red(message));
  process.exit(1);
}

function logStep(message: string): void {
  console.log(color.cyan("→"), message);
}

async function parseArguments(): Promise<CliOptions> {
  const projectName =
    process.argv[2] ?? (await prompt("Project name", "my-saas"));

  if (!/^[a-z0-9_-]+$/i.test(projectName)) {
    exitWithError(
      "Project name must contain only letters, numbers, underscores, and hyphens.",
    );
  }

  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    exitWithError(`Directory already exists: ${targetDir}`);
  }

  return { projectName, targetDir };
}

function generateAuthSecret(): string {
  return randomBytes(32).toString("base64");
}

function generateDatabasePassword(): string {
  return randomBytes(24).toString("hex");
}

function findLocalTemplateRoot(): string | undefined {
  const currentFile = fileURLToPath(import.meta.url);
  const candidateRoot = resolve(currentFile, "../../../..");

  if (!existsSync(candidateRoot)) return undefined;

  const packageJsonPath = join(candidateRoot, "package.json");
  if (!existsSync(packageJsonPath)) return undefined;

  try {
    const content = readFileSync(packageJsonPath, "utf8");
    const pkg = JSON.parse(content) as { name?: string };
    return pkg.name === "rk-kit-monorepo" ? candidateRoot : undefined;
  } catch {
    return undefined;
  }
}

async function prompt(message: string, defaultValue?: string): Promise<string> {
  const promptText = defaultValue
    ? `${message} (${color.gray(defaultValue)}): `
    : `${message}: `;

  if (!process.stdin.isTTY) {
    nonInteractiveAnswers ??= readFileSync(0, "utf8").split(/\r?\n/);
    process.stdout.write(promptText);
    const answer = nonInteractiveAnswers.shift() ?? "";
    return answer.trim() || defaultValue || "";
  }

  readlineInterface ??= createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await readlineInterface.question(promptText);
  return answer.trim() || defaultValue || "";
}

async function promptFramework(): Promise<AppFramework> {
  console.log("  1. TanStack Start (default)");
  console.log("  2. Next.js App Router");
  const answer = await prompt("App framework", "1");
  const normalized = answer.toLowerCase();

  if (normalized === "1" || normalized === "tanstack" || normalized === "tanstack-start") {
    return "tanstack-start";
  }
  if (normalized === "2" || normalized === "next" || normalized === "nextjs") {
    return "nextjs-app-router";
  }

  exitWithError("App framework must be 1 (TanStack Start) or 2 (Next.js App Router).");
}

async function promptOAuthProviders(): Promise<{
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
}> {
  const answer = await prompt(
    "OAuth providers to configure (none, google, github, or both)",
    "none",
  );
  const normalized = answer.toLowerCase().replace(/\s+/g, "");
  const isGoogleEnabled = normalized === "google" || normalized === "both";
  const isGithubEnabled = normalized === "github" || normalized === "both";

  if (
    normalized !== "none" &&
    normalized !== "google" &&
    normalized !== "github" &&
    normalized !== "both"
  ) {
    exitWithError("OAuth providers must be none, google, github, or both.");
  }

  return {
    google: { enabled: isGoogleEnabled, clientId: "", clientSecret: "" },
    github: { enabled: isGithubEnabled, clientId: "", clientSecret: "" },
  };
}

async function promptProjectConfig(
  projectName: string,
  framework: AppFramework,
): Promise<ProjectConfig> {
  const databaseName = await prompt(
    "Database name",
    projectName.replace(/-/g, "_"),
  );
  const { google, github } = await promptOAuthProviders();
  const parsedPort = 3000;

  return {
    framework,
    projectName,
    databaseName,
    postgresUser: "rk_kit",
    postgresPassword: "rk_kit_secret",
    applicationDatabasePassword: generateDatabasePassword(),
    betterAuthSecret: generateAuthSecret(),
    betterAuthUrl: `http://localhost:${parsedPort}`,
    port: parsedPort,
    google,
    github,
  };
}

function buildEnvFile(config: ProjectConfig): string {
  const lines = [
    "# ─────────────────────────────────────────────",
    "# PostgreSQL (Docker local dev)",
    "# ─────────────────────────────────────────────",
    `POSTGRES_USER=${config.postgresUser}`,
    `POSTGRES_PASSWORD=${config.postgresPassword}`,
    `POSTGRES_DB=${config.databaseName}`,
    `APP_DB_PASSWORD=${config.applicationDatabasePassword}`,
    "",
    "# Restricted runtime connection (RLS enforced)",
    `DATABASE_URL=postgresql://app_user:${config.applicationDatabasePassword}@localhost:5432/${config.databaseName}`,
    "# Privileged owner connection used only by drizzle-kit migrations",
    `DATABASE_URL_MIGRATIONS=postgresql://${config.postgresUser}:${config.postgresPassword}@localhost:5432/${config.databaseName}`,
    "",
    "# ─────────────────────────────────────────────",
    "# Better Auth",
    "# ─────────────────────────────────────────────",
    "# Generate a strong secret: openssl rand -base64 32",
    `BETTER_AUTH_SECRET=${config.betterAuthSecret}`,
    `BETTER_AUTH_URL=${config.betterAuthUrl}`,
    "",
    "# OAuth callback URL pattern:",
    "#   {BETTER_AUTH_URL}/api/auth/callback/{provider}",
    "",
    "# ─────────────────────────────────────────────",
    "# OAuth providers (optional — leave empty to disable)",
    "# ─────────────────────────────────────────────",
    "",
    "# Google — https://console.cloud.google.com/apis/credentials",
    `GOOGLE_CLIENT_ID=${config.google.clientId}`,
    `GOOGLE_CLIENT_SECRET=${config.google.clientSecret}`,
    "",
    "# GitHub — https://github.com/settings/developers",
    `GITHUB_CLIENT_ID=${config.github.clientId}`,
    `GITHUB_CLIENT_SECRET=${config.github.clientSecret}`,
    "",
    "# Facebook — https://developers.facebook.com/apps",
    "FACEBOOK_CLIENT_ID=",
    "FACEBOOK_CLIENT_SECRET=",
    "",
    "# Apple — https://developer.apple.com/account/resources/identifiers/list",
    "# Note: Apple does NOT support http://localhost callbacks — use HTTPS in dev (e.g. ngrok)",
    "APPLE_CLIENT_ID=",
    "APPLE_TEAM_ID=",
    "APPLE_KEY_ID=",
    "# Paste .p8 key contents; use \\n for line breaks in .env",
    "APPLE_PRIVATE_KEY=",
    "APPLE_APP_BUNDLE_IDENTIFIER=",
    "",
    "# Microsoft — https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps",
    "MICROSOFT_CLIENT_ID=",
    "MICROSOFT_CLIENT_SECRET=",
    "",
    "# Discord — https://discord.com/developers/applications",
    "DISCORD_CLIENT_ID=",
    "DISCORD_CLIENT_SECRET=",
    "",
    "# LinkedIn — https://www.linkedin.com/developers/apps",
    "LINKEDIN_CLIENT_ID=",
    "LINKEDIN_CLIENT_SECRET=",
    "",
    "# ─────────────────────────────────────────────",
    `# App (${config.framework === "tanstack-start" ? "TanStack Start" : "Next.js App Router"})`,
    "# NOTE: Render deployment → bind to 0.0.0.0:$PORT",
    "# ─────────────────────────────────────────────",
    `PORT=${config.port}`,
    "NODE_ENV=development",
    "",
  ];

  return lines.join("\n");
}

function writeEnvFile(targetDir: string, config: ProjectConfig): void {
  const envFile = buildEnvFile(config);
  writeFileSync(join(targetDir, ".env"), envFile, "utf8");

  if (config.framework === "nextjs-app-router") {
    writeFileSync(join(targetDir, "apps", "web", ".env.local"), envFile, "utf8");
  }
}

async function copyLocalTemplate(
  templateRoot: string,
  targetDir: string,
): Promise<void> {
  const spinner = new Spinner();
  spinner.start("Copying template from local monorepo...");

  try {
    mkdirSync(targetDir, { recursive: true });
    await cp(templateRoot, targetDir, {
      recursive: true,
      filter: (source: string) => {
        const relative = source.replace(templateRoot, "").replace(/^[/\\]/, "");
        const parts = relative.split(/[/\\]/).filter(Boolean);
        if (parts.length === 0) return true;
        if (parts.length === 1) {
          return (
            !EXCLUDED_TOP_LEVEL_DIRS.has(parts[0]!) &&
            !EXCLUDED_TOP_LEVEL_FILES.has(parts[0]!)
          );
        }
        return !EXCLUDED_TOP_LEVEL_DIRS.has(parts[0]!);
      },
    });
  } finally {
    spinner.stop({ message: "Template copied", success: true });
  }
}

async function cloneRemoteTemplate(targetDir: string): Promise<void> {
  const repoUrl = `https://github.com/${templateRepo}.git`;
  const spinner = new Spinner();
  spinner.start(`Downloading template from ${templateRepo}...`);

  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        "git",
        ["clone", "--depth", "1", repoUrl, targetDir],
        {
          stdio: "ignore",
        },
      );
      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(`git clone exited with code ${code}`));
      });
    });
  } finally {
    spinner.stop({ message: "Template downloaded", success: true });
  }

  rmSync(join(targetDir, ".git"), { recursive: true, force: true });
}

async function installTemplate(targetDir: string): Promise<void> {
  const localRoot = configuredTemplateRepo
    ? undefined
    : findLocalTemplateRoot();

  if (localRoot) {
    await copyLocalTemplate(localRoot, targetDir);
    return;
  }

  try {
    await cloneRemoteTemplate(targetDir);
  } catch (error) {
    throw new Error(
      `Failed to download template from ${templateRepo}. ` +
        `Check that the repository is public and accessible, ` +
        `or run the installer from inside the RK Kit monorepo.\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function copyFrameworkSharedFiles(
  sourceWebDir: string,
  stagingDir: string,
): Promise<void> {
  const pathsToCopy = [
    "public",
    join("src", "api"),
    join("src", "services"),
    join("src", "styles"),
    join("src", "lib", "auth-client.ts"),
    join("src", "components", "auth"),
  ];

  for (const relativePath of pathsToCopy) {
    const sourcePath = join(sourceWebDir, relativePath);
    if (!existsSync(sourcePath)) continue;

    await cp(sourcePath, join(stagingDir, relativePath), {
      recursive: true,
      filter: (path) =>
        !path.endsWith(".test.ts") &&
        !path.endsWith(".test.tsx") &&
        !path.endsWith("auth-providers-service.ts"),
    });
  }
}

async function applyFrameworkTemplate(
  targetDir: string,
  framework: AppFramework,
): Promise<void> {
  const templatesDir = join(targetDir, "templates");

  if (framework === "tanstack-start") {
    rmSync(templatesDir, { recursive: true, force: true });
    return;
  }

  const nextTemplateDir = join(targetDir, NEXTJS_TEMPLATE_PATH);
  if (!existsSync(nextTemplateDir)) {
    throw new Error(
      `The selected template repository (${templateRepo}) does not contain ${NEXTJS_TEMPLATE_PATH}.`,
    );
  }

  const webDir = join(targetDir, "apps", "web");
  const stagingDir = join(targetDir, ".rk-kit-web-shared");
  mkdirSync(stagingDir, { recursive: true });
  await copyFrameworkSharedFiles(webDir, stagingDir);

  rmSync(webDir, { recursive: true, force: true });
  await cp(nextTemplateDir, webDir, { recursive: true });
  await cp(stagingDir, webDir, { recursive: true });
  rmSync(stagingDir, { recursive: true, force: true });
  rmSync(templatesDir, { recursive: true, force: true });
}

function showNextSteps(projectName: string, targetDir: string): void {
  const cdCommand = `cd ${projectName}`;

  console.log();
  console.log(color.green("Project ready:"), targetDir);
  console.log();
  console.log(color.cyan("─────────────────────────────────────────────"));
  console.log("  Next steps:");
  console.log();
  console.log("  1. Move into your project folder:");
  console.log(`     ${color.cyan(cdCommand)}`);
  console.log();
  console.log("  2. Install dependencies:");
  console.log(`     ${color.cyan("pnpm install")}`);
  console.log();
  console.log("  3. Start PostgreSQL and apply migrations:");
  console.log(`     ${color.cyan("docker compose up -d")}`);
  console.log(`     ${color.cyan("pnpm --filter @rk-kit/db db:migrate")}`);
  console.log();
  console.log("  4. Start the development server:");
  console.log(`     ${color.cyan("pnpm dev")}`);
  console.log(color.cyan("─────────────────────────────────────────────"));
  console.log();
}

async function main(): Promise<void> {
  await printBanner();

  const framework = await promptFramework();
  const options = await parseArguments();
  const config = await promptProjectConfig(options.projectName, framework);

  logStep("Scaffolding project...");
  await installTemplate(options.targetDir);
  await applyFrameworkTemplate(options.targetDir, framework);
  writeEnvFile(options.targetDir, config);

  showNextSteps(options.projectName, options.targetDir);
}

main().catch((error: unknown) => {
  console.error(
    color.red(error instanceof Error ? error.message : String(error)),
  );
  process.exit(1);
}).finally(() => {
  readlineInterface?.close();
});
