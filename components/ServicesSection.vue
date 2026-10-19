<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from '~/data/site';
import { useProgramRing, useProjectView } from '~/composables/useSiteLinks';

const { ring } = useProgramRing();
const { reveal } = useProjectView();

// A name in data/site.ts that matches nothing must not break the page.
const cards = site.services.map(service => ({
  ...service,
  project: site.projects.find(p => p.id === service.example),
  tools: service.tools.map(name => ({ name, program: site.programs.find(p => p.name === name) })),
}));

const KEYS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

const active = ref(0);
const btns: (HTMLButtonElement | null)[] = [];
let stacked: MediaQueryList | undefined;
let intent = -1;
let intentTimer: ReturnType<typeof setTimeout> | undefined;
let pinFrame = 0;

// Stacked, the open card above the tapped one collapses; keep the tapped header where it was.
function pin(el: HTMLElement) {
  const top = el.getBoundingClientRect().top;
  const until = performance.now() + 800;
  const frame = () => {
    const d = el.getBoundingClientRect().top - top;
    if (Math.abs(d) > .5) scrollBy({ top: d, behavior: 'instant' });
    pinFrame = performance.now() < until ? requestAnimationFrame(frame) : 0;
  };
  return frame;
}

function open(i: number) {
  if (i === active.value) return;
  const keep = stacked?.matches ? pin(btns[i]!) : null;
  active.value = i;
  if (keep) {
    cancelAnimationFrame(pinFrame);
    nextTick(keep);
  }
}

// Hover opens a card after a short rest, and only on real mouse movement (not when the page scrolls under it).
function hover(e: PointerEvent, k: number) {
  if (e.pointerType !== 'mouse' || stacked?.matches || k === active.value || k === intent) return;
  if (!e.movementX && !e.movementY) return;
  clearTimeout(intentTimer);
  intent = k;
  intentTimer = setTimeout(() => {
    intent = -1;
    open(k);
  }, 90);
}

function leave(k: number) {
  if (intent !== k) return;
  clearTimeout(intentTimer);
  intent = -1;
}

function onKey(e: KeyboardEvent, k: number) {
  let n: number;
  if (e.key in KEYS) n = (k + KEYS[e.key] + cards.length) % cards.length;
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = cards.length - 1;
  else return;
  e.preventDefault();
  e.stopPropagation();
  btns[n]!.focus();
  open(n);
}

onMounted(() => {
  stacked = matchMedia('(max-width: 900px)');
  if (stacked.matches) active.value = -1;
});

onBeforeUnmount(() => {
  clearTimeout(intentTimer);
  cancelAnimationFrame(pinFrame);
});
</script>

