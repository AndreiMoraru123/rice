# Agent Notes

- Prefer `npm run typecheck` and `npm run build` before finishing code changes.
- Use `npm run dev -- <command>` while iterating on CLI behavior.
- Keep `src/core` non-interactive so agents and scripts can reuse it.
- Put terminal UX in `src/ui` or command handlers, not in detection modules.
- Treat `skills/rice/SKILL.md` as the agent-facing workflow and keep it concise.
