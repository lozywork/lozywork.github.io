<template>
  <div
    v-if="item"
    class="flex gap-4 relative h-full transition-all duration-300"
  >
    <img
      src="/yt.png"
      :class="isProjectFullscreen(item.id) ? 'h-2/3' : 'h-full'"
    >
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
import type { ProjectItem } from '~/types/project';

const { isProjectFullscreen, toggleFullScreen } = useCurrentProjectStore();

const props = defineProps({
  item: {
    type: null as unknown as PropType<ProjectItem | null>,
    default: () => null,
  },
});
</script>
