<!-- eslint-disable vue/no-v-html -->
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
            :style="{ '--color-from': project.colorFrom, '--color-to': project.colorTo, zIndex: index + 1 }"
          >
            <!-- Gradient border glow — moves from bottom-right to top-left on hover -->
            <div class="absolute inset-0 rounded-3xl overflow-hidden z-0">
              <div
                class="gradient-circle absolute rounded-full transition-[top,left] duration-700 ease-out will-change-transform"
                :style="{
                  background: `linear-gradient(135deg, ${project.colorFrom}, ${project.colorTo})`,
                  width: '600%',
                  height: '600%',
                  top: 'calc(100% - 56px)',
                  left: 'calc(100% - 56px)',
                }"
              />
            </div>

            <!-- Dark inset background sitting above the glow -->
            <div class="absolute inset-[3px] rounded-3xl bg-[#181818] z-[1]" />

            <!-- Project image -->
            <div class="absolute inset-[3px] rounded-[22px] overflow-hidden z-[2]">
              <img
                :src="project.image"
                :alt="project.name"
                class="w-full h-full object-cover scale-105"
                style="filter: brightness(0.45);"
                loading="lazy"
              >
            </div>

            <!-- Arrow icon shown on hover -->
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

            <!-- Project info card -->
            <div class="absolute inset-0 p-8 flex justify-between items-end h-full z-10 pointer-events-none">
              <div class="w-1/2 p-5 pt-6 pb-4 flex flex-col rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-gray-200 self-stretch pointer-events-auto">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    v-for="tag in [...project.tags].sort()"
                    :key="tag"
                    class="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                    :style="{
                      background: `linear-gradient(90deg, ${getProjectColors([tag]).from}55, ${getProjectColors([tag]).to}55)`,
                      color: getProjectColors([tag]).to,
                    }"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="text-3xl font-bold leading-tight mt-1">{{ project.name }}</span>
                <span class="text-xs text-gray-400 tracking-widest uppercase mt-1">{{ project.subtitle }}</span>
                <span
                  class="text-lg mt-3 whitespace-pre-line text-gray-400"
                  v-html="project.description"
                />
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

// ─── Types & Constants ────────────────────────────────────────────────────────

enum TAG {
  MUSIC = 'MUSIC',
  VIDEO = 'VIDEO',
  THREED = '3D',
}

const TAG_COLORS: Record<TAG, { from: string; to: string }> = {
  [TAG.MUSIC]:  { from: '#a855f7', to: '#fb923c' },
  [TAG.VIDEO]:  { from: '#3b82f6', to: '#06b6d4' },
  [TAG.THREED]: { from: '#10b981', to: '#84cc16' },
};

// Fallback color used when a project has multiple tags
const MIXED_TAG_COLOR = { from: '#6b7280', to: '#111827' };

function getProjectColors(tags: TAG[]) {
  return tags.length === 1 ? TAG_COLORS[tags[0]] : MIXED_TAG_COLOR;
}

// ─── Project Data ─────────────────────────────────────────────────────────────

