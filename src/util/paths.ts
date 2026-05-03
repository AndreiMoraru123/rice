import os from 'node:os';
import path from 'node:path';

export function homePath(...parts: string[]): string {
  return path.join(os.homedir(), ...parts);
}

export function defaultStateDir(): string {
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA ?? homePath('AppData', 'Local'), 'rice');
  }

  if (process.platform === 'darwin') {
    return homePath('Library', 'Application Support', 'rice');
  }

  return path.join(process.env.XDG_STATE_HOME ?? homePath('.local', 'state'), 'rice');
}
