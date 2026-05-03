import { z } from 'zod';

export const osKindSchema = z.enum(['windows', 'macos', 'linux', 'unknown']);
export type OsKind = z.infer<typeof osKindSchema>;

export const ownershipSchema = z.enum(['personal', 'work-managed', 'unknown']);
export type Ownership = z.infer<typeof ownershipSchema>;

export const layerSchema = z.enum([
  'package-manager',
  'terminal',
  'shell',
  'prompt',
  'fonts',
  'editors',
  'modal-editing',
  'window-manager',
  'status-bar',
  'app-launcher',
  'browser',
  'file-manager',
  'theme',
  'startup',
]);
export type Layer = z.infer<typeof layerSchema>;

export const toolSchema = z.object({
  name: z.string(),
  available: z.boolean(),
  version: z.string().optional(),
  path: z.string().optional(),
  source: z.string().optional(),
});
export type Tool = z.infer<typeof toolSchema>;

export const gitRepoSchema = z.object({
  name: z.string(),
  path: z.string(),
  remote: z.string().optional(),
  branch: z.string().optional(),
  dirty: z.boolean().optional(),
});
export type GitRepo = z.infer<typeof gitRepoSchema>;

export const inventorySchema = z.object({
  schemaVersion: z.literal(1),
  collectedAt: z.string(),
  machine: z.object({
    hostname: z.string(),
    platform: z.string(),
    arch: z.string(),
    release: z.string(),
    os: osKindSchema,
    hostOs: osKindSchema.optional(),
    isWsl: z.boolean(),
    wslDistro: z.string().optional(),
  }),
  environment: z.object({
    shell: z.string().optional(),
    term: z.string().optional(),
    termProgram: z.string().optional(),
    editor: z.string().optional(),
  }),
  tools: z.object({
    packageManagers: z.array(toolSchema),
    shells: z.array(toolSchema),
    terminals: z.array(toolSchema),
    editors: z.array(toolSchema),
    windowManagers: z.array(toolSchema),
    appLaunchers: z.array(toolSchema),
    browsers: z.array(toolSchema),
  }),
  repos: z.array(gitRepoSchema),
});
export type Inventory = z.infer<typeof inventorySchema>;

export const riceStateSchema = z.object({
  schemaVersion: z.literal(1),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownership: ownershipSchema,
  stateDir: z.string(),
  dotfilesPath: z.string().optional(),
  activeLayers: z.array(layerSchema),
  lastInventoryPath: z.string().optional(),
});
export type RiceState = z.infer<typeof riceStateSchema>;

export const doctorCheckSchema = z.object({
  name: z.string(),
  status: z.enum(['ok', 'warn', 'error']),
  detail: z.string().optional(),
});
export type DoctorCheck = z.infer<typeof doctorCheckSchema>;
