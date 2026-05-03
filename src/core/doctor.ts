import { stateDir } from './state.js';
import type { DoctorCheck, Inventory } from './schema.js';

function hasAvailable(tools: { available: boolean }[]): boolean {
  return tools.some((tool) => tool.available);
}

export function doctorChecks(inventory: Inventory): DoctorCheck[] {
  const availablePackageManagers = inventory.tools.packageManagers.filter(
    (tool) => tool.name !== 'git' && tool.available,
  );

  const checks: DoctorCheck[] = [
    {
      name: 'OS detected',
      status: inventory.machine.os === 'unknown' ? 'warn' : 'ok',
      detail: inventory.machine.isWsl
        ? `${inventory.machine.os} inside WSL on ${inventory.machine.hostOs}`
        : inventory.machine.os,
    },
    {
      name: 'State directory',
      status: 'ok',
      detail: stateDir(),
    },
    {
      name: 'Git available',
      status: inventory.tools.packageManagers.some((tool) => tool.name === 'git' && tool.available)
        ? 'ok'
        : 'error',
      detail: 'Needed to detect and manage config repos.',
    },
    {
      name: 'Package manager available',
      status: hasAvailable(availablePackageManagers)
        ? 'ok'
        : 'warn',
      detail:
        availablePackageManagers.length > 0
          ? availablePackageManagers
              .map((tool) => `${tool.name}${tool.version ? `: ${tool.version}` : ''}`)
              .join('\n')
          : 'No package manager detected besides git.',
    },
    {
      name: 'Config repos detected',
      status: inventory.repos.length > 0 ? 'ok' : 'warn',
      detail:
        inventory.repos.length > 0
          ? inventory.repos.map((repo) => `${repo.name}: ${repo.path}`).join('\n')
          : 'No dotfiles/editor repos found in common paths yet.',
    },
  ];

  return checks;
}
