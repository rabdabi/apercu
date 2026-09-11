# WORLD / PALETTE

> The only colours that exist in the Aperçu world. A colour not on this page does not
> get drawn. This is the strongest single guarantee of visual consistency.

STATUS / CANON · UPDATED / 11.09.26

The palette is split by register. Muted, chalky, ink-bound — pulled from illuminated
manuscripts and 1970s European gouache, never from bright digital primaries.

## Ink (both registers)

Everything is bound by imperfect ink. There is no pure black.

| Name      | Hex       | Use                                   |
| --------- | --------- | ------------------------------------- |
| Ink       | `#241f1a` | Outlines, everything                  |
| Ink-soft  | `#3a332b` | Secondary lines, shadow hatching      |

Outlines are drawn, not vector-clean: slight weight variation, occasional breaks.

## Poor world (2–3 colours per scene, max)

| Name   | Hex       | Use                          |
| ------ | --------- | ---------------------------- |
| Oat    | `#d9ccaa` | Parchment ground, linen      |
| Clay   | `#b07a4f` | Skin, wood, earth            |
| Iron   | `#6f7466` | Cold stone, sky, cloth       |
| Rust   | `#c0562f` | The single warm accent (Emil's hair, one object) |

Rule: a poor-world scene uses **at most three** of these plus ink. Large areas of bare
oat (negative space) are correct and wanted.

## Rich world (crowded, gilded)

| Name      | Hex       | Use                               |
| --------- | --------- | --------------------------------- |
| Gold      | `#c9a13b` | Leaf, ornament, throne, coins     |
| Burgundy  | `#7a2233` | Drapery, robes, deep shadow       |
| Deep-green| `#274034` | Backgrounds, forest, brocade      |
| Bone      | `#e7dcc4` | Marble, tablecloths, page         |
| Vermilion | `#b8371f` | Seals, blood, danger accent       |

Rule: a rich-world scene may use **all** of these at once. Density is the point.

## Website / UI echo

The site chrome already uses the Aperçu editorial tokens (charcoal `#14140f`, ink
`#f4f0e6`, signal lime `#c6f24e`). The *films* use the palette above; the *website
frame* around them uses the editorial tokens. Keep the two systems distinct — the lime
never appears inside the medieval world, and the medieval gold never becomes UI.

## Never

- No pure black (`#000`) or pure white (`#fff`).
- No colour outside these tables inside the animated world.
- No gradient fills in the poor world; flat areas only.
