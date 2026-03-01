<template>
  <div class="absolute bottom-24 w-full text-white">
    <div class="marquee">
      <!-- Second element is aria-hidden since it's a pure visual duplicate -->
      <h1
        ref="marquee1"
        class="marquee__content"
      >
        Lonny Zeindler -
      </h1>
      <h1
        ref="marquee2"
        class="marquee__content"
        aria-hidden="true"
      >
        Lonny Zeindler -
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// ─── Refs ─────────────────────────────────────────────────────────────────────

const marquee1 = ref<HTMLElement | null>(null);
const marquee2 = ref<HTMLElement | null>(null);

// ─── Scroll-driven Translation ────────────────────────────────────────────────

// Instead of auto-scrolling, the marquee is driven entirely by scroll position.
// We pause the CSS animation and manually translate both elements in sync.
function handleScroll() {
  const offset = -(window.scrollY % window.innerWidth);
  if (marquee1.value) marquee1.value.style.transform = `translateX(${offset}px)`;
  if (marquee2.value) marquee2.value.style.transform = `translateX(${offset}px)`;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  // Pause the CSS marquee animation — scroll takes over from here
  if (marquee1.value) marquee1.value.style.animationPlayState = 'paused';
  if (marquee2.value) marquee2.value.style.animationPlayState = 'paused';

  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.marquee {
  z-index: 100;
  --gap: 1rem;
  position: relative;
  display: flex;
  overflow: hidden;
  user-select: none;
  height: fit-content;
  gap: var(--gap);
}

.marquee__content {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  gap: var(--gap);
  width: 100%;
}

h1 {
  font-size: max(14vw);
  line-height: normal;
}
</style>