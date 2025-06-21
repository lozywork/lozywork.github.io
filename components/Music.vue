<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    id="music"
    class="flex flex-col"
  >
    <h1 class="title text-3xl font-bold text-center">
      Music Production prodby.sassey
    </h1>
    <p class="mt-2 font-medium text-[#848484] text-center pb-8">
      Music has been a part of my life for a long time - as a form of expression, as a tool, and as a world of its own. Under the name prodby.sassey, I produce my own tracks and beats - often experimental, cross-genre, and intuitive. I currently major in music at school and regularly collaborate with other musicians - in band projects, improvisation sessions, and compositions. Through these experiences, I constantly gain new insights, learn how to work musically with others, and deepen my understanding of sound, dynamics, and musical storytelling.<br>
      My roots lie in hip-hop and techno, which I continue to explore actively. At the same time, I'm increasingly experimenting with other genres - both digital and analog - and developing new soundscapes that blend rhythm, atmosphere, and energy. Recently, I've been diving deeper into film scoring, with the goal of composing original music for my own films in the future - to create an even closer connection between image and sound.
    </p>

    <div>
      <div class="relative w-fit mx-auto">
        <h1 class="title text-2xl font-bold text-center example-project">
          Wanna hear how it sounds?
        </h1>
      </div>
      <p class="mt-2 font-medium text-[#848484] text-center pb-5">
        Below you'll find a preview of one of my recent projects - offering a first impression of my sound, creative direction, and style.
      </p>
      <div 
        class="mx-auto max-w-3/5" 
        v-html="embed" 
      />
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import rawEmbed from '~/musicInstagramEmbed';

const embed = ref(rawEmbed);
</script>


<style scoped lang="scss">
.example-project::before {
    content: "🎧";
    position: absolute;
    left: -1.25em;
    top: 0;
}
</style>