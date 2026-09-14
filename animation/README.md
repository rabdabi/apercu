# animation/ — Moho production workspace

This directory holds the **Moho-specific production artifacts** for Aperçu Motion:
the binary Moho project files, renders, web exports, and the technical rig maps.

It deliberately does **not** duplicate the project's existing knowledge. Sources of truth:

| You want… | It lives in… |
|---|---|
| Character canon (Emil: proportions, silhouette, costume, Rive states) | `content-bible/characters/` |
| Visual / world / animation / camera / continuity rules | `content-bible/` (`world/`, `style/`) + `docs/visual-language.md` |
| Per-episode script, shotlist, scene manifest (`moho-scenes.json`) | `episodes/<slug>/` |
| Story/canon/storyboard/modelsheet/rive/publish skills | `plugins/apercu-studio/skills/` |
| **How to drive Moho via MCP (the animation director)** | `plugins/apercu-studio/skills/apercu-animation/` |
| **Moho MCP setup / recovery** | `docs/MOHO-MCP-SETUP.md` |

## Layout

```
moho/
  masters/     canonical character rigs (e.g. emil-master.moho) — VERSION-CONTROLLED, never animated on directly
  scenes/      per-shot working copies built from masters + episodes/<slug>/moho-scenes.json
  backups/     timestamped copies made before structural edits — GIT-IGNORED
renders/
  previews/    throwaway review frames/clips — GIT-IGNORED
  finals/      approved final renders
  stills/      key stills / posters
exports/
  web/         optimized WebM/MP4/poster for the website (later copied to public/)
  archive/     large master exports — GIT-IGNORED
characters/
  emil/        rig-map.yaml · poses.yaml · actions.yaml  (technical mapping of the canon; NOT a canon copy)
  _template/   blank trio for new characters
```

## The rule that matters

Emil is a **permanent authored rig**, never re-generated. Character identity comes from
`content-bible/characters/emil.md` + `moho/masters/emil-master.moho`, not from prompting.
Work on **scene copies** in `moho/scenes/`; back up before structural edits; never animate
directly on a master. See the `apercu-animation` skill for the full observe → plan →
animate → render → review loop.

## Website hand-off

Moho is a production tool only. Flow: Moho → render → `renders/finals/` → optimize →
`exports/web/` → (deliberate, manual copy) → website `public/`. No Moho dependency ever
ships in the Astro/Node runtime.
