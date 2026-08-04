import { randomBytes } from 'node:crypto'
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

interface CliOptions {
  projectName: string
  targetDir: string
}

interface OAuthProviderConfig {
  enabled: boolean
  clientId: string
  clientSecret: string
}

interface ProjectConfig {
  projectName: string
  databaseName: string
  postgresUser: string
  postgresPassword: string
  betterAuthSecret: string
  betterAuthUrl: string
  port: number
  google: OAuthProviderConfig
  github: OAuthProviderConfig
}

const TEMPLATE_REPO = process.env['RK_KIT_TEMPLATE_REPO'] ?? 'rk-kit/regis-kit-starter'
const APP_DATABASE_USER = 'app_user'
const APP_DATABASE_PASSWORD = 'change-me-in-production'

const EXCLUDED_TOP_LEVEL_DIRS = new Set([
  'node_modules',
  '.git',
  '.turbo',
  '.output',
  '.pnpm-store',
  'dist',
])

const EXCLUDED_PATHS = new Set(['packages/create-rk-kit'])
const EXCLUDED_TOP_LEVEL_FILES = new Set(['.env'])

const color = {
  red: (text: string) => `\x1b[31m${text}\x1b[0m`,
  green: (text: string) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
  gray: (text: string) => `\x1b[90m${text}\x1b[0m`,
}

function exitWithError(message: string): never {
  console.error(color.red(message))
  process.exit(1)
}

function logStep(message: string): void {
  console.log(color.cyan('→'), message)
}

function parseArguments(): CliOptions {
  const projectName = process.argv[2]

  if (!projectName) {
    exitWithError('Usage: create-rk-kit <project-name>')
  }

  if (!/^[a-z0-9_-]+$/i.test(projectName)) {
    exitWithError('Project name must contain only letters, numbers, underscores, and hyphens.')
  }

  const targetDir = resolve(process.cwd(), projectName)

  if (existsSync(targetDir)) {
    exitWithError(`Directory already exists: ${targetDir}`)
  }

  return { projectName, targetDir }
}

function generateAuthSecret(): string {
  return randomBytes(32).toString('base64')
}

