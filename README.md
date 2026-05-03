# rice

`rice` is a tiny CLI for making OS customization trackable, reversible, and agent-friendly.

The idea is simple:

- the agent brings judgment, research, and taste
- `rice` records inventory, state, plans, verification, and rollback data

This is early v0 work. Right now it inventories the machine and creates initial local state.

## Install

You need Node.js and npm.

```sh
git clone https://github.com/AndreiMoraru123/rice.git
cd rice
npm install
npm run build
```

## Use

During development, run commands with:

```sh
npm run dev -- doctor
npm run dev -- inventory
npm run dev -- inventory --json
npm run dev -- init
npm run dev -- status
```

After building, you can run the compiled CLI directly:

```sh
node dist/cli.js doctor
node dist/cli.js inventory --json
node dist/cli.js init
node dist/cli.js status
```

## What Commands Do

`rice doctor`

Checks whether the machine is ready to be managed by `rice`. It detects the OS, package managers, config repos, and other useful tools.

`rice inventory`

Collects machine facts: OS, WSL, package managers, shells, terminals, editors, browsers, window managers, app launchers, and known config repos.

`rice init`

Starts an interactive setup flow. It asks whether the machine is personal or work-managed, where dotfiles live, and which layers should be tracked first.

`rice status`

Shows the saved local `rice` state.

## State Location

`rice` stores local state outside the repo:

```text
Linux:   ~/.local/state/rice
macOS:   ~/Library/Application Support/rice
Windows: %LOCALAPPDATA%\rice
```

This state is machine-specific. Your actual configs should still live in dotfiles or standalone config repos.

## What It Detects Today

The current inventory pass can detect things like:

- Windows, macOS, Linux, and WSL
- npm, git, pacman, apt, brew, winget
- zsh, fish, bash, PowerShell
- Neovim, Vim, VS Code, Zed
- Windows Terminal
- GlazeWM on a Windows host
- Chrome, Chrome Canary, Edge, Firefox, Brave
- dotfiles repo at `~/repos/dotfiles`
- standalone Neovim repo at `~/.config/nvim`

## Development

Useful commands:

```sh
npm run typecheck
npm run build
npm run dev -- doctor
```

Project layout:

```text
src/core     non-interactive inventory, state, schemas
src/ui       terminal UX and prompts
src/util     small helpers
skills/rice  agent-facing skill instructions
```

## Why TypeScript?

`rice` is meant to be easy to inspect and hack on. TypeScript gives us good editor support, schemas, and a strong CLI ecosystem.

The interactive prompts use [`@clack/prompts`](https://bomb.sh/docs/clack/packages/prompts/), which gives the CLI a guided installer-style feel without needing a full React terminal UI.
