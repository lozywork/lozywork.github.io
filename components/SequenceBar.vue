<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from '~/data/site';

const SECTIONS = Object.entries(site.sections).map(([id, s]) => ({ id, label: s.marker }));

const FPS = 25;
const DURATION = 90;
const fmt = (sec: number) => {
  const f = Math.round(sec * FPS);
  return [Math.floor(f / FPS / 60), Math.floor(f / FPS) % 60, f % FPS].map(n => String(n).padStart(2, '0')).join(':');
};

const seq = ref<HTMLElement | null>(null);
const segWrap = ref<HTMLElement | null>(null);
const head = ref<HTMLElement | null>(null);

const active = ref(0);
const tc = ref(fmt(0));
const valueNow = ref(0);

let sections: HTMLElement[] = [];
let segs: HTMLElement[] = [];
let fills: HTMLElement[] = [];
let bounds = [0];
let frame = 0;
let scrubbing = false;
let resizes: ResizeObserver | undefined;

const maxScroll = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

function measure() {
  const m = maxScroll();
  const docH = document.documentElement.scrollHeight;
  const lead = m > window.innerHeight ? window.innerHeight * 0.35 : 0;
  bounds = sections.map((s, i) => i === 0 ? 0 : Math.min(1, Math.max(0, (s.getBoundingClientRect().top + window.scrollY - lead) / (m > window.innerHeight ? m : docH))));
  bounds.push(1);
  segs.forEach((seg, i) => { seg.style.flex = `${Math.max(0.0001, bounds[i + 1] - bounds[i])} 1 0`; });
  const w = seq.value!.offsetWidth;
  fills.forEach((f, i) => {
    f.style.backgroundSize = `${w}px 100%`;
    f.style.backgroundPosition = `${-segs[i].offsetLeft}px 0`;
  });
  update();
}

function locate(p: number) {
  let i = 0;
  for (let k = 0; k < segs.length; k++) if (p >= bounds[k]) i = k;
  const span = bounds[i + 1] - bounds[i];
  return { i, frac: span > 0 ? Math.min(1, (p - bounds[i]) / span) : 0 };
}

function update() {
  const p = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
  const { i, frac } = locate(p);
  active.value = i;
  fills.forEach((f, k) => { f.style.width = k < i ? '100%' : k === i ? `${frac * 100}%` : '0%'; });
  head.value!.style.left = `${segs[i].offsetLeft + frac * segs[i].offsetWidth}px`;
  tc.value = fmt(p * DURATION);
  valueNow.value = Math.round(p * 100);
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(() => { update(); frame = 0; });
}

function scrubTo(x: number) {
  const r = seq.value!.getBoundingClientRect();
  const px = Math.min(r.width, Math.max(0, x - r.left));
  let i = segs.length - 1;
  for (let k = 0; k < segs.length; k++) if (px < segs[k].offsetLeft + segs[k].offsetWidth + 3) { i = k; break; }
  const frac = Math.min(1, Math.max(0, (px - segs[i].offsetLeft) / segs[i].offsetWidth));
  const p = bounds[i] + frac * (bounds[i + 1] - bounds[i]);
  const root = document.documentElement;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, p * maxScroll());
  root.style.scrollBehavior = '';
}

function onPointerDown(e: PointerEvent) {
  seq.value!.setPointerCapture(e.pointerId);
  scrubTo(e.clientX);
  scrubbing = true;
}

function onPointerMove(e: PointerEvent) {
  if (scrubbing) scrubTo(e.clientX);
}

function onPointerUp() {
  scrubbing = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const { i } = locate(window.scrollY / maxScroll());
  const n = Math.min(sections.length - 1, Math.max(0, i + (e.key === 'ArrowRight' ? 1 : -1)));
  sections[n].scrollIntoView();
}

onMounted(() => {
  sections = SECTIONS.map(s => document.getElementById(s.id)!);
  segs = Array.from(segWrap.value!.children) as HTMLElement[];
  fills = segs.map(s => s.querySelector<HTMLElement>('.seg-fill')!);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  // Section heights also settle later: card transitions, a font swap, another project's text.
  resizes = new ResizeObserver(() => measure());
  resizes.observe(document.querySelector('main')!);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', measure);
  resizes!.disconnect();
});
</script>

