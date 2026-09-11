# apercu-studio (Claude Code plugin)

Production skills for **Aperçu Motion** — the semi-automated pipeline for the recurring
animated world. See `docs/` and the concept for the full picture; this plugin holds the
Claude Code skills that read the repo's `content-bible/` and drive the pipeline gates.

## Skills in this version

| Command | Role |
| ------- | ---- |
| `/apercu-story` | Brief/logline → canon-consistent German script + beat sheet |
| `/apercu-canon` | Validate a script/asset against the bible; emit a pass/flag report |

Planned next: `/apercu-storyboard`, `/apercu-modelsheet`, `/apercu-rive`,
`/apercu-publish`, `/apercu-captions`.

## Using it

**Quickest (this repo only):** the skills also work if copied/symlinked into
`.claude/skills/` at the project root.

```bash
mkdir -p .claude/skills
ln -s ../../plugins/apercu-studio/skills/apercu-story .claude/skills/apercu-story
ln -s ../../plugins/apercu-studio/skills/apercu-canon .claude/skills/apercu-canon
```

**As a shared plugin (across projects):** add this repo as a plugin marketplace, then
enable `apercu-studio`, so the whole team runs the identical pipeline. See the Claude
Code plugin docs for `plugin marketplace add` / install.

## Contract

Every skill treats `content-bible/` as the single source of truth and writes its output
into the relevant `episodes/<slug>/` folder as a committed file. The canon gate
(`/apercu-canon`) must pass before work moves downstream.