<template>
  <section
    id="services"
    class="sec wrap"
    :data-marker="site.sections.services.marker"
  >
    <div class="sec-head">
      <div>
        <h2>{{ site.sections.services.title }}</h2>
        <p class="cap">
          {{ site.sections.services.caption }}
        </p>
      </div>
    </div>
    <ul
      id="svcRow"
      class="svc-row"
      :style="{ '--n': cards.length }"
    >
      <li
        v-for="(card, i) in cards"
        :key="card.title"
        class="svc-card"
        :class="[`t-${card.tone}`, { on: i === active }]"
        @pointermove="hover($event, i)"
        @pointerleave="leave(i)"
      >
        <img
          v-if="card.project"
          class="svc-bg"
          :src="card.project.image"
          alt=""
          :style="{ '--pos': card.bgPos }"
        >
        <span
          class="svc-plus"
          aria-hidden="true"
        />
        <span
          class="svc-vert"
          aria-hidden="true"
        >{{ card.title }}</span>
        <div class="svc-inner">
          <h3 class="svc-h">
            <button
              :id="`svc-b${i + 1}`"
              :ref="el => { btns[i] = el as HTMLButtonElement | null; }"
              class="svc-btn"
              type="button"
              :aria-expanded="i === active"
              :aria-controls="`svc-p${i + 1}`"
              @click="open(i)"
              @keydown="onKey($event, i)"
            >
              <span class="svc-title">{{ card.title }}</span>
            </button>
          </h3>
          <div
            :id="`svc-p${i + 1}`"
            class="svc-panel"
            role="region"
            :aria-labelledby="`svc-b${i + 1}`"
            :inert="i !== active || undefined"
          >
            <div class="svc-clip">
              <div class="svc-open">
                <div
                  v-if="card.what"
                  class="svc-what"
                >
                  <p class="svc-label">
                    What I do
                  </p>
                  <p class="svc-lede">
                    {{ card.what }}
                  </p>
                </div>
                <div class="svc-tools">
                  <p class="svc-label">
                    Tools
                  </p>
                  <ul class="svc-tool-list">
                    <li
                      v-for="tool in card.tools"
                      :key="tool.name"
                    >
                      <button
                        v-if="tool.program"
                        class="svc-tool"
                        type="button"
                        :data-tool="tool.name"
                        @click="ring(tool.name, $event.detail === 0)"
                      >
                        <ProgramIcon
                          :icon="tool.program.icon"
                          :tone="tool.program.tone"
                          chip
                        />{{ tool.name }}<span class="sr-only">, show in {{ site.sections.programs.title }}</span>
                      </button>
                      <span
                        v-else
                        class="svc-tool plain"
                      >{{ tool.name }}</span>
                    </li>
                  </ul>
                </div>
                <button
                  v-if="card.project"
                  class="svc-ex"
                  type="button"
                  :data-project="card.project.id"
                  :aria-label="`Example project: ${card.project.name}. Show it in ${site.sections.projects.title}.`"
                  @click="reveal(card.project.id, $event.detail === 0)"
                >
                  <span class="svc-ex-img"><img
                    :src="card.project.image"
                    alt=""
                  ><span class="svc-ex-go">Show in projects</span></span>
                  <span class="svc-ex-name">{{ card.project.name }}</span>
                  <span class="svc-ex-kind">Example project</span>
                </button>
                <div
                  v-if="card.steps?.length"
                  class="svc-how"
                >
                  <p class="svc-label">
                    How I work
                  </p>
                  <ol
                    class="svc-steps"
                    :style="{ '--steps': card.steps.length }"
                  >
                    <li
                      v-for="(step, j) in card.steps"
                      :key="j"
                      class="svc-step"
                      :style="{ '--t': j / (card.steps.length - 1) }"
                    >
                      <span class="svc-step-t"><span class="svc-n">{{ j + 1 }}</span>{{ step.title }}</span>
                      <span class="svc-step-d">{{ step.text }}</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
#services { --strip: 88px; --svc-gap: 12px; }
.svc-row { display: flex; gap: var(--svc-gap); container-type: inline-size; }
.svc-card {
  position: relative; flex: 0 0 var(--strip); min-width: 0; overflow: clip;
  border-radius: 24px; background: var(--raise); box-shadow: inset 0 0 0 1px var(--line);
  transition: flex-grow .7s var(--ease), flex-basis .7s var(--ease);
}
.svc-card.on { flex: 1 1 0; }
.svc-card::before {
  content: ""; position: absolute; z-index: 1; left: 0; top: 0; bottom: 0; width: 3px; pointer-events: none;
  background: linear-gradient(180deg, var(--a), var(--b));
}
.svc-bg {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: var(--pos, 50% 50%);
  filter: grayscale(1) brightness(.6); opacity: .16; pointer-events: none; transition: opacity .5s;
}
.svc-card.on .svc-bg { opacity: 0; }
.svc-vert {
  position: absolute; z-index: 1; left: 50%; bottom: 30px; pointer-events: none;
  writing-mode: vertical-rl; transform: translateX(-50%) rotate(180deg);
  white-space: nowrap; font-size: 1.125rem; line-height: 1; transition: opacity .3s .3s;
}
.svc-plus {
  position: absolute; z-index: 1; top: 22px; left: 50%; width: 32px; height: 32px; margin-left: -16px; pointer-events: none;
  border-radius: 50%; border: 1px solid var(--line-2); transition: opacity .3s .3s, border-color .2s;
}
.svc-plus::before, .svc-plus::after { content: ""; position: absolute; left: 50%; top: 50%; width: 12px; height: 1.5px; margin: -.75px 0 0 -6px; border-radius: 1px; background: var(--ink); }
.svc-plus::after { transform: rotate(90deg); }
.svc-card.on .svc-vert, .svc-card.on .svc-plus { opacity: 0; transition: opacity .15s; }
@media (hover: hover) {
  .svc-card:not(.on):hover .svc-bg { opacity: .32; }
  .svc-card:not(.on):hover .svc-plus { border-color: var(--ink); }
}

