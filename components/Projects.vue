<template>
  <div class="font-sans text-white">
    <div
      ref="wrapperEl"
      class="w-full h-screen flex flex-col"
    >
      <h1 class="text-6xl font-bold p-8 pl-32 tracking-tight shrink-0">
        Some of my <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-300">work</span>
      </h1>

      <div class="relative flex-1 overflow-hidden">
        <div
          ref="contentEl"
          class="absolute inset-0"
        >
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="panel group absolute inset-0 mx-32 mb-5 rounded-3xl overflow-hidden cursor-pointer isolate bg-[#181818]"
            :style="{
              '--color-from': project.colorFrom,
              '--color-to': project.colorTo,
              zIndex: index + 1,
            }"
          >
            <div class="border-shell absolute inset-0 rounded-3xl p-[2px] overflow-hidden z-0">
              <div
                class="absolute inset-0 opacity-30 transition-opacity duration-700 group-hover:opacity-0"
                :style="{ background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})` }"
              />
              <div
                class="border-circle absolute rounded-full transition-all duration-700 ease-in-out"
                :style="{
                  background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})`,
                  width: '300%',
                  height: '300%',
                  top: '100%',
                  left: '100%',
                }"
              />
              <div class="absolute inset-[2px] rounded-3xl bg-[#181818]" />
            </div>

            <div class="absolute inset-[2px] rounded-3xl overflow-hidden z-0">
              <img
                :src="project.image"
                class="w-full h-full object-cover scale-105"
                style="filter: blur(3px) brightness(0.45);"
              >
            </div>

            <div class="absolute top-0 right-0 w-28 h-28 rounded-bl-[50px] overflow-hidden pointer-events-auto z-10">
              <div
                class="absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-700"
                :style="{ background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})` }"
              />
              <div
                class="absolute w-[420px] h-[420px] rounded-full transition-all duration-700 ease-in-out top-full left-full group-hover:top-[-160px] group-hover:left-[-160px]"
                :style="{ background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})` }"
              />
              <svg
                class="absolute z-20 w-12 h-12 text-white opacity-0 group-hover:opacity-100
                    top-1/2 left-1/2
                    -translate-x-[calc(50%+8px)] -translate-y-[calc(50%-8px)]
                    group-hover:-translate-x-1/2 group-hover:-translate-y-1/2
                    transition-all duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>

            <div class="absolute inset-0 p-8 flex justify-between items-end h-full z-10">
              <div class="w-1/3 p-5 pt-6 pb-4 flex flex-col rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-gray-200 self-stretch">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                    :style="{ background: `linear-gradient(90deg, ${project.colorFrom}55, ${project.colorTo}55)`, color: project.colorTo }"
                  >
                    {{ project.tag }}
                  </span>
                </div>
                <span class="text-3xl font-bold leading-tight mt-1">{{ project.name }}</span>
                <span class="text-xs text-gray-400 tracking-widest uppercase mt-1">{{ project.subtitle }}</span>
                <div class="mt-auto flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ String(index + 1).padStart(2, '0') }} / {{ String(projects.length).padStart(2, '0') }}</span>
                  <span class="text-xs text-gray-500">2025</span>
                </div>
              </div>
            </div>
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

const projects = [
  { id: 1, name: 'Project One',   subtitle: 'Web Design & Development', tag: 'WEB', colorFrom: '#a855f7', colorTo: '#fb923c', image: '/projects/project-1.jpeg' },
  { id: 2, name: 'Project Two',   subtitle: 'Mobile Application',       tag: 'APP', colorFrom: '#3b82f6', colorTo: '#06b6d4', image: '/images.jpg' },
  { id: 3, name: 'Project Three', subtitle: 'Brand Identity',            tag: 'ART', colorFrom: '#ec4899', colorTo: '#f43f5e', image: '/images.jpg' },
  { id: 4, name: 'Project Four',  subtitle: 'UI/UX Research',            tag: 'UX',  colorFrom: '#10b981', colorTo: '#84cc16', image: '/images.jpg' },
  { id: 5, name: 'Project Five',  subtitle: 'Creative Direction',        tag: 'DIR', colorFrom: '#f59e0b', colorTo: '#ef4444', image: '/images.jpg' },
];

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

    gsap.set(panels.slice(1), { yPercent: 105 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${window.innerHeight * (totalPanels - 1)}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
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

<style scoped>
.group:hover .border-circle {
  top: -100% !important;
  left: -100% !important;
}
</style>