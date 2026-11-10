# Restore Legacy Sessions Plugin

RobinRun official plugin for restoring old ACP-era RobinRun session snapshots into the new task index and CLI session DB.

This plugin is bundled as `restore-legacy-sessions@robinrun-plugins-official` and is disabled by default. Enable it only when you need to inspect or restore old session data.

## Enable

```sh
robinrun plugins enable restore-legacy-sessions
```

Or inside a RobinRun session:

```text
/plugins enable restore-legacy-sessions
```

Changes apply to new sessions. After enabling, use:

```text
/restore-legacy-sessions
```

## Data Boundaries

- Default source: `~/.robinrun/v2/sessions`
- Task index destination: `~/.robinrun/v2/tasks-index.sqlite`
- CLI session DB destination: `~/.robinrun/cli/db/db.sqlite`

The restore scripts create timestamped DB backups before writing. Restored ACP-era conversations are persisted as normal `glm` RobinRun Agent history and do not write `migration_source`.

## Development

This is a skill-only / command-only plugin. It has no MCP server and no build step.
