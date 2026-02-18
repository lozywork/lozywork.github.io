<template>
  <div
    ref="container"
    class="py-24 relative z-50 bg-[#181818]"
  >
    <div class="w-fit mx-auto flex flex-col gap-16">
      <div class="flex flex-col items-center w-5/6 mx-auto">
        <h1 
          ref="textBlock"
          class="text-5xl leading-snug font-semibold text-white/10 select-none"
        >
          <span 
            v-for="(char, index) in textArray" 
            :key="index" 
            class="char"
          >{{ char }}</span>
        </h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const container = ref(null);
const textBlock = ref(null);

const rawText = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.';

const textArray = computed(() => rawText.split(''));

onMounted(() => {
  const chars = textBlock.value.querySelectorAll('.char');

  gsap.to(chars, {
    scrollTrigger: {
      trigger: container.value,
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.5,
    },
    color: '#ffffff',
    stagger: 0.1,
    ease: 'none',
  });
});
</script>

<style scoped>
.char {
  white-space: pre;
  display: inline-block;
}
</style>