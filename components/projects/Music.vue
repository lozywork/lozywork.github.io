<!--@todo refactor with global fullscren classes-->
<template>
  <div
    v-if="item"
    class="flex gap-4 relative h-full transition-all duration-300"
  >
    <div
      class="h-full flex flex-col gap-8"
      :class="isProjectFullscreen(item.id) ? '' : 'aspect-square'"
    >
      <!-- Track cover and music toggle -->
      <div
        class="relative cursor-pointer"
        :class="isProjectFullscreen(item.id) ? '!h-1/2 aspect-square' : ' h-full w-full'"
        @click="toggleMusic()"
      >
        <img
          :src="'/music' + item.coverSrc"
          class="h-full w-full aspect-square object-cover rounded-md"
        >

        <Icon
          :name="isTrackPlaying(item.id) ? 'mingcute:pause-fill' : 'fe:play'"
          size="40"
          class="!bg-white absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
      <div v-if="isProjectFullscreen(item.id)">
        TODO
      </div>
    </div>

    <!-- Title and description -->
    <div class="overflow-hidden">
      <span class="font-semibold text-xs text-[#848484]">{{ item.date }}</span>
      <p
        class="font-bold truncate max-w-fit"
        :class="isProjectFullscreen(item.id) ? 'text-3xl' : 'text-xl'"
      >
        {{ item.name }}
      </p>
      <p
        class="text-[#848484] overflow-hidden text-ellipsis line-clamp-2"
        :class="isProjectFullscreen(item.id) ? 'text-lg' : ''"
      >
        {{ item.description }}
      </p>
    </div>

    <!-- Fullscreen Toggle -->
    <div
      class="absolute -right-2 -bottom-3 hover:text-[#848484] text-[#303030] cursor-pointer rounded-full w-9 h-9 flex hover:bg-[#303030] transition-all"
      @click="toggleFullScreen(item.id)"
    >
      <Icon
        :name="isProjectFullscreen(item.id) ? 'lucide:shrink' : 'fa6-solid:expand'"
        size="20"
        class="m-auto"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMusicFlow } from 'vue-music-flow';
import type { ProjectItem } from '~/types/project';

const { isTrackPlaying } = useMusicFlow();
const { playMusic, toggleFullScreen, isProjectFullscreen } = useCurrentProjectStore();

function toggleMusic() {
  if (props.item) playMusic(props.item);
}

const props = defineProps({
  item: {
    type: null as unknown as PropType<ProjectItem | null>,
    default: () => null,
  },
});
</script>
