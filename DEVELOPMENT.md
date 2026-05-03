# Development

Useful commands:

```sh
npm run dev -- doctor
npm run dev -- inventory --json
npm run typecheck
npm run build
```

Bun can be used as a faster local package manager/script runner if installed:

```sh
bun install
bun run dev -- doctor
bun run typecheck
bun run build
```

Node/npm remain the canonical install path because the agent skills installer uses `npx`, and the packaged CLI is a Node bin.

Project layout:

```text
src/core     non-interactive inventory, state, schemas
src/ui       terminal UX and prompts
src/util     small helpers
skills/rice  agent-facing skill instructions
```

`src/core` should stay non-interactive so agents and scripts can reuse it.

`src/ui` owns terminal presentation and interactive flows.

The interactive prompts use [`@clack/prompts`](https://bomb.sh/docs/clack/packages/prompts/), which gives the CLI a guided installer-style feel without needing a full React terminal UI.
