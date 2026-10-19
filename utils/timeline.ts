export interface YM { y: number; m: number }
export interface Span { s: number; e: number }

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseYM(s: string): YM {
  const [y, m] = s.split('-').map(Number);
  return { y, m };
}

export function toIsoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startPos(ym: YM): number {
  return ym.y + (ym.m - 1) / 12;
}

export function endPos(ym: YM): number {
  return ym.y + ym.m / 12;
}

export function todayPos(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return y + (m - 1 + (d - 1) / days) / 12;
}

export function monthsInclusive(a: YM, b: YM): number {
  return (b.y * 12 + b.m) - (a.y * 12 + a.m) + 1;
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  if (!years) return unit(rest, 'month');
  if (!rest) return unit(years, 'year');
  return `${unit(years, 'year')} ${unit(rest, 'month')}`;
}

export function formatYM(ym: YM): string {
  return `${MONTHS[ym.m - 1]} ${ym.y}`;
}

export function formatRange(start: string, end: string | undefined, today: string): string {
  const s = parseYM(start);
  if (!end && startPos(s) > todayPos(today)) return `From ${formatYM(s)}`;
  return `${formatYM(s)} – ${end ? formatYM(parseYM(end)) : 'today'}`;
}

export function entryLength(start: string, end: string | undefined, today: string): string {
  const s = parseYM(start);
  const t = parseYM(today.slice(0, 7));
  const now = todayPos(today);
  if (startPos(s) > now) return 'Upcoming';
  if (!end) return formatDuration(monthsInclusive(s, t));
  const e = parseYM(end);
  if (endPos(e) <= now) return formatDuration(monthsInclusive(s, e));
  const total = monthsInclusive(s, e);
  if (total < 24) return formatDuration(monthsInclusive(s, t));
  const years = Math.ceil(total / 12);
  const year = Math.min(years, Math.floor((monthsInclusive(s, t) - 1) / 12) + 1);
  return `Expected, year ${year} of ${years}`;
}

export function entrySpan(start: string, end: string | undefined, today: string): Span {
  const s = startPos(parseYM(start));
  if (end) return { s, e: endPos(parseYM(end)) };
  const now = todayPos(today);
  return { s, e: s > now ? s + 0.25 : now };
}

// Margins chosen so 2026-10-18 gives career 2025.75–2027.5 and education 2021–2030.
export function rulerRange(spans: Span[], today: number): { r0: number; r1: number; rs: number } {
  const lo = Math.min(...spans.map(x => x.s));
  const hi = Math.max(today, ...spans.map(x => x.e));
  const long = hi - lo > 3;
  const r0 = long ? Math.floor(lo - 0.25) : Math.floor(lo * 4) / 4 - 0.25;
  const r1 = long ? Math.ceil(hi + 0.25) : Math.ceil(hi * 4) / 4 + 0.5;
  return { r0, r1, rs: r1 - r0 };
}

export function rulerYears(r0: number, r1: number): number[] {
  const years: number[] = [];
  for (let y = Math.floor(r0); y <= Math.ceil(r1); y++) years.push(y);
  return years;
}

export function packRows<T extends Span>(items: T[]): T[][] {
  const rows: T[][] = [];
  const sorted = [...items].sort((a, b) => a.s - b.s || a.e - b.e);
  for (const item of sorted) {
    const row = rows.find(r => r[r.length - 1].e <= item.s + 1e-9);
    if (row) row.push(item);
    else rows.push([item]);
  }
  return rows;
}

export function labelSide(span: Span, today: number, r0: number, r1: number): 'before' | 'after' | null {
  if (!(span.s < today && today < span.e)) return null;
  const before = today - Math.max(span.s, r0);
  const after = Math.min(span.e, r1) - today;
  return before >= after ? 'before' : 'after';
}

export function dialAngles(n: number): number[] {
  if (n <= 1) return [0];
  return Array.from({ length: n }, (_, i) => -120 + i * 240 / (n - 1));
}
