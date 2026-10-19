<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { site, TAG_LABEL, type Tag } from '~/data/site';
import { shows, useProjectView, type ProjectFilter } from '~/composables/useSiteLinks';
import { reducedMotion } from '~/utils/motion';

const { current, filter, revealed } = useProjectView();

const FILTER_TAGS: Tag[] = ['video', 'music', '3d'];
const chips: { key: ProjectFilter; label: string; n: number }[] = [
  { key: 'all', label: 'All', n: site.projects.length },
  ...FILTER_TAGS
    .map(tag => ({ key: tag, label: TAG_LABEL[tag], n: site.projects.filter(p => p.tags.includes(tag)).length }))
    .filter(chip => chip.n > 0),
];

const project = computed(() => site.projects.find(p => p.id === current.value)!);

// Invisible copies of every project's text keep the box at the tallest one's height, so the
// strip below stays put when another project is picked.
const views = computed(() => [
  { key: 'live', p: project.value, sizer: false },
  ...site.projects.map(p => ({ key: p.id, p, sizer: true })),
]);

// Fewest rows under each column cap, then as few columns as those rows need: 6 projects make 3 + 3.
// A single row keeps the cap, so a few thumbnails keep their size.
const cols = (max: number) => {
  const n = site.projects.length;
  return n <= max ? max : Math.ceil(n / Math.ceil(n / max));
};

const kind = (tags: Tag[]) =>
  tags.map((tag, i) => (i === 0 || tag === '3d' ? TAG_LABEL[tag] : TAG_LABEL[tag].toLowerCase())).join(', ');

const viewer = ref<HTMLElement | null>(null);
const img = ref<HTMLImageElement | null>(null);
let reduce = false;
let frame = 0;

const scrollToViewer = (focus: boolean) => {
  const el = viewer.value!;
  el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  if (!focus) return;
  el.tabIndex = -1;
  el.focus({ preventScroll: true });
};

function pick(id: string, e: MouseEvent) {
  current.value = id;
  if (matchMedia('(max-width: 1080px)').matches) scrollToViewer(e.detail === 0);
}

function setFilter(f: ProjectFilter) {
  filter.value = f;
  const shown = site.projects.filter(p => shows(p, f));
  if (!shown.some(p => p.id === current.value)) current.value = shown[0].id;
}

// A pre-flush watcher runs before Vue patches src; reading offsetWidth commits opacity 0, so the fade starts there.
watch(current, () => {
  if (reduce) return;
  const el = img.value!;
  el.classList.add('swap');
  void el.offsetWidth;
  frame = requestAnimationFrame(() => el.classList.remove('swap'));
});

watch(revealed, async (r) => {
  await nextTick();
  scrollToViewer(r.focus);
});

onMounted(() => {
  reduce = reducedMotion();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
});
</script>

