# Admin MCP prototype — hack night copy

Local, editable copy of the admin governance mockup:
`instructure.github.io/instui-sandbox-ai-platform/static/4c047732/admin-mcp-prototype-v2/`

## What's here

- `index.html` — entry point.
- `bootstrap.js` — mounts the screen. Not meant to be edited.
- `admin-mcp-prototype.js` — the actual screen: roles, tool catalog, permissions, credit management. **This is the file to edit.** It's a byte-for-byte copy of the original screen's source, verified against the live site.

## What's local vs. remote

The screen's own code (`admin-mcp-prototype.js`) is fully local, so edits take effect immediately on reload. Shared framework dependencies (React, InstUI components, theming) still load from the original hosted URL, since they're compiled vendor code, not something you'd hand-edit at a hack night. This means you'll need internet access to run it, but zero setup beyond a static file server.

## Running it

Browsers block ES module imports over `file://`, so serve the folder instead of double-clicking `index.html`:

```
cd hack-night
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Editing

Open `admin-mcp-prototype.js` in your editor of choice (or point Claude Code at this folder). It's minified/compiled JSX-transpiled output rather than hand-written source, so variable names are single letters, but the structure maps directly to what's on screen — e.g. `b` is the Canvas tools catalog array (Courses, Assignments, Modules...), `de` is the leaderboard data, `E` is the roles list (`Admin`, `Teacher`, `TA`, `Designer`). Reload the page after saving to see changes.
