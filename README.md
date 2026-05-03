# rice

`rice` is a CLI for making OS customization trackable, reversible, and agent-friendly.

Agents can make judgment calls. `rice` gives them inventory, state, verification, and eventually rollback machinery.

## What This Is

`rice` is two things:

- a CLI humans and agents can run
- an agent skill that teaches agents how to use the CLI and respect inventory, state, verification, and rollback

The CLI is the harness. The agent skill is the workflow.

## Install The CLI

One-off from GitHub:

```sh
npx github:AndreiMoraru123/rice doctor
```

Local install:

```sh
git clone https://github.com/AndreiMoraru123/rice.git
cd rice
npm install
npm run build
npm link
```

Then run:

```sh
rice doctor
```

Without `npm link`, use:

```sh
node dist/cli.js doctor
```

## Install The Agent Skill

```sh
npx skills add AndreiMoraru123/rice --skill rice
```

The skill lives at:

```text
skills/rice/SKILL.md
```

## Commands

```sh
rice doctor
rice inventory
rice inventory --json
rice inventory --save
rice init
rice status
```

- `doctor`: check whether the machine is ready to be managed by `rice`
- `inventory`: detect OS, WSL, package managers, shells, terminals, editors, browsers, window managers, launchers, and config repos
- `init`: create initial local `rice` state interactively
- `status`: show saved local `rice` state

## State

`rice` stores machine-local state outside the repo:

```text
Linux:   ~/.local/state/rice
macOS:   ~/Library/Application Support/rice
Windows: %LOCALAPPDATA%\rice
```

Your actual configs should still live in dotfiles or standalone config repos.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md).

## Acknowledgements

Built with TypeScript, Commander, Zod, YAML, Execa, and [`@clack/prompts`](https://bomb.sh/docs/clack/packages/prompts/).
