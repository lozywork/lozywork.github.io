<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { site } from '~/data/site';
import { dialAngles } from '~/utils/timeline';
import { reducedMotion } from '~/utils/motion';

const channels = site.contact.filter(c => c.url);
const n = channels.length;
const angles = dialAngles(n);
const rows = Math.ceil(n / 2);

const tvWrapEl = ref<HTMLElement | null>(null);
const tvEl = ref<HTMLElement | null>(null);
const screenEl = ref<HTMLElement | null>(null);
const screenInEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const dialEl = ref<HTMLElement | null>(null);
const dialWrapEl = ref<HTMLElement | null>(null);

// ch moves the dial and the buttons at once; the screen follows halfway through the static.
const ch = ref(1);
const shown = ref(1);
const osd = computed(() => `CH ${shown.value}`);
const staticOn = ref(false);
const copyMsg = ref('');

let reduce = false;
let ctx: CanvasRenderingContext2D;
let noise: ImageData;
let swapTimer: ReturnType<typeof setTimeout> | undefined;
let endTimer: ReturnType<typeof setTimeout> | undefined;
let copyTimer: ReturnType<typeof setTimeout> | undefined;
let raf = 0;
let burstId = 0;
let contactSeen = 0;
let seenIo: IntersectionObserver | undefined;
let warmIo: IntersectionObserver | undefined;
let drag: { cx: number; cy: number; sx: number; sy: number; moved: boolean } | null = null;

function drawNoise(t: number) {
  const W = noise.width, H = noise.height;
  const d = noise.data, band = (t * .35) % (H + 30) - 15;
  for (let y = 0; y < H; y++) {
    const dim = Math.abs(y - band) < 9 ? .45 : 1;
    for (let x = 0; x < W; x++) {
      const v = (Math.random() * 235 * dim) | 0, i = (y * W + x) * 4;
      d[i] = v; d[i + 1] = v; d[i + 2] = Math.min(255, v + 10); d[i + 3] = 255;
    }
  }
  ctx.putImageData(noise, 0, 0);
}

function burst(ms: number, mid: () => void) {
  const id = ++burstId, t0 = performance.now();
  let swapped = false;
  const doSwap = () => { if (!swapped && id === burstId) { swapped = true; mid(); } };
  clearTimeout(swapTimer);
  swapTimer = setTimeout(doSwap, ms * .45);
  staticOn.value = true;
  const loop = (t: number) => {
    if (id !== burstId) return;
    const el = t - t0;
    drawNoise(el);
    if (el >= ms * .45) doSwap();
    if (el < ms) raf = requestAnimationFrame(loop);
    else staticOn.value = false;
  };
  drawNoise(0);
  raf = requestAnimationFrame(loop);
  endTimer = setTimeout(() => { if (id === burstId) { doSwap(); staticOn.value = false; } }, ms + 120);
}

function showChannel() {
  shown.value = ch.value;
  resetCopy();
}

function setChannel(k: number) {
  k = ((k - 1) % n + n) % n + 1;
  if (k === ch.value) return;
  ch.value = k;
  if (reduce) { showChannel(); return; }
  burst(320, showChannel);
}

function channelAt(angle: number) {
  if (n < 2) return 1;
  const lo = angles[0], hi = angles[n - 1];
  return Math.round((Math.max(lo, Math.min(hi, angle)) - lo) / ((hi - lo) / (n - 1))) + 1;
}

function dialDown(e: PointerEvent) {
  if (e.button) return;
  const r = dialWrapEl.value!.getBoundingClientRect();
  drag = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, sx: e.clientX, sy: e.clientY, moved: false };
  dialEl.value!.setPointerCapture(e.pointerId);
}

function dialMove(e: PointerEvent) {
  if (!drag) return;
  if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
  if (!drag.moved) return;
  const a = Math.atan2(e.clientX - drag.cx, drag.cy - e.clientY) * 180 / Math.PI;
  setChannel(channelAt(a));
}

