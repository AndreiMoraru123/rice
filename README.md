# Rice ✨

`rice` is a CLI for making OS customization trackable, reversible, and agent-friendly.

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/b0fbc8e5-fa9a-4784-828c-0733078889b5" />

Agents can make judgment calls. `rice` gives them inventory, state, verification, and eventually rollback machinery.

## What This Is

`rice` is two things:

- a CLI humans and agents can run
- an agent skill that teaches agents how to use the CLI and respect inventory, state, verification, and rollback

The CLI is the harness. The agent skill is the workflow.

## Install The CLI

Requires Node.js `>=20.12` and npm.

One-off from GitHub:

```sh
npx github:AndreiMoraru123/rice doctor
```

Install as a command:

```sh
npm install -g github:AndreiMoraru123/rice
rice doctor
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
npx skills add AndreiMoraru123/rice
```

This installs the agent instructions, not the CLI command. The skill will ask the agent to check/install the CLI when it needs to inspect a machine.

The skill lives at:

```text
skills/rice/SKILL.md
```

Use `--skill rice` if this repo ever contains multiple skills and you only want this one.

## Commands

```sh
rice doctor          # check whether this machine is ready to be managed
rice inventory       # detect OS, tools, apps, and config repos
rice inventory --json
rice inventory --save
rice init            # create initial local rice state interactively
rice status          # show saved local rice state
```

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
