<template>
  <div class="flex">
    <img
      src="/yt.png"
      class="h-20 w-40"
    >
    <div>
      <p>{{ item?.name }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProjectItem } from '../Timeline.vue';

const props = defineProps({
  item: {
    type: null as unknown as PropType<ProjectItem | null>,
    default: () => null
  }
});
</script>