---
name: rice
description: Use when the user wants to customize, migrate, reproduce, reset, or version-control their desktop/user environment across Windows, macOS, or Linux, including terminals, shells, prompts, fonts, editors, Vim/modal editing, app launchers, browsers/extensions, window management, status bars, file managers, themes, startup items, package managers, dotfiles, verification, and rollback. Start with inventory, ownership/risk assessment, current web research, source-of-truth configs, and rollback planning before making changes.
---

# rice

Use the local `rice` CLI as the control plane. If it is missing, help the user install it before doing machine customization work.

## Workflow

1. Check whether `rice` is available by running `rice doctor`.
2. If `rice` is missing, follow the CLI bootstrap protocol below.
3. Run `rice doctor` and `rice inventory --json` before recommending changes.
4. Identify whether the machine is personal/admin or work-managed.
5. Detect existing source-of-truth configs. Do not assume one dotfiles monorepo; standalone repos such as `~/.config/nvim` are valid.
6. Browse official/current docs before recommending OS tools, package sources, app launchers, window managers, status bars, browser extensions, or security-sensitive integrations.
7. Prefer plans, snapshots, verification, and reversible scripts over direct ad hoc edits.
8. Ask before admin/sudo, registry edits, startup tasks/services, browser extensions with broad permissions, default app replacement, WM replacement, or uninstalling existing tools.
9. Keep changes tracked in the user's config repos when practical.

## CLI Bootstrap

The skill and CLI are separate. Installing the skill does not install the `rice` command.

If `rice` is unavailable:

1. Check for Node.js and npm:

   ```sh
   node --version
   npm --version
   ```

2. `rice` requires Node.js `>=20.12`. If Node/npm are missing or too old, ask before installing. Prefer the user's OS package manager or official Node.js instructions after checking current docs.

3. For one-off use, run:

   ```sh
   npx github:AndreiMoraru123/rice doctor
   ```

4. For persistent use, run:

   ```sh
   npm install -g github:AndreiMoraru123/rice
   rice doctor
   ```

## Default Layers

- package manager
- terminal
- shell and prompt
- fonts
- editors and IDEs
- modal editing / Vim mode
- window management
- status/menu/panel bars
- app launchers
- browser and extensions
- file manager
- theme/colors/icons/wallpaper
- startup/session services
- backup/rollback/reset

## References

- Read `references/layers.md` when deciding what to inventory or customize.
- Read `references/rollback.md` before risky changes or when the user asks to switch/reset.
- Read `references/modal-editing.md` when enabling Vim mode across tools.
- Read `references/links.md` before researching current tools; verify official docs on the web before recommending or installing.

## CLI First

Use:

```sh
rice doctor
rice inventory --json
rice init
rice status
```

Do not duplicate CLI logic in chat when a CLI command can inspect or verify the machine.
