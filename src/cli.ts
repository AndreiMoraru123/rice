import { intro, outro } from '@clack/prompts';
import { Command } from 'commander';
import { collectInventory } from './core/inventory.js';
import { doctorChecks } from './core/doctor.js';
import { readInventory, readState, writeInventory } from './core/state.js';
import { printDoctorChecks, printInventorySummary, printStatus } from './ui/output.js';
import { runInitFlow } from './ui/prompts.js';

const program = new Command();

program
  .name('rice')
  .description('A local control plane for reversible OS ricing.')
  .version('0.1.0');

program
  .command('doctor')
  .description('Inspect rice readiness and machine customization health.')
  .option('--json', 'Print JSON instead of human output.')
  .action(async (options: { json?: boolean }) => {
    const inventory = await collectInventory();
    const checks = doctorChecks(inventory);

    if (options.json) {
      console.log(JSON.stringify({ inventory, checks }, null, 2));
      return;
    }

    intro('rice doctor');
    printInventorySummary(inventory);
    printDoctorChecks(checks);
    outro(checks.some((check) => check.status === 'error') ? 'Some checks need attention.' : 'Ready to rice ✨');
  });

program
  .command('inventory')
  .description('Collect machine, tool, and config-repo inventory.')
  .option('--json', 'Print JSON.')
  .option('--save', 'Save inventory to the rice state directory.')
  .action(async (options: { json?: boolean; save?: boolean }) => {
    const inventory = await collectInventory();

    if (options.save) {
      const file = await writeInventory(inventory);
      if (!options.json) {
        console.log(`Saved inventory to ${file}`);
      }
    }

    if (options.json) {
      console.log(JSON.stringify(inventory, null, 2));
      return;
    }

    intro('rice inventory');
    printInventorySummary(inventory);
    outro('Inventory complete.');
  });

program
  .command('init')
  .description('Run the interactive rice setup flow.')
  .action(async () => {
    await runInitFlow();
  });

program
  .command('status')
  .description('Show current rice state.')
  .action(async () => {
    const [state, inventory] = await Promise.all([readState(), readInventory()]);
    intro('rice status');
    printStatus(state, inventory);
    outro(state ? 'State loaded.' : 'Run `rice init` to create state.');
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
