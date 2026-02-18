<template>
  <div class="font-sans text-white">
    <div
      ref="wrapperEl"
      class="w-full h-full flex flex-col"
    >
      <h1 class="text-6xl font-bold p-8 pl-32">
        Some of my work
      </h1>
      <div
        ref="contentEl"
        class="relative w-full h-[90vh] overflow-hidden flex items-end"
      >
        <div
          v-for="project in projects"
          :key="project"
          class="panel absolute bottom-0 left-32 right-32 h-full rounded-3xl bg-[url(/images.jpg)] bg-cover border-4 border-[#303030] overflow-hidden"
        >
          <div class="p-8 backdrop-blur-2xl h-full w-full ">
            <h1 class="text-4xl font-semibold ">
              {{ project }}
            </h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const projects = [1, 2, 3, 4, 5];

const wrapperEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = wrapperEl.value;
  const content = contentEl.value;
  if (!wrapper || !content) return;

  ctx = gsap.context(() => {
    const panels = gsap.utils.toArray<HTMLElement>('.panel', content);
    const totalPanels = panels.length;
    gsap.set(panels.slice(1), { yPercent: 100 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalPanels - 1)}`,
        scrub: true,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    
    panels.slice(1).forEach((panel, i) => {
      tl.to(panel, { yPercent: 0, ease: 'none' }, i);
    });
    ScrollTrigger.refresh();
  }, wrapper);
});

onBeforeUnmount(() => {
  ctx?.revert();
  ctx = null;
});
</script>