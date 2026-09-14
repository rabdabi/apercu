# Character continuity (pointer)

Emil's design is **canon** in `content-bible/characters/emil.md`. Read it before any
character work. If a drawing or rig contradicts that file, the drawing/rig is wrong.

## Never break these (from emil.md)

- **The nose never changes shape** between episodes — "this nose is the character".
- **4.5 heads tall**, deliberately short; large rounded head; small thin almond eyes,
  pale-green iris; brows are two short independent strokes (they do the acting).
- **Silhouette key:** bowl-cut head shape + short stature + layered tunic collar. If those
  three read in pure black, it is Emil.
- Rust-orange blunt medieval bowl cut as one silhouette shape; four-fingered mitten hands
  slightly too large; soft laceless shoes.
- Default poor-register costume; palette only from `content-bible/world/palette.md` (oat,
  clay, iron). **Never** re-dressed in the rich world's colours — the contrast is the point.
- Clothing hangs slightly crooked; never pressed or symmetrical.

## Maintain across every scene

body proportions · clothing · colours · line treatment · face geometry · hand design ·
height relationships (Emil is dwarfed by architecture and the rich world) · silhouette.

## Rig ↔ canon map

The technical mapping lives in `animation/characters/emil/{rig-map,poses,actions}.yaml`.
Canonical Rive/web state names (keep exact, referenced by `scroll-map.json`):
`idle · walk · run · look_up · shocked · point · sit · sleep · wave · angry · confused ·
sad · laugh`. Moho poses/actions should align to these and to the model-sheet poses, not
introduce a competing vocabulary.

## Before significant character work

1. Open the **scene copy** (never the master).
2. `document_getLayers` → find Emil's layers; `layer_getBones` → the live bone IDs.
3. Cross-check against `rig-map.yaml` (names) — but trust the live IDs.
4. Confirm proportions/silhouette by screenshot before and after.
