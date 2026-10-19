<script setup lang="ts">
import { site, TAG_LABEL } from '~/data/site';
</script>

<template>
  <section
    id="about"
    class="sec wrap"
    :data-marker="site.sections.about.marker"
  >
    <div class="sec-head">
      <h2>{{ site.sections.about.title }}</h2>
    </div>
    <div class="about-grid">
      <p class="statement">
        {{ site.about.statement }}
      </p>
      <dl class="facts">
        <div
          v-for="fact in site.about.facts"
          :key="fact.label"
        >
          <dt>{{ fact.label }}</dt>
          <dd>
            <span
              v-if="fact.tags"
              class="tags"
            >
              <span
                v-for="tag in fact.tags"
                :key="tag"
                class="tag"
                :class="`t-${tag}`"
              >{{ TAG_LABEL[tag] }}</span>
            </span>
            <template v-else>
              {{ fact.value }}
            </template>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.about-grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 4fr); gap: clamp(40px, 7vw, 120px); align-items: start; }
.statement { font-size: clamp(1.625rem, 2.6vw, 2.5rem); line-height: 1.22; letter-spacing: -.018em; max-width: 24em; }
.facts > div { display: grid; grid-template-columns: 8rem minmax(0, 1fr); gap: 16px; padding: 18px 0; border-top: 1px solid var(--line); }
.facts > div:last-child { border-bottom: 1px solid var(--line); }
.facts dt { color: var(--ink-3); font-size: .9375rem; padding-top: 2px; }
.facts dd { font-size: 1.0625rem; }

@media (max-width: 760px) {
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .facts > div { grid-template-columns: 7rem minmax(0, 1fr); }
}
</style>
