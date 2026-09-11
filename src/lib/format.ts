/** Swiss German date + interface formatting helpers. */

const dateFmt = new Intl.DateTimeFormat('de-CH', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** 12.09.2026 */
export function formatDate(date: Date): string {
  return dateFmt.format(date);
}

/** 11.09.26 — compact form used in terminal-style metadata. */
export function formatDateShort(date: Date): string {
  return dateFmt.format(date).replace(/\.(\d{2})(\d{2})$/, '.$2');
}

/** Zero-pad a chapter/index number: 3 -> "003". */
export function pad(n: number, width = 3): string {
  return String(n).padStart(width, '0');
}

/** Reading time as terminal clock: 8 min -> "08:00". */
export function readingClock(minutes: number): string {
  return `${String(minutes).padStart(2, '0')}:00`;
}

/** ASCII progress bar: 0.78 -> "████████░░ 078%". */
export function progressBar(fraction: number, width = 10): string {
  const clamped = Math.max(0, Math.min(1, fraction));
  const filled = Math.round(clamped * width);
  const pct = String(Math.round(clamped * 100)).padStart(3, '0');
  return `${'█'.repeat(filled)}${'░'.repeat(width - filled)} ${pct}%`;
}