function dialUp() {
  if (!drag) return;
  const { moved } = drag;
  drag = null;
  if (!moved) setChannel(ch.value + 1);
}

function dialClick(e: MouseEvent) {
  if (e.detail === 0) setChannel(ch.value + 1);
}

function onKey(e: KeyboardEvent) {
  if (e.altKey || e.metaKey || e.ctrlKey) return;
  const a = document.activeElement, inTv = tvEl.value!.contains(a);
  if (!inTv && (contactSeen < .25 || (a && a !== document.body && a.closest('[role="slider"], [role="tab"], #row')))) return;
  const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
  if (inTv) { map.ArrowUp = 1; map.ArrowDown = -1; }
  if (e.key in map) { e.preventDefault(); setChannel(ch.value + map[e.key]); }
  else if (/^[1-9]$/.test(e.key) && +e.key <= n) setChannel(+e.key);
}

function resetCopy() {
  clearTimeout(copyTimer);
  copyMsg.value = '';
}

async function copyMail() {
  const text = site.email;
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand('copy'); } catch {}
    ta.remove();
  }
  copyMsg.value = ok ? 'Copied. Paste it into your mail app.' : 'Copy did not work. The address is also printed beside the TV.';
  clearTimeout(copyTimer);
  copyTimer = setTimeout(resetCopy, 2600);
}

onMounted(() => {
  reduce = reducedMotion();
  const canvas = canvasEl.value!;
  ctx = canvas.getContext('2d')!;
  noise = ctx.createImageData(canvas.width, canvas.height);

  seenIo = new IntersectionObserver(([en]) => { contactSeen = en.isIntersecting ? en.intersectionRatio : 0; }, { threshold: [0, .25, .5, .75] });
  seenIo.observe(tvWrapEl.value!.closest('section')!);
  window.addEventListener('keydown', onKey);

  // The tube warms up once, the first time the TV scrolls into view (not when it is already on screen at load).
  const screenIn = screenInEl.value!;
  if (!reduce && 'animate' in screenIn) {
    let first = true;
    warmIo = new IntersectionObserver(([en], io) => {
      const atLoad = first;
      first = false;
      if (!en.isIntersecting) return;
      io.disconnect();
      if (atLoad) return;
      screenIn.animate([
        { transform: 'scale(1, .006)', filter: 'brightness(4)', opacity: .9 },
        { transform: 'scale(1, .006)', filter: 'brightness(4)', opacity: 1, offset: .25 },
        { transform: 'scale(1, 1)', filter: 'brightness(1)', opacity: 1 },
      ], { duration: 700, easing: 'cubic-bezier(.2, .8, .2, 1)' });
    }, { threshold: .6 });
    warmIo.observe(screenEl.value!);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey);
  seenIo?.disconnect();
  warmIo?.disconnect();
  clearTimeout(swapTimer);
  clearTimeout(endTimer);
  clearTimeout(copyTimer);
  cancelAnimationFrame(raf);
});
</script>

