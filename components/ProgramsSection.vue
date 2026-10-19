<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { LEVEL_LABEL, site, type Level } from '~/data/site';
import { useProgramRing } from '~/composables/useSiteLinks';
import { reducedMotion } from '~/utils/motion';

const row = ref<HTMLUListElement | null>(null);
const tiles: HTMLElement[] = [];
const vus: HTMLElement[] = [];
const setEl = (list: HTMLElement[], i: number) => (el: unknown) => {
  if (el instanceof HTMLElement) list[i] = el;
};

const atStart = ref(true);
const atEnd = ref(false);
const armed = ref(false);

let reduced = false;
let io: IntersectionObserver | null = null;
const vuTimers: number[] = [];
const flashTimers: number[] = [];

function rowState() {
  const el = row.value!;
  const end = el.scrollWidth - el.clientWidth - 2;
  atStart.value = el.scrollLeft <= 2;
  atEnd.value = el.scrollLeft >= end;
}

function scrollStep(dir: number) {
  row.value!.scrollBy({ left: dir * (tiles[0].offsetWidth + 20) * 2, behavior: reduced ? 'auto' : 'smooth' });
}

let down = false, moved = false, startX = 0, startLeft = 0;

function onPointerDown(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || e.button !== 0) return;
  down = true;
  moved = false;
  startX = e.clientX;
  startLeft = row.value!.scrollLeft;
}

function onPointerMove(e: PointerEvent) {
  if (!down) return;
  // Released outside the row before the drag began: no pointerup reached us.
  if (!(e.buttons & 1)) {
    endDrag();
    return;
  }
  const el = row.value!;
  const dx = e.clientX - startX;
  if (!moved && Math.abs(dx) > 4) {
    moved = true;
    el.classList.add('is-drag');
    el.setPointerCapture(e.pointerId);
  }
  if (moved) el.scrollLeft = startLeft - dx;
}

function endDrag() {
  down = false;
  row.value!.classList.remove('is-drag');
}

const DOTS: Record<Level, number> = { 1: 4, 2: 8, 3: 9 };

function light(vu: HTMLElement, n: number) {
  Array.from(vu.children).forEach((s, k) => s.classList.toggle('on', k < n));
}

function run(i: number) {
  const vu = vus[i];
  const target = DOTS[site.programs[i].level];
  const peak = Math.min(12, target + 2);
  let n = 0;
  const settle = () => {
    if (n <= target) return;
    light(vu, --n);
    vuTimers[i] = window.setTimeout(settle, 70);
  };
  const up = () => {
    light(vu, ++n);
    vuTimers[i] = n < peak ? window.setTimeout(up, 38) : window.setTimeout(settle, 140);
  };
  up();
}

const { request } = useProgramRing();
watch(request, (r) => {
  if (!r) return;
  const i = site.programs.findIndex(p => p.name === r.name);
  const tile = tiles[i];
  if (!tile) return;
  tile.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center', inline: 'start' });
  if (r.focus) {
    tile.tabIndex = -1;
    tile.focus({ preventScroll: true });
  }
  tile.classList.remove('svc-flash');
  // Reading offsetWidth flushes styles, so the re-added class restarts the animation.
  void tile.offsetWidth;
  tile.classList.add('svc-flash');
  clearTimeout(flashTimers[i]);
  flashTimers[i] = window.setTimeout(() => tile.classList.remove('svc-flash'), 2600);
});

onMounted(() => {
  reduced = reducedMotion();
  rowState();
  window.addEventListener('resize', rowState);
  if (!('IntersectionObserver' in window) || reduced) return;
  armed.value = true;
  io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io!.unobserve(e.target);
      run(tiles.indexOf(e.target as HTMLElement));
    }
  }, { threshold: 0.7 });
  tiles.forEach(t => io!.observe(t));
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', rowState);
  io?.disconnect();
  vuTimers.forEach(t => clearTimeout(t));
  flashTimers.forEach(t => clearTimeout(t));
});
</script>

<template>
  <section
    id="programs"
    class="sec programs"
    :data-marker="site.sections.programs.marker"
  >
    <div class="sec-head wrap">
      <h2>{{ site.sections.programs.title }}</h2>
      <div class="arrows">
        <button
          id="rowPrev"
          class="icon-btn"
          aria-label="Show previous tools"
          :disabled="atStart"
          @click="scrollStep(-1)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          ><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button
          id="rowNext"
          class="icon-btn"
          aria-label="Show more tools"
          :disabled="atEnd"
          @click="scrollStep(1)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          ><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
    <div
      id="rowWrap"
      class="row-wrap"
      :class="{ 'at-start': atStart, 'at-end': atEnd }"
    >
      <span
        class="row-fade l"
        aria-hidden="true"
      />
      <span
        class="row-fade r"
        aria-hidden="true"
      />
      <ul
        id="row"
        ref="row"
        class="row"
        tabindex="0"
        aria-label="Tools, languages and skill level, scrolls sideways"
        @scroll.passive="rowState"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <li
          v-for="(p, i) in site.programs"
          :key="p.name"
          :ref="setEl(tiles, i)"
          class="tile"
          :class="`t-${p.tone}`"
          :data-level="p.level"
        >
          <span class="tile-cat">{{ p.category }}</span>
          <ProgramIcon
            class="tile-icon"
            :icon="p.icon"
            :tone="p.tone"
          />
          <h3 class="tile-name">
            {{ p.name }}
          </h3>
          <span
            :ref="setEl(vus, i)"
            class="vu"
            :class="{ armed }"
            aria-hidden="true"
          ><i
            v-for="k in 12"
            :key="k"
          /></span>
          <p class="lvl">
            {{ LEVEL_LABEL[p.level] }}
          </p>
        </li>
      </ul>
    </div>
    <p class="cap">
      {{ site.sections.programs.caption }}
    </p>
  </section>
