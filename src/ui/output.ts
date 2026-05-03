import { log, note } from '@clack/prompts';
import pc from 'picocolors';
import type { DoctorCheck, Inventory, RiceState } from '../core/schema.js';

function statusIcon(status: DoctorCheck['status']): string {
  if (status === 'ok') return pc.green('✓');
  if (status === 'warn') return pc.yellow('!');
  return pc.red('✗');
}

export function printInventorySummary(inventory: Inventory): void {
  const lines = [
    `OS: ${inventory.machine.os}${inventory.machine.isWsl ? ` in WSL (${inventory.machine.wslDistro ?? 'unknown distro'})` : ''}`,
    `Host: ${inventory.machine.hostname}`,
    `Shell: ${inventory.environment.shell ?? 'unknown'}`,
    `Repos: ${inventory.repos.length > 0 ? inventory.repos.map((repo) => repo.name).join(', ') : 'none detected'}`,
  ];

  note(lines.join('\n'), 'Inventory');
}

export function printDoctorChecks(checks: DoctorCheck[]): void {
  for (const check of checks) {
    const message = `${statusIcon(check.status)} ${check.name}${check.detail ? `\n${pc.dim(check.detail)}` : ''}`;
    if (check.status === 'ok') log.success(message);
    else if (check.status === 'warn') log.warn(message);
    else log.error(message);
  }
}

export function printStatus(state: RiceState | undefined, inventory: Inventory | undefined): void {
  if (!state) {
    log.warn('rice has not been initialized yet. Run `rice init`.');
    return;
  }

  note(
    [
      `Ownership: ${state.ownership}`,
      `State dir: ${state.stateDir}`,
      `Dotfiles: ${state.dotfilesPath ?? 'not set'}`,
      `Active layers: ${state.activeLayers.length > 0 ? state.activeLayers.join(', ') : 'none selected'}`,
      `Last inventory: ${state.lastInventoryPath ?? 'not saved'}`,
      `Detected repos: ${inventory?.repos.map((repo) => repo.name).join(', ') ?? 'unknown'}`,
    ].join('\n'),
    'rice status',
  );
}
