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
            class="panel group absolute inset-0 mx-32 mb-5 rounded-3xl bg-transparent overflow-hidden cursor-pointer isolate"
            :style="{
              '--color-from': project.colorFrom,
              '--color-to': project.colorTo,
              zIndex: index + 1,
            }"
          >
            <div class="absolute inset-0 rounded-3xl overflow-hidden z-0">              
              <div
                class="gradient-circle absolute rounded-full transition-all duration-1000 ease-in-out will-change-transform"
                :style="{
                  background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})`,
                  width: '600%',
                  height: '600%',
                  top: 'calc(100% - 56px)',
                  left: 'calc(100% - 56px)',
                }"
              />
            </div>

            <div class="absolute inset-[3px] rounded-3xl bg-[#181818] z-[1]" />

            <div class="absolute inset-[3px] rounded-[22px] overflow-hidden z-[2]">
              <img
                :src="project.image"
                :alt="project.name"
                class="w-full h-full object-cover scale-105"
                style="filter: blur(3px) brightness(0.45);"
                loading="lazy"
              >
            </div>

            <div class="absolute top-0 right-0 w-28 h-28 overflow-hidden pointer-events-auto z-[3]">
              <svg
                class="absolute z-20 w-12 h-12 text-white opacity-0 group-hover:opacity-100
                    top-1/2 left-1/2
                    -translate-x-[calc(50%+8px)] -translate-y-[calc(50%-8px)]
                    group-hover:-translate-x-1/2 group-hover:-translate-y-1/2
                    transition-all duration-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line
                  x1="7"
                  y1="17"
                  x2="17"
                  y2="7"
                />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>

            <div class="absolute inset-0 p-8 flex justify-between items-end h-full z-10 pointer-events-none">
              <div class="w-1/3 p-5 pt-6 pb-4 flex flex-col rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-gray-200 self-stretch pointer-events-auto">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    v-for="tag in [...project.tags].sort()"
                    :key="tag"
                    class="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                    :style="{ background: `linear-gradient(90deg, ${getProjectColors([tag]).from}55, ${getProjectColors([tag]).to}55)`, color: getProjectColors([tag]).to }"
                  >
                    {{ tag }}
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

enum TAG {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  THREED = '3D',
}

const TAG_COLORS: Record<
  TAG,
  { from: string; to: string }
> = {
  [TAG.MUSIC]: { from: '#a855f7', to: '#fb923c' },
  [TAG.VIDEO]: { from: '#3b82f6', to: '#06b6d4' },
  [TAG.THREED]:    { from: '#10b981', to: '#84cc16' },
};

const MIXED_TAG_COLOR = {
  from: '#6b7280',
  to: '#111827',
};

function getProjectColors(tags: TAG[]) {
  if (tags.length === 1) {
    return TAG_COLORS[tags[0]];
  }
  return MIXED_TAG_COLOR;
}

const projectsBase = [
  {
    id: 1,
    name: 'Project One',
    subtitle: 'Web Design & Development',
    tags: [TAG.MUSIC],
    image: '/projects/project-1.jpeg',
  },
  {
    id: 2,
    name: 'Project Two',
    subtitle: 'Mobile Application',
    tags: [TAG.VIDEO],
    image: '/images.jpg',
  },
  {
    id: 3,
    name: 'Project Three',
    subtitle: 'Brand Identity',
    tags: [TAG.THREED],
    image: '/images.jpg',
  },
  {
    id: 4,
    name: 'Project Four',
    subtitle: 'UI/UX Research',
    tags: [TAG.MUSIC, TAG.VIDEO],
    image: '/images.jpg',
  },
  {
    id: 5,
    name: 'Project Five',
    subtitle: 'Creative Direction',
    tags: [TAG.VIDEO, TAG.MUSIC],
    image: '/images.jpg',
  },
];

const projects = projectsBase.map(project => ({
  ...project,
  colorFrom: getProjectColors(project.tags).from,
  colorTo: getProjectColors(project.tags).to,
}));

const wrapperEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = wrapperEl.value;
  const content = contentEl.value;
  if (!wrapper || !content) return;

  // Add a small delay to ensure DOM is fully rendered
  setTimeout(() => {
    ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.panel', content);
      const totalPanels = panels.length;

      if (panels.length === 0) return;

      gsap.set(panels.slice(1), { 
        yPercent: 110,
        scale: 1.05
      });

      gsap.set(panels[0], {
        scale: 0.92
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: () => `+=${window.innerHeight * (totalPanels - 1)}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          preventOverlaps: true,
          fastScrollEnd: true,
          refreshPriority: 1,
        },
      });

      panels.slice(1).forEach((panel, i) => {
        const startTime = i;
        const midTime = i + 0.5;
        
        tl.to(panel, { 
          yPercent: 52.5,
          ease: 'none' 
        }, startTime);
        
        tl.to(panel, { 
          yPercent: 0,
          scale: 0.92,
          ease: 'none' 
        }, midTime);
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, wrapper);
  }, 100);

  let resizeTimer: number;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  };

  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimer);
  });
});

onBeforeUnmount(() => {
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
.panel {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.gradient-circle {
  transform: translateZ(0);
}

.group:hover .gradient-circle {
  top: -250% !important;
  left: -250% !important;
}

html {
  scroll-behavior: smooth;
}
</style>