function buildDatabaseUrl(user: string, password: string, databaseName: string): string {
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@localhost:5432/${encodeURIComponent(databaseName)}`
}

function findLocalTemplateRoot(): string | undefined {
  const currentFile = fileURLToPath(import.meta.url)
  const candidateRoot = resolve(currentFile, '../../../..')

  if (!existsSync(candidateRoot)) return undefined

  const packageJsonPath = join(candidateRoot, 'package.json')
  if (!existsSync(packageJsonPath)) return undefined

  try {
    const content = readFileSync(packageJsonPath, 'utf8')
    const pkg = JSON.parse(content) as { name?: string }
    return pkg.name === 'rk-kit-monorepo' ? candidateRoot : undefined
  } catch {
    return undefined
  }
}

function runCommand(command: string, cwd: string): void {
  execSync(command, { cwd, stdio: 'inherit' })
}

async function prompt(message: string, defaultValue?: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const promptText = defaultValue ? `${message} (${color.gray(defaultValue)}): ` : `${message}: `

  try {
    const answer = await rl.question(promptText)
    return answer.trim() || defaultValue || ''
  } finally {
    rl.close()
  }
}

async function promptConfirm(message: string, defaultValue = false): Promise<boolean> {
  const suffix = defaultValue ? ' [Y/n]' : ' [y/N]'
  const answer = await prompt(`${message}${suffix}`, defaultValue ? 'Y' : 'N')
  const normalized = answer.toLowerCase().trim()
  return normalized === 'y' || normalized === 'yes'
}

async function promptOAuthProvider(name: string): Promise<OAuthProviderConfig> {
  const enabled = await promptConfirm(`Enable ${name} OAuth?`, false)

  if (!enabled) return { enabled: false, clientId: '', clientSecret: '' }

  const clientId = await prompt(`${name} Client ID`, 'leave empty to configure later')
  const clientSecret = await prompt(`${name} Client Secret`, 'leave empty to configure later')

  return {
    enabled: true,
    clientId: clientId === 'leave empty to configure later' ? '' : clientId,
    clientSecret: clientSecret === 'leave empty to configure later' ? '' : clientSecret,
  }
}

async function promptProjectConfig(projectName: string): Promise<ProjectConfig> {
  const databaseName = await prompt('Database name', projectName.replace(/-/g, '_'))
  const postgresUser = await prompt('PostgreSQL user', 'rk_kit')
  const postgresPassword = await prompt('PostgreSQL password', 'rk_kit_secret')
  const port = await prompt('App port', '3000')

  const google = await promptOAuthProvider('Google')
  const github = await promptOAuthProvider('GitHub')

  const parsedPort = Number(port) || 3000

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
  }
}

function buildEnvFile(config: ProjectConfig): string {
  const lines = [
    '# ─────────────────────────────────────────────',
    '# PostgreSQL (Docker local dev)',
    '# ─────────────────────────────────────────────',
    `POSTGRES_USER=${config.postgresUser}`,
    `POSTGRES_PASSWORD=${config.postgresPassword}`,
    `POSTGRES_DB=${config.databaseName}`,
    '',
    '# Runtime connection used by Drizzle + Better Auth (RLS enforced)',
    `DATABASE_URL=${buildDatabaseUrl(APP_DATABASE_USER, APP_DATABASE_PASSWORD, config.databaseName)}`,
    '# Owner connection used only for database migrations',
    `DATABASE_URL_MIGRATIONS=${buildDatabaseUrl(config.postgresUser, config.postgresPassword, config.databaseName)}`,
    '',
    '# ─────────────────────────────────────────────',
    '# Better Auth',
    '# ─────────────────────────────────────────────',
    '# Generate a strong secret: openssl rand -base64 32',
    `BETTER_AUTH_SECRET=${config.betterAuthSecret}`,
    `BETTER_AUTH_URL=${config.betterAuthUrl}`,
    '',
    '# OAuth callback URL pattern:',
    '#   {BETTER_AUTH_URL}/api/auth/callback/{provider}',
    '',
    '# ─────────────────────────────────────────────',
    '# OAuth providers (optional — leave empty to disable)',
    '# ─────────────────────────────────────────────',
    '',
    '# Google — https://console.cloud.google.com/apis/credentials',
    `GOOGLE_CLIENT_ID=${config.google.clientId}`,
    `GOOGLE_CLIENT_SECRET=${config.google.clientSecret}`,
    '',
    '# GitHub — https://github.com/settings/developers',
    `GITHUB_CLIENT_ID=${config.github.clientId}`,
    `GITHUB_CLIENT_SECRET=${config.github.clientSecret}`,
    '',
    '# Facebook — https://developers.facebook.com/apps',
    'FACEBOOK_CLIENT_ID=',
    'FACEBOOK_CLIENT_SECRET=',
    '',
    '# Apple — https://developer.apple.com/account/resources/identifiers/list',
    '# Note: Apple does NOT support http://localhost callbacks — use HTTPS in dev (e.g. ngrok)',
    'APPLE_CLIENT_ID=',
    'APPLE_TEAM_ID=',
    'APPLE_KEY_ID=',
    '# Paste .p8 key contents; use \\n for line breaks in .env',
    'APPLE_PRIVATE_KEY=',
    'APPLE_APP_BUNDLE_IDENTIFIER=',
    '',
    '# Microsoft — https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps',
    'MICROSOFT_CLIENT_ID=',
    'MICROSOFT_CLIENT_SECRET=',
    '',
    '# Discord — https://discord.com/developers/applications',
    'DISCORD_CLIENT_ID=',
    'DISCORD_CLIENT_SECRET=',
    '',
    '# LinkedIn — https://www.linkedin.com/developers/apps',
    'LINKEDIN_CLIENT_ID=',
    'LINKEDIN_CLIENT_SECRET=',
    '',
    '# ─────────────────────────────────────────────',
    '# App (TanStack Start)',
    '# NOTE: Render deployment → bind to 0.0.0.0:$PORT',
    '# ─────────────────────────────────────────────',
    `PORT=${config.port}`,
    'NODE_ENV=development',
    '',
  ]

  return lines.join('\n')
}

function writeEnvFile(targetDir: string, config: ProjectConfig): void {
  writeFileSync(join(targetDir, '.env'), buildEnvFile(config), 'utf8')
}

async function copyLocalTemplate(templateRoot: string, targetDir: string): Promise<void> {
  mkdirSync(targetDir, { recursive: true })

  cpSync(templateRoot, targetDir, {
    recursive: true,
    filter: (source: string) => {
      const relative = source.replace(templateRoot, '').replace(/^[/\\]/, '')
      const parts = relative.split(/[/\\]/).filter(Boolean)
      if (parts.length === 0) return true
      if (EXCLUDED_PATHS.has(parts.slice(0, 2).join('/'))) return false
      if (parts.length === 1) {
        return !EXCLUDED_TOP_LEVEL_DIRS.has(parts[0]!) && !EXCLUDED_TOP_LEVEL_FILES.has(parts[0]!)
      }
      return !EXCLUDED_TOP_LEVEL_DIRS.has(parts[0]!)
    },
  })
}

async function cloneRemoteTemplate(targetDir: string): Promise<void> {
  const repoUrl = `https://github.com/${TEMPLATE_REPO}.git`
  runCommand(`git clone --depth 1 ${repoUrl} "${targetDir}"`, process.cwd())
  rmSync(join(targetDir, '.git'), { recursive: true, force: true })
}

