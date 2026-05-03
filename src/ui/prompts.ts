import { cancel, confirm, intro, isCancel, multiselect, note, outro, select, spinner, text } from '@clack/prompts';
import { collectInventory } from '../core/inventory.js';
import { layerSchema, ownershipSchema, type Layer, type Ownership, type RiceState } from '../core/schema.js';
import { ensureStateDir, writeInventory, writeState } from '../core/state.js';
import { homePath } from '../util/paths.js';
import { printInventorySummary } from './output.js';

function abortIfCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel('No changes made.');
    process.exit(0);
  }
  return value as T;
}

export async function runInitFlow(): Promise<void> {
  intro('rice init');

  const s = spinner();
  s.start('Taking inventory');
  const inventory = await collectInventory();
  const stateDir = await ensureStateDir();
  const inventoryPath = await writeInventory(inventory);
  s.stop('Inventory saved');

  printInventorySummary(inventory);

  const ownership = ownershipSchema.parse(
    abortIfCancel(
      await select<Ownership>({
        message: 'Do you fully own/admin this machine?',
        options: [
          {
            value: 'personal',
            label: 'Personal/admin',
            hint: 'Deeper system integrations are allowed after confirmation.',
          },
          {
            value: 'work-managed',
            label: 'Work-managed',
            hint: 'Prefer reversible user-level changes.',
          },
          {
            value: 'unknown',
            label: 'Not sure',
            hint: 'Use conservative defaults.',
          },
        ],
      }),
    ),
  );

  const dotfilesPath = abortIfCancel(
    await text({
      message: 'Where is your main dotfiles repo?',
      defaultValue: homePath('repos', 'dotfiles'),
      placeholder: homePath('repos', 'dotfiles'),
    }),
  );

  const activeLayers = abortIfCancel(
    await multiselect<Layer>({
      message: 'Which layers should rice track first?',
      required: true,
      initialValues: ['terminal', 'shell', 'editors', 'window-manager'],
      options: layerSchema.options.map((layer) => ({
        value: layer,
        label: layer,
      })),
    }),
  );

  const save = abortIfCancel(
    await confirm({
      message: `Write rice state to ${stateDir}?`,
      initialValue: true,
    }),
  );

  if (!save) {
    note('Inventory was collected, but state was not written.', 'Stopped');
    outro('No changes made.');
    return;
  }

  const now = new Date().toISOString();
  const state: RiceState = {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    ownership,
    stateDir,
    dotfilesPath,
    activeLayers,
    lastInventoryPath: inventoryPath,
  };

  await writeState(state);

  outro('rice is initialized. Next: `rice doctor` and `rice status`.');
}
