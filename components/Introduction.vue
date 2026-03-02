<template>
  <div
    ref="container"
    class="py-12 sm:py-14 md:py-16 lg:py-20 xl:py-24 relative z-50 bg-[#181818]"
  >
    <div class="w-fit mx-auto flex flex-col gap-16">
      <div class="flex flex-col items-center w-5/6 mx-auto">
        <h1
          ref="textBlock"
          lang="en"
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-snug font-semibold text-white/10 select-none hyphens-auto text-justify"
        >
          <span
            v-for="(word, wIndex) in wordArray"
            :key="wIndex"
            class="inline"
          >
            <span
              v-for="(char, cIndex) in word"
              :key="cIndex"
              class="inline char"
            >{{ char }}</span>
          </span>
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

const rawText = 'Hi, I am Lonny Zeindler. Under the moniker Lozy Work, I explore the intersection of cinematic storytelling, music production, 3D animation, and coding. Every project is a creative process of trialing new techniques, experimenting, and combining my skills to produce high-quality digital art.';

// Group chars into words, appending a non-breaking space to each (except the last)
const wordArray = computed(() =>
  rawText.split(' ').map((word, i, arr) =>
    i < arr.length - 1 ? [...word, ' '] : [...word]
  )
);

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
