---
name: rice
description: Use when the user wants to customize, migrate, reproduce, reset, or version-control their desktop/user environment across Windows, macOS, or Linux, including terminals, shells, prompts, fonts, editors, Vim/modal editing, app launchers, browsers/extensions, window management, status bars, file managers, themes, startup items, package managers, dotfiles, verification, and rollback. Start with inventory, ownership/risk assessment, current web research, source-of-truth configs, and rollback planning before making changes.
---

# rice

Use the local `rice` CLI as the control plane when available.

## Workflow

1. Run `rice doctor` and `rice inventory --json` before recommending changes.
2. Identify whether the machine is personal/admin or work-managed.
3. Detect existing source-of-truth configs. Do not assume one dotfiles monorepo; standalone repos such as `~/.config/nvim` are valid.
4. Browse official/current docs before recommending OS tools, package sources, app launchers, window managers, status bars, browser extensions, or security-sensitive integrations.
5. Prefer plans, snapshots, verification, and reversible scripts over direct ad hoc edits.
6. Ask before admin/sudo, registry edits, startup tasks/services, browser extensions with broad permissions, default app replacement, WM replacement, or uninstalling existing tools.
7. Keep changes tracked in the user's config repos when practical.

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

If `rice` is not installed and the user wants to rice a machine, offer to bootstrap it.

Use:

```sh
rice doctor
rice inventory --json
rice init
rice status
```

Do not duplicate CLI logic in chat when a CLI command can inspect or verify the machine.