const projectsBase = [
  {
    id: 1,
    name: 'NBA 2K x E-40 Remix',
    subtitle: 'A high-energy "Promo Edit" combining custom beat production with fast-paced basketball highlights.',
    description: 'For this project, a friend and I entered the official <strong>NBA 2K x E-40 Remix Challenge</strong>. We engineered the beat in <strong>Logic Pro</strong> to hit hard and stay catchy, taking inspiration from the iconic 2K soundtracks.\n\n To promote the track, I used <strong>Final Cut Pro</strong> to create a rhythmic edit. I synced top-tier NBA plays to our custom transitions and bass drops, ensuring the visual energy matched the audio\'s intensity.',
    tags: [TAG.MUSIC, TAG.VIDEO],
    image: '/projects/nba_remix_challenge.jpg',
  },
  {
    id: 2,
    name: 'Saquon Barkley: 2K Royalty',
    subtitle: 'A high-energy sports tribute edit celebrating Saquon Barkley\'s historic 2024 MVP-caliber season and the Eagles\' Super Bowl victory.',
    description: 'Inspired by the wave of NFL edits during the 2024 season, I wanted to create a definitive tribute to Saquon Barkley\'s record-breaking year. After he surpassed 2,000 rushing yards and secured Offensive Player of the Year honors, I gathered the best game film to showcase his explosiveness.\n\nUsing <strong>Final Cut Pro</strong>, I moved beyond simple cutting and focused heavily on custom visual filters and color grading to give the footage a cinematic, "premium" feel. To ensure the edit was 100% unique, I produced an <strong>original beat</strong> specifically for this video, allowing me to time every move to the rhythm of my own music.',
    tags: [TAG.MUSIC, TAG.VIDEO],
    image: '/projects/barkley_edit.png',
  },
  {
    id: 3,
    name: 'To Become a Warrior: A Matura Film Study',
    subtitle: 'A 10-minute documentary and theoretical thesis exploring how "Film Language" influences an audience and can be used as propaganda.',
    description: 'While sidelined by an injury with the <strong>Winterthur Warriors</strong> American Football team, I turned my recovery time into a creative deep dive. I spent months researching the psychology of cinema before putting my theories to the test. I handled every stage of production: writing the script, capturing live-action footage during games and training sessions, and managing the full edit and post-production in <strong>Final Cut Pro</strong>.\n\nTo achieve a professional narrative feel, I directed a voiceover session in <strong>Logic Pro</strong>, collaborating with a voice actor to bring the script to life. This was my first "one-man crew" experience, forcing me to master scriptwriting and cinematography from scratch while rapidly advancing my technical post-production skills.',
    tags: [TAG.MUSIC, TAG.VIDEO],
    image: '/projects/maturaarbeit.png',
  },
  {
    id: 4,
    name: 'The Retro Tube: 3D Animation',
    subtitle: 'A stylized 3D animation of an "old school" vintage television, designed to serve as a custom intro for my YouTube channel.',
    description: 'Inspiration struck when I saw a vintage metal sign featuring a classic TV set. I decided to recreate that aesthetic in 3D space using <strong>Blender</strong>. Since this was my first real dive into the software, I had to learn the fundamentals of 3D modeling from the ground up—shaping the geometry of the TV and experimenting with lighting to capture that nostalgic, retro glow.\n\n<strong>The Challenge:</strong> As a beginner, the biggest hurdle was understanding <strong>Materials and Texturing</strong>. Learning how to make plastic look like plastic and glass look like a screen—while also managing the keyframes for the animation—was a massive "level-up" moment for my technical skills.',
    tags: [TAG.THREED],
    image: '/projects/old_school_tv.png',
  },
  {
    id: 5,
    name: 'Project Five',
    subtitle: 'Creative Direction',
    tags: [TAG.VIDEO, TAG.MUSIC],
    image: '/projects/troy_resounded.png',
  },
];

// Extend each project with resolved gradient colors for convenience
const projects = projectsBase.map(project => ({
  ...project,
  colorFrom: getProjectColors(project.tags).from,
  colorTo: getProjectColors(project.tags).to,
}));

// ─── Refs ─────────────────────────────────────────────────────────────────────

const wrapperEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

// Tracked mouse position — updated on every mousemove
const mouseX = ref(0);
const mouseY = ref(0);

// ─── Hover Detection ──────────────────────────────────────────────────────────

// Browsers only fire :hover when the mouse moves, not when elements move under
// a stationary cursor. This manually checks which panel is under the cursor and
// applies `is-hovered`, called on mousemove AND every GSAP tick so it stays
// accurate during scroll animations.
function updateHoveredPanel() {
  const el = document.elementFromPoint(mouseX.value, mouseY.value);
  const panels = contentEl.value?.querySelectorAll('.panel') ?? [];
  panels.forEach(panel => {
    panel.classList.toggle('is-hovered', panel.contains(el) || panel === el);
  });
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);

  window.addEventListener('mousemove', (e) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
    updateHoveredPanel();
  });

  // Re-evaluate hover on every GSAP frame so scrubbed scroll animations don't lag
  gsap.ticker.add(updateHoveredPanel);

  const wrapper = wrapperEl.value;
  const content = contentEl.value;
  if (!wrapper || !content) return;

  // Small delay ensures the DOM is fully painted before GSAP measures elements
  setTimeout(() => {
    ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.panel', content);
      const totalPanels = panels.length;
      if (!totalPanels) return;

      // Stack panels: first one slightly scaled down, rest hidden below
      gsap.set(panels[0], { scale: 0.92 });
      gsap.set(panels.slice(1), { yPercent: 110, scale: 1.05 });

      // Scroll-driven timeline: each panel slides up and settles behind the next
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
        tl.to(panel, { yPercent: 52.5, ease: 'none' }, i);         // slide into view
        tl.to(panel, { yPercent: 0, scale: 0.92, ease: 'none' }, i + 0.5); // settle in place
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, wrapper);
  }, 100);

  // Debounced resize to keep ScrollTrigger measurements accurate
  let resizeTimer: number;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
  };
  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimer);
  });
});

onBeforeUnmount(() => {
  gsap.ticker.remove(updateHoveredPanel);
  ctx?.revert();
  ctx = null;
  ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>

<style scoped>
.panel {
  /* Force GPU compositing to prevent jank during GSAP transforms */
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.gradient-circle {
  transform: translateZ(0);
}

/* `is-hovered` is set by updateHoveredPanel() instead of relying on :hover,
   so the glow updates even when the cursor is stationary during scroll */
.group.is-hovered .gradient-circle {
  top: -250% !important;
  left: -250% !important;
}
</style>