# Layers

Use layers to stay tool-agnostic. Start from the layer and user preference, not from a favorite app.

For each layer ask:

- What exists now?
- What does the user want?
- Is this personal/admin or work-managed?
- What should be tracked?
- What must be installed outside dotfiles?
- How is it deployed?
- How is it verified?
- How is it undone?

Core layers:

- package manager
- terminal
- shell
- prompt
- fonts
- editors/IDEs
- modal editing
- window management
- status/menu/panel bars
- app launchers
- app hotkeys/workspaces
- browser/default apps/extensions
- file manager
- theme/colors/icons/wallpaper
- startup/session services
- backup/rollback/reset

Dotfiles monorepos and standalone config repos are both valid. A config is managed if it is versioned and reproducible.