<template>
  <div
    ref="tvWrapEl"
    class="tv-wrap"
  >
    <div
      id="tv"
      ref="tvEl"
      class="tv"
      role="group"
      :aria-label="`Television with ${n} contact channels`"
    >
      <div class="bezel">
        <div
          id="screen"
          ref="screenEl"
          class="screen"
        >
          <div
            id="screenIn"
            ref="screenInEl"
            class="screen-in"
            aria-live="polite"
          >
            <div
              v-for="(c, i) in channels"
              :key="c.kind"
              class="chan"
              :data-ch="i + 1"
              :hidden="shown !== i + 1"
            >
              <button
                v-if="c.kind === 'email'"
                id="copyMail"
                class="chan-act"
                type="button"
                @click="copyMail"
              >
                <svg
                  class="chan-ico"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="url(#g-screen)"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="6"
                    y="11"
                    width="36"
                    height="26"
                    rx="4"
                  />
                  <path d="m7 13 17 13 17-13" />
                </svg>
                <span class="chan-big">{{ c.big }}</span>
                <span
                  id="copyNote"
                  class="chan-sub"
                >{{ copyMsg || c.sub }}</span>
              </button>
              <a
                v-else
                class="chan-act"
                :href="c.url"
                target="_blank"
                rel="noopener"
              >
                <svg
                  v-if="c.kind === 'linkedin'"
                  class="chan-ico"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="url(#g-screen)"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  aria-hidden="true"
                >
                  <rect
                    x="7"
                    y="7"
                    width="34"
                    height="34"
                    rx="7"
                  />
                  <path d="M16 21v12M16 15.5v.5M23 33V21M23 26.5c0-3 2-5.5 5-5.5s5 2.2 5 5.5V33" />
                </svg>
                <svg
                  v-else-if="c.kind === 'instagram'"
                  class="chan-ico"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="url(#g-screen)"
                  stroke-width="1.6"
                  aria-hidden="true"
                >
                  <rect
                    x="7"
                    y="7"
                    width="34"
                    height="34"
                    rx="10"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="8"
                  />
                  <circle
                    cx="34"
                    cy="14"
                    r="1.2"
                    fill="url(#g-screen)"
                  />
                </svg>
                <svg
                  v-else
                  class="chan-ico"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="url(#g-screen)"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="11"
                    width="38"
                    height="26"
                    rx="8"
                  />
                  <path d="M21 18v12l10-6Z" />
                </svg>
                <span class="chan-big">{{ c.big }}</span>
                <span class="chan-sub">{{ c.sub }}</span>
              </a>
            </div>
          </div>
          <canvas
            id="static"
            ref="canvasEl"
            class="static"
            :class="{ on: staticOn }"
            width="160"
            height="120"
            aria-hidden="true"
          />
          <div
            id="osd"
            class="osd"
            aria-hidden="true"
          >
            {{ osd }}
          </div>
        </div>
      </div>

      <div class="controls">
        <img
          class="plate"
          src="/logo.png"
          alt=""
        >
        <div
          id="dialWrap"
          ref="dialWrapEl"
          class="dial-wrap"
        >
          <span
            v-for="(c, i) in channels"
            :key="c.kind"
            class="dial-num"
            :class="{ on: ch === i + 1 }"
            :data-ch="i + 1"
            :style="{ '--ang': `${angles[i]}deg` }"
            aria-hidden="true"
            @click="setChannel(i + 1)"
          >{{ i + 1 }}</span>
          <button
            id="dial"
            ref="dialEl"
            class="dial"
            type="button"
            role="slider"
            aria-label="Channel dial"
            aria-valuemin="1"
            :aria-valuemax="n"
            :aria-valuenow="ch"
            :aria-valuetext="`Channel ${ch}, ${channels[ch - 1].label}`"
            :style="{ transform: `rotate(${angles[ch - 1]}deg)` }"
            @pointerdown="dialDown"
            @pointermove="dialMove"
            @pointerup="dialUp"
            @pointercancel="dialUp"
            @click="dialClick"
          />
        </div>
        <div
          class="ch-btns"
          role="group"
          aria-label="Channels"
          :style="{ '--rows': rows }"
        >
          <button
            v-for="(c, i) in channels"
            :key="c.kind"
            class="chb"
            type="button"
            :data-ch="i + 1"
            :aria-pressed="ch === i + 1"
            @click="setChannel(i + 1)"
          >
            <span class="key">{{ i + 1 }}</span><span class="nm">{{ c.label }}</span>
          </button>
        </div>
        <div
          class="grille"
          aria-hidden="true"
        />
      </div>
    </div>
    <div
      class="feet"
      aria-hidden="true"
    >
      <i /><i />
    </div>
  </div>
</template>