</template>

<style scoped>
.row-wrap { position: relative; }
.row {
  display: flex; gap: 20px;
  overflow-x: auto; overscroll-behavior-x: contain;
  scroll-snap-type: x proximity; scroll-padding-inline: var(--edge);
  padding: 4px var(--edge) 12px;
  scrollbar-width: none; cursor: grab;
}
.row::-webkit-scrollbar { display: none; }
.row::after { content: ""; flex: 0 0 1px; }
.row.is-drag { cursor: grabbing; scroll-snap-type: none; user-select: none; }
.row-fade { position: absolute; top: 0; bottom: 0; z-index: 2; width: min(var(--edge), 96px); pointer-events: none; transition: opacity .3s; }
.row-fade.l { left: 0; background: linear-gradient(to right, var(--bg), rgba(24, 24, 24, 0)); }
.row-fade.r { right: 0; background: linear-gradient(to left, var(--bg), rgba(24, 24, 24, 0)); }
.row-wrap.at-start .row-fade.l, .row-wrap.at-end .row-fade.r { opacity: 0; }
.arrows { display: flex; gap: 10px; flex: none; }
.tile {
  flex: 0 0 clamp(224px, 18vw, 260px); scroll-snap-align: start;
  display: flex; flex-direction: column; min-height: 340px;
  padding: 22px 22px 20px; border-radius: 24px;
  background: var(--raise); border: 1px solid var(--line);
}
.tile-cat { font-size: .875rem; color: var(--ink-3); }
.tile-icon { width: 76px; height: 76px; margin: 34px auto 30px; overflow: visible; }
.tile-name { margin-top: auto; font-size: 1.25rem; line-height: 1.2; }
.vu { display: flex; gap: 3px; height: 16px; margin-top: 18px; }
.vu i { flex: 1; border-radius: 2px; background: rgba(255, 255, 255, .08); }
.vu i:nth-child(5), .vu i:nth-child(9) { margin-left: 6px; }
.vu i:nth-child(1) { --t: 0; }   .vu i:nth-child(2) { --t: .09; } .vu i:nth-child(3) { --t: .18; }
.vu i:nth-child(4) { --t: .27; } .vu i:nth-child(5) { --t: .36; } .vu i:nth-child(6) { --t: .45; }
.vu i:nth-child(7) { --t: .55; } .vu i:nth-child(8) { --t: .64; } .vu i:nth-child(9) { --t: .73; }
.vu i:nth-child(10) { --t: .82; } .vu i:nth-child(11) { --t: .91; } .vu i:nth-child(12) { --t: 1; }
.tile[data-level="1"] .vu:not(.armed) i:nth-child(-n+4),
.tile[data-level="2"] .vu:not(.armed) i:nth-child(-n+8),
.tile[data-level="3"] .vu:not(.armed) i:nth-child(-n+9),
.vu.armed i.on {
  background: color-mix(in oklab, var(--a), var(--b) calc(var(--t) * 100%));
  box-shadow: 0 0 10px -3px color-mix(in oklab, var(--a), var(--b) calc(var(--t) * 100%));
}
.lvl { margin-top: 12px; font-size: .9375rem; color: var(--ink-2); }
.programs .cap { padding-inline: var(--edge); margin-top: 24px; }

#programs .tile.svc-flash { position: relative; }
#programs .tile.svc-flash::after {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 2px; pointer-events: none;
  background: linear-gradient(135deg, var(--a), var(--b));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  animation: svc-flash 2.4s ease both;
}
#programs .tile.svc-flash { animation: svc-glow 2.4s ease both; }
@keyframes svc-flash { 0% { opacity: 0; } 18%, 70% { opacity: 1; } 100% { opacity: 0; } }
@keyframes svc-glow {
  0%, 100% { box-shadow: 0 0 0 transparent; }
  18%, 70% { box-shadow: -10px 0 40px -14px var(--a), 10px 0 40px -14px var(--b); }
}

@media (max-width: 760px) {
  .tile { flex-basis: 212px; min-height: 300px; padding: 18px; }
  .tile-icon { width: 64px; height: 64px; margin: 26px auto 24px; }
}
</style>
