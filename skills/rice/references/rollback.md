# Rollback

Rollback is a first-class requirement.

Terms:

- Snapshot: capture before-state for paths, registry keys, services, startup tasks, package lists, and active config choices.
- Switch: deactivate one layer choice and activate another without uninstalling everything.
- Rollback: undo the last applied plan.
- Reset: return all rice-managed layers to the captured baseline or closest OS default.

Before risky changes:

- Save inventory.
- Capture a snapshot.
- Record exact actions and inverse actions.
- Prefer user-level changes on work-managed machines.

Ask before:

- admin/sudo elevation
- registry edits
- startup services/tasks
- launch agents/daemons
- browser extensions with broad permissions
- replacing default browser/file manager/shell
- uninstalling existing tools
- disabling macOS security features such as SIP

Switching should usually leave the old tool installed but inactive. This makes experimentation cheap and rollback safer.
