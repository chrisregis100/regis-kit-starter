import { execSync, spawn } from "node:child_process";
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
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

interface CliOptions {
  projectName: string;
  targetDir: string;
}

interface OAuthProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
}

interface ProjectConfig {
  projectName: string;
  databaseName: string;
  postgresUser: string;
  postgresPassword: string;
  betterAuthSecret: string;
  betterAuthUrl: string;
  port: number;
  google: OAuthProviderConfig;
  github: OAuthProviderConfig;
}

const TEMPLATE_REPO = "chrisregis100/regis-kit-starter";

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

const color = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
};

const isInteractive = process.stdout.isTTY && !process.env.CI;

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

function parseArguments(): CliOptions {
  const projectName = process.argv[2];

  if (!projectName) {
    exitWithError("Usage: create-rk-kit <project-name>");
  }

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

function runCommand(command: string, cwd: string): void {
  execSync(command, { cwd, stdio: "inherit" });
}

async function prompt(message: string, defaultValue?: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promptText = defaultValue
    ? `${message} (${color.gray(defaultValue)}): `
    : `${message}: `;

  try {
    const answer = await rl.question(promptText);
    return answer.trim() || defaultValue || "";
  } finally {
    rl.close();
  }
}

async function promptConfirm(
  message: string,
  defaultValue = false,
): Promise<boolean> {
  const suffix = defaultValue ? " [Y/n]" : " [y/N]";
  const answer = await prompt(`${message}${suffix}`, defaultValue ? "Y" : "N");
  const normalized = answer.toLowerCase().trim();
  return normalized === "y" || normalized === "yes";
}

async function promptOAuthProvider(name: string): Promise<OAuthProviderConfig> {
  const enabled = await promptConfirm(`Enable ${name} OAuth?`, false);

  if (!enabled) return { enabled: false, clientId: "", clientSecret: "" };

  const clientId = await prompt(
    `${name} Client ID`,
    "leave empty to configure later",
  );
  const clientSecret = await prompt(
    `${name} Client Secret`,
    "leave empty to configure later",
  );

  return {
    enabled: true,
    clientId: clientId === "leave empty to configure later" ? "" : clientId,
    clientSecret:
      clientSecret === "leave empty to configure later" ? "" : clientSecret,
  };
}

async function promptProjectConfig(
  projectName: string,
): Promise<ProjectConfig> {
  const databaseName = await prompt(
    "Database name",
    projectName.replace(/-/g, "_"),
  );
  const postgresUser = await prompt("PostgreSQL user", "rk_kit");
  const postgresPassword = await prompt("PostgreSQL password", "rk_kit_secret");
  const port = await prompt("App port", "3000");

  const google = await promptOAuthProvider("Google");
  const github = await promptOAuthProvider("GitHub");

  const parsedPort = Number(port) || 3000;

  return {
    projectName,
    databaseName,
    postgresUser,
    postgresPassword,
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
    "",
    "# Connection string used by Drizzle + Better Auth",
    `DATABASE_URL=postgresql://${config.postgresUser}:${config.postgresPassword}@localhost:5432/${config.databaseName}`,
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
    "# App (TanStack Start)",
    "# NOTE: Render deployment → bind to 0.0.0.0:$PORT",
    "# ─────────────────────────────────────────────",
    `PORT=${config.port}`,
    "NODE_ENV=development",
    "",
  ];

  return lines.join("\n");
}

function writeEnvFile(targetDir: string, config: ProjectConfig): void {
  writeFileSync(join(targetDir, ".env"), buildEnvFile(config), "utf8");
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
  const repoUrl = `https://github.com/${TEMPLATE_REPO}.git`;
  const spinner = new Spinner();
  spinner.start(`Downloading template from ${TEMPLATE_REPO}...`);

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
  const localRoot = findLocalTemplateRoot();

  if (localRoot) {
    await copyLocalTemplate(localRoot, targetDir);
    return;
  }

  try {
    await cloneRemoteTemplate(targetDir);
  } catch (error) {
    throw new Error(
      `Failed to download template from ${TEMPLATE_REPO}. ` +
        `Check that the repository is public and accessible, ` +
        `or run the installer from inside the RK Kit monorepo.\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function showNextSteps(projectName: string, targetDir: string): void {
  const cdCommand = `cd ${projectName}`;
  const devCommand = "pnpm dev";

  console.log();
  console.log(color.green("Project ready:"), targetDir);
  console.log();
  console.log(color.cyan("─────────────────────────────────────────────"));
  console.log("  Next steps:");
  console.log();
  console.log("  1. Move into your project folder:");
  console.log(`     ${color.cyan(cdCommand)}`);
  console.log();
  console.log("  2. Start the development server:");
  console.log(`     ${color.cyan(devCommand)}`);
  console.log();
  console.log("  Or run both at once:");
  console.log(`     ${color.cyan(`${cdCommand} && ${devCommand}`)}`);
  console.log(color.cyan("─────────────────────────────────────────────"));
  console.log();
}

async function waitForPostgres(
  config: ProjectConfig,
  targetDir: string,
): Promise<void> {
  const healthCommand = `docker compose exec -T postgres pg_isready -U ${config.postgresUser} -d ${config.databaseName}`;
  const spinner = new Spinner();
  spinner.start("Waiting for PostgreSQL to be healthy...");

  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      execSync(healthCommand, { cwd: targetDir, stdio: "ignore" });
      spinner.stop({ message: "PostgreSQL is ready", success: true });
      return;
    } catch {
      await sleep(1000);
    }
  }

  spinner.stop({
    message: "PostgreSQL did not become healthy",
    success: false,
  });
  throw new Error("PostgreSQL did not become healthy in time.");
}

async function runPostInstall(
  config: ProjectConfig,
  targetDir: string,
): Promise<void> {
  logStep("Installing dependencies...");
  runCommand("pnpm install", targetDir);

  logStep("Building shared packages...");
  runCommand("pnpm turbo run build --filter=!@rk-kit/web", targetDir);

  logStep("Starting PostgreSQL...");
  runCommand("docker compose up -d", targetDir);

  await waitForPostgres(config, targetDir);

  logStep("Applying database migrations...");
  runCommand("pnpm --filter @rk-kit/db db:migrate", targetDir);
}

async function main(): Promise<void> {
  await printBanner();

  const options = parseArguments();
  const config = await promptProjectConfig(options.projectName);

  logStep("Scaffolding project...");
  await installTemplate(options.targetDir);
  writeEnvFile(options.targetDir, config);

  const shouldStart = await promptConfirm(
    "Install dependencies, start PostgreSQL, and run migrations now?",
    true,
  );

  if (shouldStart) {
    await runPostInstall(config, options.targetDir);

    const shouldStartDev = await promptConfirm(
      "Start the development server now?",
      true,
    );

    if (shouldStartDev) {
      logStep("Starting development server...");
      runCommand("pnpm dev", options.targetDir);
      return;
    }
  }

  showNextSteps(options.projectName, options.targetDir);
}

main().catch((error: unknown) => {
  console.error(
    color.red(error instanceof Error ? error.message : String(error)),
  );
  process.exit(1);
});
