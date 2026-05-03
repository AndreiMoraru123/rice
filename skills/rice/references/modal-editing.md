# Modal Editing

Treat Vim mode as a preference layer, not only as a Neovim config.

Ask whether the user wants:

- editors only
- editors plus terminal shells
- everywhere possible

Common targets:

- Neovim: config repo, providers, health checks
- VS Code: VSCodeVim or VSCode Neovim, not both unless intentional
- Zed: native Vim mode and keymap/settings
- JetBrains: IdeaVim and `.ideavimrc`
- Shells: zsh `bindkey -v`, fish vi bindings, bash/readline, PowerShell PSReadLine Vi mode
- Browsers: Vimium, Vimium C, Surfingkeys, Tridactyl
- Notes/knowledge apps: native Vim mode where available

Browser Vim extensions may request access to all sites. Explain that permission and ask before installing or enabling.

Prefer native Vim mode when it is high quality. Avoid installing competing Vim plugins in the same app.
