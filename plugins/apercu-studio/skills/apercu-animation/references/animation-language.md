# Animation language (pointer)

The Aperçu animation aesthetic is **canon**, not defined here. Read the source of truth:

- `content-bible/world/motion-language.md` — timing signature: work at **12 drawings/sec
  feel (on 2s)** inside a 24 fps file; hold keys **2–4 frames**; characters are **often
  completely still**; brows/eyes are the primary acting tool; mouth = simple 3–4 shape
  cycle; hard cuts, no dissolves/blur/glow; paper grain, no motion blur.
- `content-bible/world/camera-grammar.md` — allowed camera moves and shot tokens
  (`WIDE MED CLOSE INSERT PAN-L PAN-R PUSH CARD`); slow or static; camera observes.
- `content-bible/style/animation-principles.md` — drawing/animation principles.
- `docs/visual-language.md` — the site-wide visual grammar.

## Translating canon → Moho

| Canon says… | In Moho… |
|---|---|
| "on 2s" | place meaningful keys ~every 2 frames when moving; hold otherwise |
| "hold key drawings 2–4 frames" | use `step` interpolation between held poses |
| "stillness is valid" | leave long gaps with no keys; don't fill with drift |
| "brows/eyes do the acting" | animate brow/eye switch layers + smart bones, not the whole body |
| "mouth = simple cycle" | 3–4 mouth switch-layer states, stepped |
| "hard cuts, no dissolves" | cut between scenes/shots; never cross-fade layers |
| "camera observes" | at most a slow `smooth`/`ease` push or pan; default static |

If a request would produce smooth, floaty, motion-graphics movement, it is wrong for
Aperçu — favour fewer, stronger drawings.
