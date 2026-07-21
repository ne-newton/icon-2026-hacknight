# CLAUDE.md: Admin MCP prototype (hack night).

## Context.

This is a live vibe-coding session for a hack night. We're editing this dashboard in real time based on feedback and ideas from people in the room, so favor fast, exploratory changes over polish.

The dashboard is a mockup of MCP scope management for the Canvas MCP server. It lets an institution connect Canvas MCP to an LLM of its choice, then control which tools each role (Admin, Teacher, TA, and Designer) can access, whether a tool requires step-up authentication before it runs, and how many AI credits the organization is using.

## Files.

- `index.html`: entry point. Loads fonts and a CSS reset, then loads `bootstrap.js` as a module. You likely won't need to touch this unless you're adding a font, meta tag, or top-level style.
- `bootstrap.js`: wires up React, InstUI theming, and ReactDOM, then mounts the screen from `admin-mcp-prototype.js`. Vendor dependencies (React, InstUI components, the theme registry) load from the original hosted sandbox (`instructure.github.io/instui-sandbox-ai-platform`) since they're compiled framework code, not something to hand-edit. Leave this file alone unless you're changing the theme (light or dark) or the mount logic itself.
- `admin-mcp-prototype.js`: **the file to edit.** This is the actual screen: roles, tool catalog, connectors, permissions, and credit management. It's compiled JSX output, not hand-written source, so names are single letters, but the structure is stable and documented below.
- `README.md`: setup and run instructions.

## Running it.

ES module imports don't work over `file://`, so serve the folder instead of opening `index.html` directly:

```
cd hack-night
python3 -m http.server 8080
```

Then open `http://localhost:8080`, and reload after each save. There's no hot-reload wired up.

## Editing admin-mcp-prototype.js.

Treat the single-letter variable names as fixed IDs rather than renaming them. Renaming won't break anything technically, but it'll make diffs harder to follow across a fast-moving hack night. Here's what each piece maps to.

### Data, near the top of the file.

| Variable | What it is |
|---|---|
| `b` | Canvas tools catalog: an array of `{label, tools}` groups (Courses, Assignments, Modules, Pages, Discussions, Announcements, Conversations, Users & Enrollments, and Outcomes). Each tool is `{name, description, type, critical, enabled}`. |
| `x` | Kyron connector's tools (lesson library). |
| `S` | WooClap connector's tools. |
| `C` | Third-party connectors list: `[{label, icon, tools}]` for Kyron and WooClap. |
| `w` | Credit usage: `{used, total}`. |
| `de` | Leaderboard rows: `{name, initials, credits, pct}`. |
| `fe` | Credit cost reference table: `{task, credits}`. |
| `E` | Role list: `Admin`, `Teacher`, `TA`, `Designer`. |

To add a Canvas tool, add an entry to the right group's `tools` array in `b`, matching the existing `{name, description, type, critical, enabled}` shape. `type` is one of `Read`, `Write`, or `Destructive`; it drives the colored badge and which permission options show up. `critical` locks the enabled toggle on, so it can't be switched off in the UI.

To add a connector, add a tools array (like `x` or `S`) and register it in `C` with a `label` and an InstUI icon.

To add a role, add the name to `E`. New roles default to syncing with Admin's settings, matching the existing Teacher, TA, and Designer behavior.

### Tool permission model.

Each tool has two independent controls, and both are central to the MCP scope story:

1. **Enabled** (`I`/`L` state, keyed by tool name) is a plain on/off switch. `critical` tools can't be switched off.
2. **Permission** (`R`/`z` state, keyed by tool name) governs step-up authentication.
   - `Read` tools choose between `allow` (Always allow) and `ask` (Always ask).
   - `Write` and `Destructive` tools choose between `ask` (Always ask) and `reauth` (Require re-auth, meaning step-up authentication before the LLM can call the tool).
   - `J` turns these values into their display labels. `pe` maps a tool's `type` to its badge color (`Read` is success, `Write` is warning, `Destructive` is error).

### Component state, inside function D.

| Variable | What it holds |
|---|---|
| `_` / `ue` | Selected tab index (0 is Credit management, 1 is Tools & connectors). |
| `D` (inner) / `O` | Selected role. |
| `k` / `A` | Per-role sync config: whether each non-Admin role mirrors a source role's settings. |
| `j` / `M` | Which connectors (Kyron, WooClap) are enabled. |
| `N` / `P` | Which tool categories (Courses, Assignments, and so on) are enabled. |
| `I` / `L` | Per-tool enabled state. |
| `R` / `z` | Per-tool permission state. |
| `H` / `U` | The last-saved snapshot, used by Revert and to compute the unsaved-changes diff. |
| `W` / `G` | Whether the "Changes saved" toast is showing. |
| `K` / `q` | A pending role switch, held while an unsaved-changes confirmation dialog is open. |

`Y`, `X`, `Z`, `Q`, `me`, and `$` are all derived diff calculations (what changed since the last save, used for the sync banner and the unsaved-changes dialog). You generally won't need to touch these unless you're changing what counts as a change.

`ge(tools, disabled)` renders the Tool, Type, Permission, and Enabled table used by both the Canvas tools and connector sections. `pe(type)` maps a tool's type to its badge color.

## Ground rules for hack night edits.

- Keep the default export (`export{D as default}`) intact, so `bootstrap.js` can still mount the screen.
- Don't rename or remove the imports at the top of the file. If a change needs an InstUI component that isn't already imported, check whether it's already available under another letter before pulling in a new one from the remote asset bundle.
- Reload after every save.
