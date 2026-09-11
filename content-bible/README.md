# The Aperçu Motion Bible

This directory is the **single source of truth** for the Aperçu animated world. It is
plain Markdown, versioned in Git, and read directly by the `apercu-studio` skills before
any script, storyboard or asset is produced. Nothing here describes a website feature —
it describes a *world* and how that world is drawn and moved.

> **Doctrine:** AI designs and assists · the character is an asset · animation is directed.

## Why this exists

AI-generated animation looks generic because it forgets. A recurring character cannot
forget. Every decision that must stay constant across a hundred episodes — Emil's
proportions, the palette, the way the camera moves, the visual difference between the
poor world and the rich world — lives here as a committed file, not in a prompt.

## How it is used

- `/apercu-story` reads the **whole** bible before writing a script.
- `/apercu-canon` validates every script and asset brief **against** these files and
  reports violations before work moves down the pipeline.
- Human directors edit these files deliberately; a change here is a change to the canon.

## Structure

```
content-bible/
  characters/   emil.md · _template.md      — who recurs, exactly
  world/        world-rules.md              — what is true in this universe
                palette.md                  — the only colours that exist
                poor-world.md · rich-world.md — the two visual registers
                motion-language.md          — how things move (the "old" feeling)
                camera-grammar.md           — how the camera behaves
  locations/    _template.md                — recurring places
  style/        animation-principles.md     — the craft rules, frame by frame
```

## Conventions

- **Output language of stories:** German (`de`). This bible is written in English as
  internal production documentation; scripts and on-screen text are German.
- **Canonical vs draft:** a value is canon only once it is committed here. Image-gen and
  AI drafts are references until a human promotes them.
- Keep entries declarative and testable ("Emil is exactly 4.5 heads tall"), so
  `/apercu-canon` can actually check them.
