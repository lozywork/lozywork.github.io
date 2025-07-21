<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useCurrentProjectStore } from '~/stores/project';

export interface ProjectItem {
  name: string;
  description: string;
  typ: 'music' | 'film';
  src: string;
  coverSrc: string;
}

const props = defineProps({
  height:       { type: Number, default: 600 },
  amplitude:    { type: Number, default: 40 },
  wavelength:   { type: Number, default: 120 },
  dotSpacing:   { type: Number, default: 240 },
  dotSize:      { type: Number, default: 12 },

  boxWidth:     { type: Number, default: 400 },
  boxOffset:    { type: Number, default: 40 },  

  items: {
    type: Array as PropType<ProjectItem[]>,
    default: () => []
  }
});

const topPad    = computed(() => props.dotSize / 2);
const bottomPad = topPad;                               // gleicher Puffer unten

const effectiveHeight = computed(() =>
  props.items.length
    ? (props.items.length - 1) * props.dotSpacing        // genau N‑1 Abstände
    : props.height
);

const svgHeight = computed(() => effectiveHeight.value + topPad.value + bottomPad.value);

const wavePath = computed(() => {
  const seg = Math.max(props.items.length - 1, 1);
  let d = `M 0 ${topPad.value}`;
  for (let i = 0; i < seg; i++) {
    const yStart = topPad.value + i * props.dotSpacing;
    const yMid   = yStart + props.dotSpacing / 2;
    const yEnd   = yStart + props.dotSpacing;
    const dir    = i % 2 === 0 ? props.amplitude : -props.amplitude;
    d += ` Q ${dir} ${yMid} 0 ${yEnd}`;
  }
  return d;
});

const boxes = computed(() =>
  props.items.map((item, i) => ({
    y:    topPad.value + i * props.dotSpacing,
    side: item.typ
      ? (item.typ === 'music' ? 'left' : 'right')
      : (i % 2 === 0 ? 'left' : 'right'),
    item
  }))
);

</script>

<template>
  <div class="relative flex justify-center">
    <!-- Welle -->
    <svg
      :height="svgHeight"
      :viewBox="`-${amplitude} 0 ${amplitude * 2} ${svgHeight}`"
      class="text-[#303030]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        :d="wavePath"
        stroke="currentColor"
        stroke-width="3"
      />
      <!-- Dots -->
      <path
        :d="wavePath"
        stroke="currentColor"
        :stroke-width="dotSize"
        :stroke-dasharray="`0 ${dotSpacing}`"
        :stroke-dashoffset="dotSpacing"
        stroke-linecap="round"
      />

    </svg>

    <!-- Boxen -->
    <div
      v-for="(box, i) in boxes"
      :key="i"
      class="absolute -translate-y-1/2
         w-[var(--box-width)] p-6 rounded-xl text-sm
         bg-[#171717]
         border-2 border-[#303030]
         transition-all
         cursor-pointer"
      :style="{
        '--box-width': `${boxWidth}px`,
        top: `${box.y}px`,
        left: box.side === 'left'
          ? `calc(50% - ${boxOffset}px - ${boxWidth}px)`
          : `calc(50% + ${boxOffset}px)`
      }"
    >
      <ProjectsMusic
        v-if="box.item.typ == 'music'"
        :item="box.item"
      />
      <ProjectsFilm
        v-else
        :item="box.item"
      />
    </div>
  </div>
</template>
