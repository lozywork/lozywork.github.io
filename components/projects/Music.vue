<template>
  <div
    class="flex gap-4 relative h-full transition-all duration-300"
  >
    <div
      class="relative cursor-pointer"
      :class="fullScreen ? 'h-1/2' : 'h-24 w-24'"
      @click="toggleMusic()"
    >
      <img
        :src="'/music' + item?.coverSrc"
        class="h-full w-full rounded-md"
      >

      <Icon
        :name="isTrackPlaying(item?.id) ? 'mingcute:pause-fill' : 'fe:play'"
        size="40"
        class="!bg-white absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
    <div
      class="absolute -right-2 -bottom-3 hover:text-[#848484] text-[#303030] cursor-pointer rounded-full w-9 h-9 flex hover:bg-[#303030] transition-all"
      @click="toggleFullscreen()"
    >
      <Icon
        :name="fullScreen ? 'lucide:shrink' : 'fa6-solid:expand'"
        size="20"
        class="m-auto"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMusicFlow } from 'vue-music-flow';
import type { ProjectItem } from '~/types/project';
const { onPlaySingleTrack, togglePlayback, isTrackPlaying, returnTrack } = useMusicFlow();
const { playMusic } = useCurrentProjectStore();
const fullScreen = ref(false);

function toggleMusic() {
  playMusic(props.item);
}

const emit = defineEmits<{
  (e: 'toggle-fullscreen'): void
}>();

function toggleFullscreen(  ) {
  fullScreen.value = !fullScreen.value;
  emit('toggle-fullscreen');
}

const props = defineProps({
  item: {
    type: null as unknown as PropType<ProjectItem | null>,
    default: () => null
  }
});
</script>