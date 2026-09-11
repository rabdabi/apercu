import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

export interface StatCounterProps {
  value: number;
  /** Decimal places to display. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

/**
 * Counts up to `value` when scrolled into view. The only React island in the
 * app — used sparingly for meaningful statistics. Respects prefers-reduced-motion
 * by rendering the final value immediately.
 */
export default function StatCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  durationMs = 1400,
}: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [display, setDisplay] = useState(0);

  const format = (n: number) =>
    `${prefix}${n.toLocaleString('de-CH', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useEffect(() => {
    if (!inView) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, durationMs]);

  return (
    <span ref={ref} aria-label={format(value)}>
      <span aria-hidden="true">{format(display)}</span>
    </span>
  );
}
