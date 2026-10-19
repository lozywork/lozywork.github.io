<script setup lang="ts">
import { computed } from 'vue';
import { site } from '~/data/site';
import { useToday } from '~/composables/useToday';

const today = useToday();
const year = computed(() => today.value.slice(0, 4));
</script>

<template>
  <footer class="foot">
    <div class="foot-id">
      <img
        src="/logo.png"
        alt="Lozy Work logo"
      >
      <span>© {{ year }} {{ site.name }}, {{ site.brand }}</span>
    </div>
    <a href="#intro">Back to top</a>
  </footer>
</template>

<style scoped>
.foot { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 28px var(--edge) 72px; border-top: 1px solid var(--line); font-size: .875rem; color: var(--ink-3); }
.foot-id { display: flex; align-items: center; gap: 14px; }
.foot img { width: 34px; height: auto; border-radius: 3px; }
.foot a { color: var(--ink-2); text-underline-offset: 3px; }

@media (max-width: 760px) {
  .foot { padding-bottom: 64px; }
}
</style>