<style scoped>
.tv-wrap { grid-area: tv; justify-self: end; width: min(100%, 780px); }
.tv {
  --glow: color-mix(in oklab, var(--music-a) 50%, #fff);
  --glow-a: rgba(168, 85, 247, .5);
  position: relative;
  display: grid; grid-template-columns: minmax(0, 1fr) 150px; gap: 22px;
  padding: 22px; border-radius: 36px;
  background: linear-gradient(160deg, #1c1c1c 0%, #0e0e0e 62%);
  border: 1px solid #2c2c2c;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .06), -60px 60px 140px -70px rgba(168, 85, 247, .28), 60px 60px 140px -70px rgba(251, 146, 60, .2);
}
.bezel { display: flex; border-radius: 26px; padding: 16px; background: #050505; box-shadow: inset 0 0 0 1px #1e1e1e, inset 0 10px 30px rgba(0, 0, 0, .9); }
.screen {
  position: relative; flex: 1; aspect-ratio: 4 / 3; overflow: hidden; isolation: isolate;
  border-radius: 13% / 16%;
  background:
    radial-gradient(ellipse 60% 50% at 78% 84%, rgba(251, 146, 60, .1), transparent 70%),
    radial-gradient(ellipse 78% 72% at 50% 46%, #261c31 0%, #120d18 56%, #050406 100%);
  box-shadow: 0 0 46px rgba(168, 85, 247, .12);
}
.screen::before {
  content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(255, 255, 255, .035) 0 1px, transparent 1px 3px);
}
.screen::after {
  content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background:
    radial-gradient(ellipse 55% 38% at 26% 16%, rgba(255, 255, 255, .08), transparent 70%),
    radial-gradient(ellipse at center, transparent 58%, rgba(0, 0, 0, .65) 100%);
}
.screen-in { position: absolute; inset: 0; transform-origin: 50% 50%; }
.chan { position: absolute; inset: 0; display: flex; }
.chan[hidden] { display: none; }
.chan-act {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
  padding: 10%; text-align: center; text-decoration: none;
  background: none; border: 0; cursor: pointer; border-radius: inherit;
}
.chan-act:focus-visible { outline-offset: -14px; }
.chan-ico { width: 44px; height: 44px; filter: drop-shadow(0 0 8px var(--glow-a)); }
.chan-big { font-size: clamp(1.5rem, 2.5vw, 2.25rem); line-height: 1.1; letter-spacing: -.02em; text-shadow: -6px 0 18px rgba(168, 85, 247, .4), 6px 0 18px rgba(251, 146, 60, .28); overflow-wrap: anywhere; }
.chan-sub { font-size: 15px; color: var(--ink-2); }
.chan-act:hover .chan-sub { color: var(--ink); text-decoration: underline; text-underline-offset: 4px; }
.osd {
  position: absolute; z-index: 5; top: 8%; left: 9%;
  font-size: 15px; letter-spacing: .08em; color: var(--glow);
  text-shadow: 0 0 8px var(--glow-a); pointer-events: none;
}
.static { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; opacity: 0; pointer-events: none; transition: opacity .22s; }
.static.on { opacity: .92; transition: none; }

.controls { display: flex; flex-direction: column; gap: 14px; padding: 4px 0; }
.plate { align-self: center; width: 38px; filter: grayscale(1) contrast(1.15); opacity: .7; }
.dial-wrap { position: relative; align-self: center; width: 124px; height: 124px; flex: none; }
.dial {
  position: absolute; left: 50%; top: 50%;
  width: 74px; height: 74px; margin: -37px 0 0 -37px; padding: 0;
  border-radius: 50%; border: 1px solid #343434;
  background: radial-gradient(circle at 36% 30%, #3a3a3a, #151515 72%);
  box-shadow: 0 8px 18px rgba(0, 0, 0, .7), inset 0 1px 0 rgba(255, 255, 255, .1);
  cursor: grab; touch-action: none;
  transition: transform .45s var(--ease);
}
.dial::before {
  content: ""; position: absolute; left: 50%; top: 9px; bottom: 9px; width: 14px; margin-left: -7px; border-radius: 7px;
  background: linear-gradient(90deg, #232323, #474747 50%, #232323);
}
.dial::after { content: ""; position: absolute; left: 50%; top: 5px; width: 2px; height: 13px; margin-left: -1px; border-radius: 1px; background: var(--ink); }
.dial:active { cursor: grabbing; }
.dial-num {
  position: absolute; left: 50%; top: 50%;
  width: 22px; height: 22px; margin: -11px 0 0 -11px;
  display: grid; place-items: center;
  font-size: 12px; color: var(--ink-3); cursor: pointer;
  transform: rotate(var(--ang)) translateY(-53px) rotate(calc(var(--ang) * -1));
  transition: color .25s;
}
.dial-num.on { color: var(--ink); }
.ch-btns { display: grid; gap: 4px; }
.chb {
  display: grid; grid-template-columns: 30px minmax(0, 1fr); align-items: center; gap: 10px;
  height: 30px; padding: 0 6px; border: 0; border-radius: 8px;
  background: none; cursor: pointer; text-align: left; font-size: 14px; color: var(--ink-2);
  transition: color .2s;
}
.chb:hover { color: var(--ink); }
.key {
  display: grid; place-items: center; width: 30px; height: 22px; border-radius: 5px;
  font-size: 12px; color: var(--ink-3);
  background: #1d1d1d; border: 1px solid #333; box-shadow: 0 2px 0 #050505;
  transition: transform .12s, box-shadow .12s, color .2s;
}
.chb[aria-pressed="true"] { color: var(--ink); }
.chb[aria-pressed="true"] .key { transform: translateY(2px); box-shadow: 0 0 0 #050505, inset 0 1px 3px rgba(0, 0, 0, .7); color: var(--glow); }
.grille { flex: none; height: 34px; margin: auto 6px 4px; border-radius: 4px; background: repeating-linear-gradient(to bottom, #262626 0 2px, transparent 2px 6px); }
.feet { display: flex; justify-content: space-between; padding: 0 14%; }
.feet i { width: 64px; height: 12px; background: #121212; border: 1px solid #262626; border-top: 0; border-radius: 0 0 10px 10px; }
@media (max-width: 1100px) {
  .tv-wrap { justify-self: start; }
}
@media (max-width: 640px) {
  .tv { grid-template-columns: 1fr; padding: 14px; gap: 14px; border-radius: 26px; box-shadow: inset 0 1px 0 rgba(255, 255, 255, .06), -20px 36px 80px -46px rgba(168, 85, 247, .3), 20px 36px 80px -46px rgba(251, 146, 60, .22); }
  .bezel { padding: 10px; border-radius: 18px; }
  .controls { flex-direction: row; align-items: center; gap: 8px; padding: 0 2px; }
  .plate, .grille { display: none; }
  .dial-wrap { width: 92px; height: 92px; align-self: center; }
  .dial { width: 52px; height: 52px; margin: -26px 0 0 -26px; }
  .dial::before { top: 7px; bottom: 7px; width: 10px; margin-left: -5px; }
  .dial-num { font-size: 11px; transform: rotate(var(--ang)) translateY(-39px) rotate(calc(var(--ang) * -1)); }
  .ch-btns { flex: 1; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(var(--rows), auto); grid-auto-flow: column; gap: 4px 6px; }
  .chb { grid-template-columns: 28px minmax(0, 1fr); gap: 8px; height: auto; min-height: 30px; padding: 0 2px; font-size: 13px; }
  .key { width: 28px; height: 20px; }
  .chan-big { font-size: 1.375rem; }
  .chan-ico { width: 34px; height: 34px; }
  .chan-act { gap: 10px; }
  .osd { font-size: 13px; }
  .feet i { width: 44px; }
}
</style>
