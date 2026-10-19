<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { site, type Entry } from '~/data/site';
import { entryLength, entrySpan, formatRange, labelSide, packRows, rulerRange, rulerYears, todayPos, type Span } from '~/utils/timeline';
import { reducedMotion } from '~/utils/motion';
import { useToday } from '~/composables/useToday';

const groups = [
  { key: 'career', label: 'Career', tone: 't-video', entries: site.career },
  { key: 'education', label: 'Education', tone: 't-music', entries: site.education },
] as const;
type GroupKey = (typeof groups)[number]['key'];
type Clip = Span & { entry: Entry };

const QUARTERS = ['Apr', 'Jul', 'Oct'];

const today = useToday();
const now = computed(() => todayPos(today.value));
const active = ref<GroupKey>('career');
const selected = ref(groups[0].entries[0].id);
const settled = ref(false);

const tablist = ref<HTMLElement | null>(null);
const scroller = ref<HTMLElement | null>(null);
const timeline = ref<HTMLElement | null>(null);

// Open-ended entries that have not started run past the ruler's end, hatched, and keep their row.
const upcoming = (c: Clip) => !c.entry.end && c.s > now.value;

const tracks = computed(() => groups.map((g) => {
  const clips: Clip[] = g.entries.map(entry => ({ entry, ...entrySpan(entry.start, entry.end, today.value) }));
  const rows = packRows(clips.map(c => (upcoming(c) ? { ...c, e: Infinity } : c)));
  return { ...g, rows, range: rulerRange(clips, now.value) };
}));
const range = computed(() => tracks.value[groups.findIndex(g => g.key === active.value)].range);

const ticks = computed(() => {
  const r0 = Math.min(...tracks.value.map(t => t.range.r0));
  const r1 = Math.max(...tracks.value.map(t => t.range.r1));
  return rulerYears(r0, r1).flatMap(y => [
    { y, label: String(y), kind: 'yr' },
    ...QUARTERS.map((label, i) => ({ y: y + (i + 1) / 4, label, kind: 'q' })),
  ]);
});

function clipClass(clip: Clip, tone: string) {
  const side = labelSide(clip, now.value, range.value.r0, range.value.r1);
  return [tone, side && `lbl-${side}`, { future: clip.e > now.value, sel: clip.entry.id === selected.value }];
}

let reduce = false;

// Reads state, not the inline CSS variables: after a tab switch or the mount-time date update
// Vue has not patched the DOM yet.
function centreToday() {
  const box = scroller.value!;
  const tl = timeline.value!;
  if (box.scrollWidth <= box.clientWidth) return;
  const hw = parseFloat(getComputedStyle(tl).getPropertyValue('--hw'));
  const x = hw + (tl.offsetWidth - hw - 28) * (now.value - range.value.r0) / range.value.rs;
  box.scrollTo({ left: x - box.clientWidth * 0.7, behavior: reduce ? 'auto' : 'smooth' });
}

function setTab(key: GroupKey, id?: string) {
  active.value = key;
  selected.value = id ?? groups.find(g => g.key === key)!.entries[0].id;
  centreToday();
}

function onTabKey(e: KeyboardEvent, key: GroupKey) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const other = groups.find(g => g.key !== key)!.key;
  tablist.value!.querySelector<HTMLElement>(`[data-tab="${other}"]`)!.focus();
  setTab(other);
}

onMounted(() => {
  reduce = reducedMotion();
  centreToday();
  // The visitor's date replaces the build date right after mount: the clips jump there instead
  // of sliding, and transitions come back once that layout has been painted.
  nextTick(() => requestAnimationFrame(() => requestAnimationFrame(() => { settled.value = true; })));
});
</script>

