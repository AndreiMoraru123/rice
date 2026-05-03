import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { defaultStateDir } from '../util/paths.js';
import { inventorySchema, riceStateSchema, type Inventory, type RiceState } from './schema.js';

export function stateDir(): string {
  return defaultStateDir();
}

export function stateFilePath(): string {
  return path.join(stateDir(), 'state.yaml');
}

export function inventoryFilePath(): string {
  return path.join(stateDir(), 'inventory.yaml');
}

export async function ensureStateDir(): Promise<string> {
  const dir = stateDir();
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(dir, 'history'), { recursive: true });
  await mkdir(path.join(dir, 'snapshots'), { recursive: true });
  await mkdir(path.join(dir, 'logs'), { recursive: true });
  return dir;
}

export async function writeInventory(inventory: Inventory): Promise<string> {
  await ensureStateDir();
  const file = inventoryFilePath();
  await writeFile(file, YAML.stringify(inventory), 'utf8');
  return file;
}

export async function readInventory(): Promise<Inventory | undefined> {
  try {
    const raw = await readFile(inventoryFilePath(), 'utf8');
    return inventorySchema.parse(YAML.parse(raw));
  } catch {
    return undefined;
  }
}

export async function writeState(state: RiceState): Promise<string> {
  await ensureStateDir();
  const file = stateFilePath();
  await writeFile(file, YAML.stringify(state), 'utf8');
  return file;
}

export async function readState(): Promise<RiceState | undefined> {
  try {
    const raw = await readFile(stateFilePath(), 'utf8');
    return riceStateSchema.parse(YAML.parse(raw));
  } catch {
    return undefined;
  }
}