async function installTemplate(targetDir: string): Promise<void> {
  const localRoot = findLocalTemplateRoot()

  if (localRoot) {
    logStep('Copying template from local monorepo...')
    await copyLocalTemplate(localRoot, targetDir)
    return
  }

  logStep(`Downloading template from ${TEMPLATE_REPO}...`)
  try {
    await cloneRemoteTemplate(targetDir)
  } catch (error) {
    throw new Error(
      `Failed to download template from ${TEMPLATE_REPO}. ` +
        `Set RK_KIT_TEMPLATE_REPO to a valid GitHub repository or run the installer from inside the RK Kit monorepo.\n` +
        `Original error: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function waitForPostgres(config: ProjectConfig, targetDir: string): Promise<void> {
  const healthCommand = `docker compose exec -T postgres pg_isready -U ${config.postgresUser} -d ${config.databaseName}`

  for (let attempt = 1; attempt <= 30; attempt++) {
    try {
      execSync(healthCommand, { cwd: targetDir, stdio: 'ignore' })
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  throw new Error('PostgreSQL did not become healthy in time.')
}

async function runPostInstall(config: ProjectConfig, targetDir: string): Promise<void> {
  logStep('Installing dependencies...')
  runCommand('pnpm install', targetDir)

  logStep('Building shared packages...')
  runCommand('pnpm turbo run build --filter=!@rk-kit/web', targetDir)

  logStep('Starting PostgreSQL...')
  runCommand('docker compose up -d', targetDir)

  logStep('Waiting for PostgreSQL to be healthy...')
  await waitForPostgres(config, targetDir)

  logStep('Applying database migrations...')
  runCommand('pnpm --filter @rk-kit/db db:migrate', targetDir)
}

async function main(): Promise<void> {
  console.log(color.cyan('create-rk-kit'))
  console.log()

  const options = parseArguments()
  const config = await promptProjectConfig(options.projectName)

  logStep('Scaffolding project...')
  await installTemplate(options.targetDir)
  writeEnvFile(options.targetDir, config)

  const shouldStart = await promptConfirm('Install dependencies, start PostgreSQL, and run migrations now?', true)

  if (shouldStart) {
    await runPostInstall(config, options.targetDir)
  }

  console.log()
  console.log(color.green('Project ready:'), options.targetDir)
  console.log()
  console.log('Next steps:')
  console.log(`  cd ${options.projectName}`)
  console.log('  pnpm dev')
  console.log()
}

main().catch((error: unknown) => {
  console.error(color.red(error instanceof Error ? error.message : String(error)))
  process.exit(1)
})
