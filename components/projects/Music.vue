<template>
  <div
    class="flex gap-4"
    @click="toggleMusic()"
  >
    <div class="relative">
      <img
        :src="'/music' + item?.coverSrc"
        class="h-24 w-24 rounded-md"
      >

      <Icon
        :name=" isPlaying ? 'bi:pause' : 'fe:play'"
        size="40"
        class="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
    <div>
      <p class="text-xl font-bold">
        {{ item?.name }}
      </p>
      <p class="text-[#848484]">
        {{ item?.description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProjectItem } from '../Timeline.vue';
const { playMusic, pauseMusic } = useCurrentProjectStore();
var isPlaying = ref(false);

function toggleMusic() {
  if (isPlaying.value) {
    pauseMusic();
    isPlaying.value = false;
  } else {
    playMusic(props.item);
    isPlaying.value = true;
  }
}

const props = defineProps({
  item: {
    type: null as unknown as PropType<ProjectItem | null>,
    default: () => null
  }
});
</script>