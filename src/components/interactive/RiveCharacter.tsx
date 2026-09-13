import { useEffect, useRef, useState } from 'react';

/**
 * The living Emil. A Rive island that plays a state machine and reacts to
 * `emil:state` events dispatched by <ScrollScene>. The Rive runtime is
 * dynamically imported so it only loads on pages that actually mount Emil.
 *
 * RIG CONTRACT (for the animator authoring the .riv):
 *   - one state machine (default name "State Machine 1")
 *   - one NUMBER input named "state"; set it to the index below to switch state.
 * Indices match the canonical order in content-bible/characters/emil.md.
 */
const STATE_INDEX: Record<string, number> = {
  idle: 0,
  walk: 1,
  run: 2,
  look_up: 3,
  shocked: 4,
  point: 5,
  sit: 6,
  sleep: 7,
  wave: 8,
  angry: 9,
  confused: 10,
  sad: 11,
  laugh: 12,
};

export interface RiveCharacterProps {
  /** Path to the .riv asset in /public. When absent, a static placeholder shows. */
  src?: string;
  stateMachine?: string;
  artboard?: string;
  label?: string;
  initialState?: keyof typeof STATE_INDEX;
}

export default function RiveCharacter({
  src,
  stateMachine = 'State Machine 1',
  artboard,
  label = 'Emil',
  initialState = 'idle',
}: RiveCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!src || !canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanup = () => {};

    (async () => {
      try {
        const { Rive } = await import('@rive-app/canvas');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let stateInput: { value: number } | undefined;

        const rive = new Rive({
          src,
          canvas,
          autoplay: !reduce,
          artboard,
          stateMachines: stateMachine,
          onLoad: () => {
            rive.resizeDrawingSurfaceToCanvas();
            const inputs = rive.stateMachineInputs(stateMachine);
            stateInput = inputs?.find((i) => i.name === 'state') as
              | { value: number }
              | undefined;
            if (stateInput) stateInput.value = STATE_INDEX[initialState] ?? 0;
          },
          onLoadError: () => setFailed(true),
        });

        const onState = (e: Event) => {
          const name = (e as CustomEvent<string>).detail;
          if (stateInput && name in STATE_INDEX) stateInput.value = STATE_INDEX[name]!;
        };
        const onResize = () => rive.resizeDrawingSurfaceToCanvas();

        window.addEventListener('emil:state', onState);
        window.addEventListener('resize', onResize);
        cleanup = () => {
          window.removeEventListener('emil:state', onState);
          window.removeEventListener('resize', onResize);
          rive.cleanup();
        };
      } catch {
        setFailed(true);
      }
    })();

    return () => cleanup();
  }, [src, stateMachine, artboard, initialState]);

  // No asset yet (or load failed): honest, on-model static placeholder.
  if (!src || failed) {
    return (
      <div className="emil-placeholder" role="img" aria-label={`${label} (Platzhalter)`}>
        <svg viewBox="0 0 120 170" width="120" height="170" aria-hidden="true">
          <g stroke="#241f1a" strokeWidth="2" strokeLinejoin="round">
            <path d="M42 60 L36 150 L84 150 L79 60 Z" fill="#d9ccaa" />
            <path d="M50 56 L60 70 L70 56 L79 60 L60 78 L41 60 Z" fill="#6f7466" />
            <path d="M60 8 q22 0 22 22 q0 20 -22 24 q-22 -4 -22 -24 q0 -22 22 -22 Z" fill="#b07a4f" />
            <path d="M36 32 C36 9 46 4 60 4 C74 4 84 9 84 32 C78 25 70 26 63 28 C61 25 59 25 57 28 C50 26 42 25 36 32 Z" fill="#c0562f" />
            <path d="M45 28 l10 1 M65 29 l10 -1" strokeWidth="1.8" />
            <path d="M60 36 q-3 5 0 8" fill="none" strokeWidth="1.8" />
            <circle cx="51" cy="34" r="1.6" fill="#241f1a" stroke="none" />
            <circle cx="69" cy="34" r="1.6" fill="#241f1a" stroke="none" />
          </g>
        </svg>
        <span className="emil-placeholder__tag">EMIL · RIVE-ASSET AUSSTEHEND</span>
        <style>{`
          .emil-placeholder { display:grid; justify-items:center; gap:.5rem; }
          .emil-placeholder__tag {
            font-family: var(--font-mono, monospace); font-size:.6rem; letter-spacing:.12em;
            color: var(--c-ink-faint, #6f6a5c);
          }
        `}</style>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={400}
      role="img"
      aria-label={label}
      style={{ width: '100%', height: 'auto', maxWidth: 300 }}
    />
  );
}