<template>
  <header class="bar">
    <a
      class="brand"
      href="#intro"
      :aria-label="`${site.brand}, back to top`"
    >
      <img
        src="/logo.png"
        alt=""
      >
      <span>{{ site.brand }}</span>
    </a>
    <div
      id="seq"
      ref="seq"
      class="seq"
      role="slider"
      tabindex="0"
      aria-label="Page position"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="valueNow"
      :aria-valuetext="SECTIONS[active].label"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @keydown="onKeydown"
    >
      <div
        id="seqSegs"
        ref="segWrap"
        class="seq-segs"
      >
        <div
          v-for="(s, k) in SECTIONS"
          :key="s.id"
          class="seg"
          :class="{ active: k === active, passed: k < active }"
        >
          <span class="seg-label">{{ s.label }}</span>
          <span class="seg-rail"><span class="seg-fill" /></span>
        </div>
      </div>
      <div
        id="seqHead"
        ref="head"
        class="seq-head"
      />
    </div>
    <output
      id="tc"
      class="tc"
      aria-label="Timecode"
      aria-live="off"
    >
      <template
        v-for="(c, k) in tc"
        :key="k"
      >
        <i v-if="c === ':'">{{ c }}</i>
        <b v-else>{{ c }}</b>
      </template>
    </output>
  </header>
</template>

<style scoped>
.bar {
  position: fixed; inset: 0 0 auto; z-index: 50;
  height: var(--bar-h);
  display: flex; align-items: center; gap: clamp(16px, 2.2vw, 32px);
  padding: 0 clamp(16px, 2.4vw, 36px);
  background: rgba(24, 24, 24, .82);
  -webkit-backdrop-filter: blur(16px) saturate(1.2); backdrop-filter: blur(16px) saturate(1.2);
  border-bottom: 1px solid var(--line);
}
.brand { display: flex; align-items: center; gap: 10px; flex: none; text-decoration: none; font-size: 1.0625rem; }
.brand img { width: 30px; height: auto; border-radius: 3px; }
.seq { position: relative; flex: 1; min-width: 0; height: 38px; cursor: ew-resize; touch-action: none; user-select: none; }
.seq:focus-visible { outline-offset: 4px; }
.seq-segs { position: absolute; inset: 0; display: flex; gap: 6px; }
/* flex 1 1 0: equal segments until measure() writes each one's share */
.seg { position: relative; flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 8px; padding-bottom: 8px; }
.seg-label { padding-left: 7px; font-size: .8125rem; line-height: 1; color: #8a8a8d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color .3s; }
.seg.passed .seg-label { color: var(--ink-2); }
.seg.active .seg-label { color: var(--ink); }
.seg-rail { height: 2px; border-radius: 1px; background: rgba(255, 255, 255, .13); overflow: hidden; }
.seg-fill { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--music-a), var(--music-b)) no-repeat; }
.seq-head {
  position: absolute; top: 0; bottom: 3px; left: 0; width: 2px; margin-left: -1px;
  border-radius: 1px; pointer-events: none;
  background: linear-gradient(180deg, var(--music-a), var(--music-b));
}
.seq-head::before { content: ""; position: absolute; top: -3px; left: -4px; width: 10px; height: 10px; border-radius: 50%; background: var(--music-a); }
.tc { flex: none; font-size: .9375rem; color: var(--ink); line-height: 1; }
.tc b { display: inline-block; width: .6em; text-align: center; font-weight: 400; }
.tc i { font-style: normal; color: var(--ink-3); }

@media (max-width: 1100px) {
  .seg-label { font-size: .75rem; }
}

@media (max-width: 760px) {
  .bar { gap: 12px; padding: 0 12px 0 14px; }
  .brand span, .seg-label { display: none; }
  .brand img { width: 26px; }
  .seq { height: 26px; }
  .seq-segs { gap: 3px; }
  .seg { padding-bottom: 12px; }
  .seq-head { bottom: 7px; }
  .tc { font-size: .8125rem; }
}
</style>
