# Scene schema (the existing `moho-scenes.json`)

Aperçu already has a human-readable scene format — **do not invent a new one**. It is the
Moho scene manifest produced by `/apercu-storyboard` (GATE 03) and lives at
`episodes/<slug>/moho-scenes.json`. Template: `episodes/_template/moho-scenes.json`.

## Shape

```json
{
  "slug": "<episode-slug>",
  "fps": 24,
  "feel": "animate-on-2s",
  "scenes": [
    {
      "id": "01",
      "location": "<location-slug>",          // → content-bible/locations/ + world IDs
      "register": "poor",                       // "poor" | "rich"
      "camera": "WIDE",                          // WIDE MED CLOSE INSERT PAN-L PAN-R PUSH CARD
      "backgrounds": ["village-plate-a"],        // → episodes/<slug>/assets/*.brief.md
      "characters": ["emil"],                    // → content-bible/characters/*
      "action": "Establish. Emil small in empty frame.",
      "holdFrames": 4
    }
  ]
}
```

## How the director uses it

- One `scenes[]` entry ≈ one Moho scene copy in `animation/moho/scenes/`.
- `camera` maps to the moves allowed by `content-bible/world/camera-grammar.md`.
- `register` sets palette/architecture mood (poor vs rich worlds).
- `holdFrames` is the default hold length for that shot — reinforces "on 2s".
- `action` is prose intent; the director breaks it into key poses using the character's
  `poses.yaml` / `actions.yaml`, then keyframes them.

## Companion files in `episodes/<slug>/`

`script.md` · `shotlist.md` (per-shot rows) · `brief.md` · `canon-report.md` (must be
STATUS/PASS before production) · `assets/*.brief.md` (backgrounds/props to build).

## Optional per-shot animation notes

For a shot needing more direction than the manifest holds, add a sibling
`episodes/<slug>/scene-notes/<id>.md` with key-pose timing — keep it human-readable prose,
not a new DSL. The manifest stays the machine-facing source.