.svc-inner { width: calc(100cqw - (var(--n) - 1) * (var(--strip) + var(--svc-gap))); padding: 40px 44px 44px 48px; }
.svc-h { margin-bottom: 30px; }
.svc-btn { display: block; max-width: 100%; padding: 0; border: 0; background: none; text-align: left; cursor: pointer; }
.svc-card.on .svc-btn { cursor: default; }
.svc-title { display: block; font-size: clamp(1.75rem, 2.4vw, 2.375rem); line-height: 1.08; letter-spacing: -.022em; opacity: 0; transition: opacity .15s; }
.svc-card.on .svc-title { opacity: 1; transition: opacity .45s .22s; }
.svc-card:not(.on) .svc-btn::after { content: ""; position: absolute; inset: 0; z-index: 3; border-radius: 24px; }
.svc-card:not(.on) .svc-btn:focus-visible { outline: none; }
.svc-card:not(.on) .svc-btn:focus-visible::after { outline: 2px solid var(--ink); outline-offset: -5px; }

.svc-panel { display: grid; grid-template-rows: 1fr; container-type: inline-size; }
.svc-clip { min-height: 0; }
.svc-open {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .8fr);
  grid-template-areas: "what ex" "tools ex" "how how"; grid-template-rows: auto 1fr auto;
  gap: 0 56px; opacity: 0; transition: opacity .15s;
}
.svc-card.on .svc-open { opacity: 1; transition: opacity .45s .25s; }
.svc-label { display: block; margin-bottom: 10px; font-size: .875rem; color: var(--ink-3); }
.svc-what { grid-area: what; }
.svc-lede { font-size: 1.1875rem; line-height: 1.5; max-width: 30em; }
.svc-tools { grid-area: tools; align-self: end; padding-top: 28px; }
.svc-tool-list { display: flex; flex-wrap: wrap; gap: 8px; }
.svc-tool {
  display: inline-flex; align-items: center; gap: 9px; min-height: 38px; padding: 0 16px 0 12px;
  border-radius: 999px; border: 1px solid var(--line-2); background: transparent;
  font-size: .9375rem; cursor: pointer; transition: border-color .2s, background .2s;
}
.svc-tool svg { width: 18px; height: 18px; flex: none; }
.svc-tool:hover { border-color: var(--ink-2); background: rgba(255, 255, 255, .03); }
.svc-tool.plain, .svc-tool.plain:hover { padding: 0 16px; border-color: var(--line-2); background: transparent; cursor: default; }

.svc-ex { grid-area: ex; display: block; width: 100%; padding: 0; border: 0; background: none; text-align: left; cursor: pointer; border-radius: 16px; }
.svc-ex-img { position: relative; display: block; aspect-ratio: 16 / 10; border-radius: 16px; overflow: hidden; background: #000; }
.svc-ex-img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(.82); transform: scale(1.04); transition: filter .9s ease, transform 1.1s var(--ease); }
.svc-card.on .svc-ex-img img { filter: none; transform: none; transition-delay: .3s; }
.svc-ex:focus-visible .svc-ex-img img { transform: scale(1.03); transition-delay: 0s; }
.svc-ex-go {
  position: absolute; left: 12px; bottom: 12px; height: 32px; padding: 0 13px; border-radius: 999px;
  display: inline-flex; align-items: center; font-size: .875rem;
  background: rgba(24, 24, 24, .8); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
  opacity: 0; transform: translateY(4px); transition: opacity .25s, transform .25s;
}
.svc-ex:focus-visible .svc-ex-go { opacity: 1; transform: none; }
@media (hover: hover) {
  .svc-card.on .svc-ex:hover .svc-ex-img img { transform: scale(1.03); transition-delay: 0s; }
  .svc-ex:hover .svc-ex-go { opacity: 1; transform: none; }
}
.svc-ex-name { display: block; margin-top: 14px; font-size: 1.0625rem; line-height: 1.3; }
.svc-ex-kind { display: block; margin-top: 2px; font-size: .875rem; color: var(--ink-3); }

