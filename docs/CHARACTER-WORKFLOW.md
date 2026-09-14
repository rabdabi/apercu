# Character workflow

How a recurring character becomes a permanent, reusable Moho rig. The protagonist **Emil**
is the reference case; new characters follow the same path via `animation/characters/_template/`.

```
character design       content-bible/characters/<slug>.md  (canon: proportions, silhouette, costume, palette, never/allowed)
 → reference sheet     /apercu-modelsheet → model sheet (front/side/3q/back, expressions, hand poses, cycles); clean by hand; commit
 → Moho vector build   draw the character on-model in Moho from the model sheet
 → bone rig            add the skeleton; name bones to match rig-map.yaml
 → Smart Bones         corrective/turn/expression dials (head turn, brows)
 → switch layers       mouth (3–4 shapes), hands (8 poses), eyes/blink
 → expressions         the 12 canon expressions as poses/actions
 → hand poses          open/point/fist/carry/offer/shield/count/hide
 → reusable actions    build actions.yaml vocabulary as Moho Actions (idle, walk, looks, gestures, reactions)
 → walk cycle          on 2s, from the walk_* poses
 → master freeze       save as animation/moho/masters/<slug>-master.moho; fill rig-map.yaml; bump version; commit
```

## Emil specifics (read before touching Emil)

Canon: `content-bible/characters/emil.md`. Non-negotiables: the **nose never changes**;
**4.5 heads tall**; brows/eyes do the acting; silhouette = bowl-cut + short stature +
layered collar; poor-register palette only, never re-dressed in rich colours. Full
continuity checklist: `plugins/apercu-studio/skills/apercu-animation/references/character-continuity.md`.

Existing prep already in the repo: `content-bible/characters/emil/modelsheet-brief.md`
and `rive-build-guide.md`. The web character (`EmilFigure`, Rive) shares the state-name
vocabulary — keep Moho poses aligned to it, don't fork the vocabulary.

## The technical rig map

`animation/characters/<id>/`:
- `rig-map.yaml` — master path, bone/switch/smart-bone **names** (IDs stay live-discovered),
  version.
- `poses.yaml` — canonical pose names, aligned to the model sheet + Rive states.
- `actions.yaml` — reusable Moho Action vocabulary + timing (on 2s).

All `moho_action` fields stay `null`/TODO until the master rig exists. The animator fills
them by rediscovering the real rig — never invent Moho action IDs.

## Master discipline

The master is frozen and **version-controlled**. Never animate on it: copy into
`animation/moho/scenes/` per shot. Structural changes to the master get a backup in
`animation/moho/backups/` first, a `version:` bump in `rig-map.yaml`, and a commit.