<template>
  <section
    id="projects"
    class="sec wrap"
    :data-marker="site.sections.projects.marker"
  >
    <div class="sec-head">
      <div>
        <h2>{{ site.sections.projects.title }}</h2>
        <p class="cap">
          {{ site.sections.projects.caption }}
        </p>
      </div>
    </div>

    <div class="mb">
      <div
        id="viewer"
        ref="viewer"
        class="viewer"
      >
        <img
          id="pvImg"
          ref="img"
          :src="project.image"
          :alt="project.name"
        >
      </div>
      <div class="insp-cell">
        <div
          v-for="v in views"
          :key="v.key"
          class="insp"
          :class="{ sizer: v.sizer }"
          :aria-live="v.sizer ? undefined : 'polite'"
        >
          <div class="tags">
            <span
              v-for="tag in v.p.tags"
              :key="tag"
              class="tag"
              :class="`t-${tag}`"
            >{{ TAG_LABEL[tag] }}</span>
          </div>
          <h3>{{ v.p.name }}</h3>
          <p class="pv-sub">
            {{ v.p.subtitle }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-for="(para, k) in v.p.description"
            :key="k"
            class="pv-desc"
            v-html="para"
          />
          <!-- eslint-enable vue/no-v-html -->
          <dl class="pv-meta">
            <dt>Made with</dt>
            <dd>{{ v.p.tools }}</dd>
            <dt>Year</dt>
            <dd>{{ v.p.year }}</dd>
          </dl>
          <div class="pv-link">
            <a
              class="btn"
              :href="v.p.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              ><path d="M4 2.5v11l9-5.5Z" /></svg>
              <span>Watch on {{ v.p.where }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      class="chips"
      role="group"
      aria-label="Filter projects"
    >
      <button
        v-for="chip in chips"
        :key="chip.key"
        class="chip"
        :class="chip.key === 'all' ? undefined : `t-${chip.key}`"
        type="button"
        :data-filter="chip.key"
        :aria-pressed="filter === chip.key"
        @click="setFilter(chip.key)"
      >
        <span
          v-if="chip.key !== 'all'"
          class="dot"
          aria-hidden="true"
        />{{ chip.label }} <span class="n">{{ chip.n }}</span>
      </button>
    </div>

    <ul
      id="strip"
      class="strip"
      aria-label="Projects"
      :style="{ '--cols-l': cols(5), '--cols-m': cols(3), '--cols-s': cols(2) }"
    >
      <li
        v-for="(p, i) in site.projects"
        :key="p.id"
        :class="`t-${p.tags[0]}`"
        :hidden="!shows(p, filter)"
        :aria-current="p.id === current"
        :data-tags="p.tags.join(' ')"
      >
        <button
          type="button"
          :data-i="i"
          @click="pick(p.id, $event)"
        >
          <span class="thumb"><span class="thumb-in"><img
            :src="p.image"
            alt=""
          ></span></span>
          <span class="s-name">{{ p.name }}</span> <span class="s-kind">{{ kind(p.tags) }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.mb { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 400px); background: var(--raise); border: 1px solid var(--line); border-radius: 28px; overflow: hidden; }
.viewer { position: relative; aspect-ratio: 16 / 9; background: #000; }
.viewer img { width: 100%; height: 100%; object-fit: cover; transition: opacity .35s; }
.viewer img.swap { opacity: 0; transition: none; }
/* .mb clips everything outside the viewer, so its ring goes inside. */
.viewer:focus-visible { outline-offset: -10px; border-radius: 0; }
.insp-cell { display: grid; }
.insp-cell > .insp { grid-area: 1 / 1; }
.insp.sizer { visibility: hidden; }
.insp { padding: 32px 32px 30px; display: flex; flex-direction: column; }
.insp h3 { margin-top: 18px; font-size: clamp(26px, 2.3vw, 34px); line-height: 1.08; letter-spacing: -.02em; }
.pv-sub { margin-top: 10px; color: var(--ink-2); font-size: 17px; line-height: 1.4; }
.pv-desc { margin-top: 16px; font-size: 16px; line-height: 1.55; color: #cfcfcf; }
/* The font has one weight: emphasis by colour, not a synthesized bold. */
.pv-desc :deep(strong) { font-weight: 400; color: var(--ink); }
.pv-meta { margin: 20px 0 0; display: grid; grid-template-columns: auto 1fr; gap: 6px 18px; font-size: 15px; }
.pv-meta dt { color: var(--ink-3); }
.pv-link { margin-top: auto; padding-top: 24px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin: 44px 0 26px; }
.chip {
  height: 42px; padding: 0 18px; border-radius: 999px; border: 1px solid var(--line-2); background: transparent;
  display: inline-flex; align-items: center; gap: 10px; font-size: 1rem; cursor: pointer;
  transition: background .2s, color .2s, border-color .2s;
}
.chip:hover { border-color: var(--ink-2); }
.chip .n { color: var(--ink-3); }
.chip[aria-pressed="true"] { background: var(--ink); color: #181818; border-color: var(--ink); }
.chip[aria-pressed="true"] .n { color: #6f6f6f; }
.strip { display: grid; grid-template-columns: repeat(var(--cols-l), minmax(0, 1fr)); gap: 22px; }
.strip li[hidden] { display: none; }
.strip button { display: block; width: 100%; padding: 0; border: 0; background: none; text-align: left; cursor: pointer; border-radius: 12px; }
.thumb { position: relative; display: block; }
.thumb::before {
  content: ""; position: absolute; inset: -5px; border-radius: 16px; padding: 2px;
  background: linear-gradient(90deg, var(--a), var(--b));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: 0; transition: opacity .25s;
}
.thumb-in { display: block; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #000; }
.thumb-in img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) brightness(.82); transition: filter .5s, transform .9s var(--ease); }
.strip button:focus-visible .thumb-in img { filter: none; transform: scale(1.02); }
@media (hover: hover) { .strip button:hover .thumb-in img { filter: none; transform: scale(1.02); } }
.strip li[aria-current="true"] .thumb::before { opacity: 1; }
.strip li[aria-current="true"] .thumb-in img { filter: none; }
.s-name { display: block; margin-top: 12px; font-size: 16px; line-height: 1.25; }
.s-kind { display: block; margin-top: 2px; font-size: 14px; color: var(--ink-3); }
@media (min-width: 1081px) {
  .viewer { aspect-ratio: auto; display: grid; align-items: center; }
  .viewer img { height: auto; aspect-ratio: 16 / 9; }
}
@media (max-width: 1080px) {
  .mb { grid-template-columns: 1fr; }
  .insp.sizer { display: none; }
  .strip { grid-template-columns: repeat(var(--cols-m), minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .insp { padding: 24px 20px 22px; }
  .strip { grid-template-columns: repeat(var(--cols-s), minmax(0, 1fr)); gap: 18px 14px; }
  .s-name { font-size: 15px; margin-top: 10px; }
}
</style>