.svc-how { grid-area: how; margin-top: 44px; }
.svc-steps { position: relative; display: grid; grid-template-columns: repeat(var(--steps), minmax(0, 1fr)); gap: 0 32px; }
.svc-steps::before { content: ""; position: absolute; left: 0; right: 0; top: 4px; height: 1px; background: var(--line-2); }
.svc-step { position: relative; padding-top: 26px; }
.svc-step::before {
  content: ""; position: absolute; left: 0; top: 0; width: 9px; height: 9px; border-radius: 50%;
  background: color-mix(in oklab, var(--a), var(--b) calc(var(--t) * 100%)); box-shadow: 0 0 0 5px var(--raise);
}
.svc-step-t { display: block; font-size: 1rem; line-height: 1.3; }
.svc-n { margin-right: 8px; color: var(--ink-3); }
.svc-step-d { display: block; margin-top: 6px; font-size: .9375rem; line-height: 1.45; color: var(--ink-2); }

@container (max-width: 680px) {
  .svc-open { grid-template-columns: minmax(0, 1fr); grid-template-areas: "what" "ex" "how" "tools"; grid-template-rows: none; }
  .svc-ex { margin-top: 28px; }
  .svc-how { margin-top: 36px; }
  .svc-steps { grid-template-columns: minmax(0, 1fr); gap: 18px; }
  .svc-steps::before { left: 4px; right: auto; top: 6px; bottom: 6px; width: 1px; height: auto; }
  .svc-step { padding: 0 0 0 28px; }
  .svc-step::before { top: 6px; }
}

@media (min-width: 901px) {
  @container (max-width: 680px) {
    .svc-open { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: "what what" "tools ex" "how how"; gap: 0 32px; }
    .svc-ex { margin-top: 28px; }
    .svc-how { margin-top: 40px; }
    .svc-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 32px; }
    .svc-steps::before { display: none; }
    .svc-step { padding: 26px 0 0; }
    .svc-step::before { top: 0; z-index: 1; }
    .svc-step::after { content: ""; position: absolute; left: 0; right: 0; top: 4px; height: 1px; background: var(--line-2); }
    .svc-step:nth-child(odd):not(:last-child)::after { right: -32px; }
  }
}

@media (max-width: 1100px) { #services { --strip: 72px; } .svc-vert { font-size: 1rem; } }
@media (max-width: 900px) {
  .svc-row { flex-direction: column; gap: 10px; }
  .svc-card, .svc-card.on { flex: none; border-radius: 18px; }
  .svc-card:not(.on) .svc-btn::after { border-radius: 18px; }
  .svc-vert, .svc-bg { display: none; }
  .svc-inner { width: auto; padding: 0; }
  .svc-h { margin: 0; }
  .svc-btn { width: 100%; max-width: none; padding: 21px 68px 21px 26px; }
  .svc-title, .svc-card.on .svc-title { opacity: 1; font-size: 1.25rem; line-height: 1.25; letter-spacing: -.01em; transition: none; }
  .svc-plus { top: 50%; left: auto; right: 16px; margin: -16px 0 0; }
  .svc-card.on .svc-plus { top: 32px; }
  .svc-panel { grid-template-rows: 0fr; transition: grid-template-rows .55s var(--ease); }
  .svc-card.on .svc-panel { grid-template-rows: 1fr; }
  .svc-clip { overflow: clip; }
  .svc-open { padding: 4px 22px 28px 26px; }
  .svc-lede { font-size: 1.0625rem; }
}
</style>
