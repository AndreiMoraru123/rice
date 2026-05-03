import { existsSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { commandAvailable, commandVersion, shellOutput } from '../util/exec.js';
import { homePath } from '../util/paths.js';
import type { GitRepo, Inventory, OsKind, Tool } from './schema.js';

function detectOsKind(): OsKind {
  if (process.platform === 'win32') return 'windows';
  if (process.platform === 'darwin') return 'macos';
  if (process.platform === 'linux') return 'linux';
  return 'unknown';
}

function detectWsl(): { isWsl: boolean; distro?: string; hostOs?: OsKind } {
  if (process.platform !== 'linux') {
    return { isWsl: false };
  }

  const procVersion = existsSync('/proc/version')
    ? readFileSync('/proc/version', 'utf8').toLowerCase()
    : '';
  const isWsl = procVersion.includes('microsoft') || Boolean(process.env.WSL_DISTRO_NAME);

  return {
    isWsl,
    distro: process.env.WSL_DISTRO_NAME,
    hostOs: isWsl ? 'windows' : undefined,
  };
}

async function tool(command: string, args: string[] = ['--version'], name = command): Promise<Tool> {
  const available = await commandAvailable(command);
  return {
    name,
    available,
    version: available ? await commandVersion(command, args) : undefined,
  };
}

async function pacmanTool(): Promise<Tool> {
  const available = await commandAvailable('pacman');
  if (!available) {
    return { name: 'pacman', available: false };
  }

  const versionOutput = await commandVersion('pacman');
  const version = versionOutput?.match(/Pacman v[^\s]+/)?.[0] ?? versionOutput;

  return { name: 'pacman', available: true, version };
}

function sanitizeGitRemote(remote: string | undefined): string | undefined {
  if (!remote) return undefined;

  try {
    const url = new URL(remote);
    url.username = '';
    url.password = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return remote.replace(/(https?:\/\/)[^/@\s]+@/i, '$1');
  }
}

async function gitRepo(name: string, repoPath: string): Promise<GitRepo | undefined> {
  if (!existsSync(path.join(repoPath, '.git'))) {
    return undefined;
  }

  const branch = await shellOutput(`git -C "${repoPath}" branch --show-current`);
  const remote = await shellOutput(`git -C "${repoPath}" remote get-url origin`);
  const dirtyOutput = await shellOutput(`git -C "${repoPath}" status --short`);

  return {
    name,
    path: repoPath,
    branch,
    remote: sanitizeGitRemote(remote),
    dirty: Boolean(dirtyOutput),
  };
}

function compactTools(tools: Tool[]): Tool[] {
  const byName = new Map<string, Tool>();

  for (const tool of tools) {
    const existing = byName.get(tool.name);
    if (!existing) {
      byName.set(tool.name, tool);
      continue;
    }

    if (!existing.available && tool.available) {
      byName.set(tool.name, tool);
    }
  }

  return [...byName.values()];
}

async function detectRepos(): Promise<GitRepo[]> {
  const candidates: Array<[string, string]> = [
    ['dotfiles', homePath('repos', 'dotfiles')],
    ['nvim', homePath('.config', 'nvim')],
    ['zsh', homePath('.config', 'zsh')],
  ];

  const repos = await Promise.all(candidates.map(([name, repoPath]) => gitRepo(name, repoPath)));
  return repos.filter((repo): repo is GitRepo => Boolean(repo));
}

async function detectWindowsHostTools(isWsl: boolean): Promise<{
  packageManagers: Tool[];
  terminals: Tool[];
  editors: Tool[];
  windowManagers: Tool[];
  appLaunchers: Tool[];
  browsers: Tool[];
}> {
  if (!isWsl && process.platform !== 'win32') {
    return { packageManagers: [], terminals: [], editors: [], windowManagers: [], appLaunchers: [], browsers: [] };
  }

  const powershell = process.platform === 'win32' ? 'powershell.exe' : 'powershell.exe';
  const canPowerShell = await commandAvailable(powershell);
  if (!canPowerShell) {
    return { packageManagers: [], terminals: [], editors: [], windowManagers: [], appLaunchers: [], browsers: [] };
  }

  const wingetVersion = await commandVersion('winget.exe', ['--version']);
  const windowsTerminal = await shellOutput(
    'powershell.exe -NoProfile -Command "if (Get-AppxPackage -Name Microsoft.WindowsTerminal -ErrorAction SilentlyContinue) { \'true\' } else { \'false\' }"',
  );
  const vscode = await shellOutput(
    'powershell.exe -NoProfile -Command "Test-Path \'C:\\Users\\Andrei\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe\'"',
  );
  const glazewmPath = await shellOutput(
    'powershell.exe -NoProfile -Command "Test-Path \'C:\\Program Files\\glzr.io\\GlazeWM\\cli\\glazewm.exe\'"',
  );
  const chromeStable = await shellOutput(
    'powershell.exe -NoProfile -Command "Test-Path \'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\'"',
  );
  const chromeCanary = await shellOutput(
    'powershell.exe -NoProfile -Command "Test-Path \'C:\\Users\\Andrei\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe\'"',
  );
  const edge = await shellOutput(
    'powershell.exe -NoProfile -Command "Test-Path \'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe\'"',
  );

  return {
    packageManagers: [
      {
        name: 'winget',
        available: Boolean(wingetVersion),
        version: wingetVersion,
        source: 'windows-host',
      },
    ],
    terminals: [
      {
        name: 'windows-terminal',
        available: windowsTerminal?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
    ],
    editors: [
      {
        name: 'vscode',
        available: vscode?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
    ],
    windowManagers: [
      {
        name: 'glazewm',
        available: glazewmPath?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
    ],
    appLaunchers: [
      {
        name: 'powertoys-run',
        available: Boolean(await shellOutput('powershell.exe -NoProfile -Command "Get-Process PowerToys -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty ProcessName"')),
        source: 'windows-host',
      },
    ],
    browsers: [
      {
        name: 'chrome',
        available: chromeStable?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
      {
        name: 'chrome-canary',
        available: chromeCanary?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
      {
        name: 'edge',
        available: edge?.trim().toLowerCase() === 'true',
        source: 'windows-host',
      },
    ],
  };
}

export async function collectInventory(): Promise<Inventory> {
  const wsl = detectWsl();
  const windowsHostTools = await detectWindowsHostTools(wsl.isWsl);

  const packageManagers = [
    await tool('npm'),
    await tool('git'),
    await tool('brew'),
    await tool('apt'),
    await pacmanTool(),
    await tool('dnf'),
    await tool('scoop.ps1', ['--version'], 'scoop'),
    ...windowsHostTools.packageManagers,
  ];

  const shells = [
    await tool('zsh'),
    await tool('fish'),
    await tool('bash'),
    await tool('pwsh'),
    await tool('powershell.exe', ['-NoProfile', '-Command', '$PSVersionTable.PSVersion.ToString()'], 'powershell'),
  ];

  const editors = [
    await tool('nvim', ['--version']),
    await tool('vim', ['--version']),
    await tool('code', ['--version'], 'vscode'),
    await tool('zed', ['--version']),
    ...windowsHostTools.editors,
  ];

  const browsers = [
    await tool('google-chrome', ['--version'], 'chrome'),
    await tool('chrome', ['--version'], 'chrome'),
    await tool('firefox', ['--version']),
    await tool('brave-browser', ['--version'], 'brave'),
    await tool('msedge', ['--version'], 'edge'),
    ...windowsHostTools.browsers,
  ];

  const terminals: Tool[] = [
    {
      name: 'windows-terminal',
      available: Boolean(process.env.WT_SESSION),
      source: process.env.WT_SESSION ? 'environment' : undefined,
    },
    await tool('ghostty', ['--version']),
    await tool('wezterm', ['--version']),
    await tool('alacritty', ['--version']),
    ...windowsHostTools.terminals,
  ];

  return {
    schemaVersion: 1,
    collectedAt: new Date().toISOString(),
    machine: {
      hostname: os.hostname(),
      platform: process.platform,
      arch: process.arch,
      release: os.release(),
      os: detectOsKind(),
      hostOs: wsl.hostOs,
      isWsl: wsl.isWsl,
      wslDistro: wsl.distro,
    },
    environment: {
      shell: process.env.SHELL ?? process.env.ComSpec,
      term: process.env.TERM,
      termProgram: process.env.TERM_PROGRAM,
      editor: process.env.EDITOR,
    },
    tools: {
      packageManagers: compactTools(packageManagers),
      shells,
      terminals: compactTools(terminals),
      editors: compactTools(editors),
      windowManagers: [...windowsHostTools.windowManagers],
      appLaunchers: [...windowsHostTools.appLaunchers],
      browsers: compactTools(browsers),
    },
    repos: await detectRepos(),
  };
}
