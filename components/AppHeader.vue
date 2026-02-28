<template>
  <div class="absolute w-full px-3 sm:px-10 py-10 top-0 left-0 z-50 flex justify-between text-lg">
    <nuxt-link
      ref="creator"
      class="flex px-6 gap-2 group"
      to="/"
    >
      <Icon
        name="la:copyright"
        size="20"
        class="my-auto transition-transform duration-700 ease-out group-hover:rotate-180"
      />
      <span class="transition-all duration-500 ease-out group-hover:tracking-wider">LONNY ZEINDLER</span>
    </nuxt-link>
  </div>

  <div class="hanger z-50 hidden md:inline-block">
    <p class="pl-12 text-[18px]">
      <span class="inline-block">Located</span><br>
      <span class="inline-block">in Switzerland</span>
    </p>
    <svg
      width="auto"
      height="110px"
      viewBox="0 0 300 121"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>Combined Shape</title>
      <g
        id="Page-1"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g
          id="Artboard"
          transform="translate(0.000000, -366.000000)"
          fill="#1C1D20"
        >
          <g
            id="Group"
            transform="translate(149.816828, 426.633657) rotate(90.000000) translate(-149.816828, -426.633657) translate(89.816828, 276.816828)"
          >
            <g
              id="Hanger"
              transform="translate(60.000000, 149.816828) rotate(-90.000000) translate(-60.000000, -149.816828) translate(-89.816828, 89.816828)"
            >
              <path
                id="Combined-Shape"
                d="M239.633657,0 C272.770742,1.0182436e-15 299.633657,26.862915 299.633657,60 C299.633657,93.137085 272.770742,120 239.633657,120 L0,120 L0,0 L239.633657,0 Z M239.633657,18.7755102 C216.866,18.7755102 198.409167,37.232343 198.409167,60 C198.409167,82.767657 216.866,101.22449 239.633657,101.22449 C262.401314,101.22449 280.858147,82.767657 280.858147,60 C280.858147,37.232343 262.401314,18.7755102 239.633657,18.7755102 Z"
              />                                
            </g>
          </g>
        </g>
      </g>
    </svg>
    <div class="digital-ball flex items-center group">
      <Icon
        name="ion:globe-outline"
        size="36"
        class="m-auto transition-transform duration-1000 ease-out group-hover:rotate-[360deg]"
      />
    </div>
  </div>

  <div class="hanger !right-0 w-fit hidden md:!flex flex-col gap-4 pr-5 xl:pr-28 text-5xl z-50 relative">
    <div
      ref="arrow"
      class="absolute top-[-125px] opacity-60 transition-all duration-1000"
    >
      <img
        src="../public/arrow.svg"
        class="transition-all duration-1000"
      >
    </div>
    <span class="text-4xl">
      <span class="inline-block transition-transform duration-700 ease-out hover:translate-x-3">Video Editing Intern</span><br>
      <span class="inline-block transition-transform duration-700 ease-out hover:translate-x-3">Musician & Visual Creator</span>
    </span>
  </div>

  <div class="h-[105%] w-full bg-[#181818] flex items-center relative overflow-hidden">
    <div class="absolute top-[-0.5%] bottom-0 w-full h-full">
      <img
        ref="imageRef"
        class="mx-auto object-cover h-[100%] w-full -z-10 will-change-transform"
        src="/lozy.jpeg"
      >
    </div>
    <Name />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const imageRef = ref<HTMLElement | null>(null);
const arrow = ref<HTMLElement | null>(null);

let scrollY = 0;
let rafId: number | null = null;

let imageY = 0.05;
let arrowY = -125;
let arrowRotation = 0;
let arrowOpacity = 1;

const SMOOTHNESS = 0.08;

const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

const onScroll = () => {
  scrollY = window.scrollY;
};

const animate = () => {
  const targetImageY = scrollY * 0.15;
  const targetArrowY = scrollY * -0.15;
  const targetRotation = scrollY * 0.05;
  const targetOpacity = Math.max(0, 1 - scrollY / 500);

  imageY = lerp(imageY, targetImageY, SMOOTHNESS);
  arrowY = lerp(arrowY, targetArrowY, SMOOTHNESS);
  arrowRotation = lerp(arrowRotation, targetRotation, SMOOTHNESS);
  arrowOpacity = lerp(arrowOpacity, targetOpacity, SMOOTHNESS);

  if (imageRef.value) {
    imageRef.value.style.transform = `translateY(${imageY}px)`;
  }

  if (arrow.value) {
    arrow.value.style.transform = `
      translateY(${arrowY}px)
      rotate(${arrowRotation}deg)
    `;
    arrow.value.style.opacity = arrowOpacity.toString();
  }

  rafId = requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  rafId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped lang="scss">
.hanger {
  height: fit-content;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

p {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  padding-right: 5em;
  line-height: 1.2;
}

.digital-ball {
  z-index: 500;
  position: absolute;
  right: 1.3em;
  left: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 4.2em;
  height: 4.2em;
  background: transparent;
  cursor: pointer;
  transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    transform: translateY(-50%) scale(1.05);
  }
}

* {
  scroll-behavior: smooth;
}

.will-change-transform {
  will-change: transform;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50%);
  }
  to {
    opacity: 1;
    transform: translateY(-50%);
  }
}

.hanger {
  animation: fadeInUp 1s ease-out;
}
</style>