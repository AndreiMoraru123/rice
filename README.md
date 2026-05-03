# rice

`rice` is a local control plane for reversible OS customization.

The agent makes judgment calls; the CLI records state, inventories the machine, and gives changes a place to become inspectable.

## v0 commands

```sh
npm run dev -- doctor
npm run dev -- inventory --json
npm run dev -- init
npm run dev -- status
```

## Design

- Inventory first.
- Dotfiles and standalone config repos are both valid.
- Changes should be planned, verified, and rollback-aware.
- Interactive flows use `@clack/prompts`; core detection remains scriptable.