<template>
  <section
    id="career"
    class="sec wrap"
    :data-marker="site.sections.career.marker"
  >
    <div class="sec-head">
      <h2>{{ site.sections.career.title }}</h2>
    </div>
    <div class="tl-panel">
      <div
        ref="tablist"
        class="tabs"
        role="tablist"
        aria-label="Career or education"
      >
        <button
          v-for="g in groups"
          :id="`tab-${g.key}`"
          :key="g.key"
          class="tab"
          role="tab"
          :aria-controls="`list-${g.key}`"
          :aria-selected="g.key === active"
          :data-tab="g.key"
          :tabindex="g.key === active ? 0 : -1"
          @click="setTab(g.key)"
          @keydown="onTabKey($event, g.key)"
        >
          {{ g.label }}
        </button>
      </div>
      <div
        id="tlScroll"
        ref="scroller"
        class="tl-scroll"
      >
        <div
          id="tl"
          ref="timeline"
          class="tl"
          :class="{ fine: range.rs <= 3, instant: !settled }"
          :data-active="active"
          :style="{ '--r0': range.r0, '--rs': range.rs, '--today': now }"
        >
          <div class="tl-row tl-ruler">
            <div class="tl-h" />
            <div
              id="ruler"
              class="tl-body"
            >
              <div
                v-for="t in ticks"
                :key="t.y"
                :class="t.kind"
                :style="{ '--y': t.y }"
              >
                <span>{{ t.label }}</span>
              </div>
            </div>
          </div>
          <template
            v-for="(track, ti) in tracks"
            :key="track.key"
          >
            <div
              v-for="(row, ri) in track.rows"
              :key="ri"
              class="tl-row"
              :class="{ gap: ti > 0 && ri === 0, dim: track.key !== active }"
              :data-group="track.key"
            >
              <div class="tl-h">
                {{ ri === 0 ? track.label : '' }}
              </div>
              <div class="tl-body">
                <button
                  v-for="clip in row"
                  :key="clip.entry.id"
                  class="clip"
                  :class="clipClass(clip, track.tone)"
                  :data-id="clip.entry.id"
                  :style="{ '--s': clip.s, '--e': upcoming(clip) ? range.r1 + range.rs : clip.e }"
                  :title="clip.entry.tooltip"
                  @click="setTab(track.key, clip.entry.id)"
                >
                  <span>{{ clip.entry.clip }}</span>
                </button>
              </div>
            </div>
          </template>
          <div class="today">
            <span>Today</span>
          </div>
        </div>
      </div>
      <ol
        v-for="g in groups"
        :id="`list-${g.key}`"
        :key="g.key"
        class="entries"
        role="tabpanel"
        :aria-labelledby="`tab-${g.key}`"
        :data-group="g.key"
        :hidden="g.key !== active"
      >
        <li
          v-for="e in g.entries"
          :key="e.id"
          class="entry"
          :class="[g.tone, { sel: e.id === selected }]"
          :data-id="e.id"
        >
          <button @click="selected = e.id">
            <span class="e-role">{{ e.role }}</span>
            <span class="e-org">{{ e.org }}</span>
            <span class="e-date">{{ formatRange(e.start, e.end, today) }}</span>
            <span class="e-len">{{ entryLength(e.start, e.end, today) }}</span>
          </button>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.tl-panel { border: 1px solid var(--line); border-radius: 28px; background: var(--raise); overflow: hidden; }
