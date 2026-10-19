<script setup lang="ts">
import { site } from '~/data/site';
</script>

<template>
  <section
    id="contact"
    class="sec wrap contact"
    :data-marker="site.sections.contact.marker"
  >
    <div class="contact-grid">
      <div class="contact-copy">
        <h2>{{ site.sections.contact.title }}</h2>
        <p class="pick">
          {{ site.sections.contact.caption }}
        </p>
      </div>
      <p class="plain">
        {{ site.sections.contact.note }}<br><a :href="`mailto:${site.email}`">{{ site.email }}</a>
      </p>

      <ContactTv />
    </div>
  </section>
</template>

<style scoped>
.contact { padding-bottom: clamp(96px, 11vw, 168px); }
.contact-grid {
  display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  grid-template-areas: "copy tv" "plain tv";
  grid-template-rows: auto 1fr;
  gap: 32px 48px; align-items: start;
}
.contact-copy { grid-area: copy; }
.pick { margin-top: 18px; font-size: clamp(1.25rem, 1.8vw, 1.5rem); color: var(--ink-2); }
.plain { grid-area: plain; align-self: end; padding-bottom: 40px; font-size: 15px; color: var(--ink-3); }
.plain a { display: inline-block; margin-top: 6px; font-size: 20px; color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--line-2); padding-bottom: 2px; }
.plain a:hover { border-color: var(--ink); }
@media (max-width: 1100px) {
  .contact-grid { grid-template-columns: 1fr; grid-template-areas: "copy" "tv" "plain"; grid-template-rows: none; }
  .plain { padding-bottom: 0; }
}
</style>
