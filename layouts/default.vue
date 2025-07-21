<template>
  <slot />
  <MusicFlow
    class=" border-t-2 border-[#303030] z-50"
    :options="{
      waveColor: '#848484',
      progressColor: '#ffffff',
      cursorColor: '#ffffff',
      cursorWidth: 3,
      barWidth: 3,
      barGap: 3,
      barRadius: 12,
      barHeight: 0.8,
      autoScroll: false,
      autoCenter: false,
      hideScrollbar: true,
      interact: true,
      autoplay: true
    }"
  />
</template>


<script setup lang=ts>
import 'vue-music-flow/dist/vue-music-flow.css';
import { MusicFlow } from 'vue-music-flow';
</script>