.tabs { display: flex; gap: 8px; padding: 16px; border-bottom: 1px solid var(--line); }
.tab { height: 44px; padding: 0 22px; border-radius: 999px; border: 1px solid transparent; background: transparent; color: var(--ink-2); font-size: 1.0625rem; cursor: pointer; transition: background .25s, color .25s; }
.tab:hover { color: var(--ink); }
.tab[aria-selected="true"] { background: var(--ink); color: #181818; }
.tl-scroll { overflow-x: auto; scrollbar-width: thin; scrollbar-color: var(--raise-3) transparent; }
.tl { --hw: 148px; position: relative; min-width: 760px; padding: 10px 0 22px; }
.tl-row { display: flex; height: 64px; }
.tl-row.gap { margin-top: 8px; }
.tl-h { flex: 0 0 var(--hw); position: sticky; left: 0; z-index: 3; padding: 0 24px; display: flex; align-items: center; background: var(--raise); color: var(--ink-2); font-size: .9375rem; }
.tl-body { position: relative; flex: 1; margin-right: 28px; overflow: hidden; }
.tl-ruler { height: 54px; }
.tl-ruler .tl-body { border-bottom: 1px solid var(--line); }
.yr, .q { position: absolute; bottom: 0; left: calc((var(--y) - var(--r0)) / var(--rs) * 100%); }
.yr { height: 12px; border-left: 1px solid var(--line-2); }
.yr span { position: absolute; left: 8px; bottom: 6px; font-size: .875rem; color: var(--ink-2); }
.q { height: 6px; border-left: 1px solid var(--line); }
.q span { position: absolute; left: 6px; bottom: 6px; font-size: .75rem; color: var(--ink-3); opacity: 0; transition: opacity .3s; }
.tl.fine .q span { opacity: 1; }
.yr, .q, .clip, .today { transition: left .6s var(--ease), width .6s var(--ease); }
.tl.instant .yr, .tl.instant .q, .tl.instant .clip, .tl.instant .today { transition: none; }
.tl-row[data-group] { transition: opacity .3s; }
.tl-row.dim { opacity: .32; }
.clip {
  --m: 52%; --ring-a: color-mix(in srgb, var(--a) 72%, #1f1f21); --ring-b: color-mix(in srgb, var(--b) 72%, #1f1f21);
  position: absolute; top: 12px; bottom: 12px;
  left: calc((var(--s) - var(--r0)) / var(--rs) * 100%);
  width: calc((var(--e) - var(--s)) / var(--rs) * 100%);
  padding: 0 14px; border-radius: 10px; border: 1px solid transparent;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--a) var(--m), #1f1f21), color-mix(in srgb, var(--b) var(--m), #1f1f21)) padding-box,
    linear-gradient(90deg, var(--ring-a), var(--ring-b)) border-box;
  color: #fff; font-size: .9375rem; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  cursor: pointer; transition: left .6s var(--ease), width .6s var(--ease), padding .6s var(--ease), box-shadow .3s;
}
.clip span { position: relative; z-index: 1; }
.clip:hover { --m: 58%; }
.clip.sel {
  --m: 58%; --ring-a: var(--a); --ring-b: var(--b);
  box-shadow: -8px 0 22px -6px color-mix(in srgb, var(--a) 80%, transparent), 8px 0 22px -6px color-mix(in srgb, var(--b) 80%, transparent);
}
.clip.lbl-after { padding-left: calc((var(--today) - var(--s)) / var(--rs) * 100% + 12px); }
.clip.lbl-before { padding-right: calc((var(--e) - var(--today)) / var(--rs) * 100% + 12px); }
.clip.future::after {
  content: ""; position: absolute; top: 0; bottom: 0; right: 0;
  width: calc((var(--e) - var(--today)) / (var(--e) - var(--s)) * 100%);
  background: repeating-linear-gradient(-45deg, rgba(24, 24, 24, .55) 0 5px, transparent 5px 10px);
  pointer-events: none;
}
.today {
  position: absolute; top: 8px; bottom: 22px; z-index: 4; width: 2px; margin-left: -1px; pointer-events: none;
  left: calc(var(--hw) + (100% - var(--hw) - 28px) * (var(--today) - var(--r0)) / var(--rs));
  background: linear-gradient(180deg, var(--music-a), var(--music-b));
  box-shadow: 0 0 0 1px rgba(24, 24, 24, .7);
}
.today span { position: absolute; top: 0; right: 8px; padding: 3px 9px; border-radius: 999px; font-size: .75rem; line-height: 1.2; color: #fff; white-space: nowrap; background: linear-gradient(90deg, var(--music-a), var(--music-b)); }
.entries { padding: 10px 12px 14px; border-top: 1px solid var(--line); display: grid; gap: 4px; }
.entries[hidden] { display: none; }
.entry button {
  position: relative;
  width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 24px; align-items: baseline;
  padding: 20px 20px 20px 44px; border-radius: 16px; border: 0; background: transparent; text-align: left; cursor: pointer;
  transition: background .2s;
}
.entry button::before { content: ""; position: absolute; left: 20px; top: 24px; bottom: 24px; width: 4px; border-radius: 2px; background: linear-gradient(180deg, var(--a), var(--b)); }
.entry button:hover { background: rgba(255, 255, 255, .03); }
.entry.sel button { background: var(--raise-2); }
.e-role { font-size: 1.375rem; line-height: 1.25; letter-spacing: -.01em; }
.e-org { grid-column: 1; color: var(--ink-2); font-size: 1rem; }
.e-date { grid-column: 2; grid-row: 1; text-align: right; color: var(--ink-2); font-size: 1rem; white-space: nowrap; }
.e-len { grid-column: 2; grid-row: 2; text-align: right; color: var(--ink-3); font-size: .9375rem; white-space: nowrap; }

@media (max-width: 760px) {
  .tabs { padding: 12px; }
  .tab { flex: 1; padding: 0 12px; }
  .tl-scroll { display: none; }
  .entries { border-top: 0; padding: 8px 12px 12px; }
  .entry button { grid-template-columns: 1fr; padding: 16px 16px 16px 44px; }
  .entry button::before { left: 21px; top: 28px; bottom: -32px; width: 2px; border-radius: 0; background: var(--line-2); }
  .entry:last-child button::before { content: none; }
  .entry button::after { content: ""; position: absolute; left: 16px; top: 22px; width: 12px; height: 12px; border-radius: 50%; background: linear-gradient(135deg, var(--a), var(--b)); }
  .entry.sel button { background: transparent; }
  .e-date, .e-len { grid-column: 1; grid-row: auto; text-align: left; }
  .e-date { margin-top: 8px; }
  .e-role { font-size: 1.25rem; }
}
</style>
