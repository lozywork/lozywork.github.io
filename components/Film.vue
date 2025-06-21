<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    id="film"
    class="flex flex-col"
  >
    <h1 class="title text-3xl font-bold text-center">
      Film & Videos ZoLo Cinematics
    </h1>
    <p class="mt-2 font-medium text-[#848484] text-center pb-8">
      Visual storytelling is more than just technique for me - it's my way of expressing narratives.Right now, my focus lies in video editing, where I work with a strong sense of timing, rhythm, and emotion. I explore this craft through small-scale projects where I sometimes write scripts myself or handle the filming. I don't (yet) have professional gear or a big team - but I do have plenty of ideas and a lot of passion.<br><br>
      ZoLo Cinematics is my label for everything related to film and editing. In the long run, my goal is to build a deep and well-rounded understanding of all aspects of filmmaking- from concept development and screenwriting to cinematography, directing, lighting, editing, and post-production. I want to understand how all these areas interact so I can think of films in a holistic way and contribute creatively throughout the entire process.
      Collaboration is especially important to me - I enjoy working in teams and believe that great projects emerge when diverse ideas, skills, and perspectives come together.
    </p>

    <div class="pb-8">
      <div class="relative w-fit mx-auto">
        <h1 class="title text-2xl font-bold text-center example-project">
          Example Project
        </h1>
      </div>
      <p class="mt-2 font-medium text-[#848484] text-center pb-5">
        Below, you'll find an example of a promotional video I produced - created in collaboration with snv_prodd.
        The main focus of this project was on editing, where I shaped the visual story through timing, rhythm, and emotion in post-production.
      </p>
      <div 
        class="mx-auto md:w-3/5" 
        v-html="embed" 
      />
    </div>

    <div class="relative w-fit mx-auto">
      <h1 class="title text-2xl font-bold text-center full-production">
        Curious about a full production?
      </h1>
    </div>
    <p class="mt-2 font-medium text-[#848484] text-center pb-5">
      Up next, you'll find a button linking to my graduation project, created as part of my Matura graduation.<br>
      It was the first project where I handled the entire production process independently - from initial idea and script to camera work, lighting, editing, and post-production.<br>
      Before starting, I took time to deeply explore each of these steps, making it a key milestone in my development as a filmmaker.
    </p>
    <a 
      class="w-fit text-center m-auto rounded-md relative text-sm font-medium bg-[#303030] p-2 px-3"
      href="https://www.youtube.com/watch?v=9VUrXeQQ7Bs"
      target="_blank"
    >
      To become a Warrior - graduation project
    </a>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import rawEmbed from '~/filmInstagramEmbed';

const embed = ref(rawEmbed);
</script>


<style scoped lang="scss">
.example-project::before {
    content: "💡";
    position: absolute;
    left: -1.25em;
    top: 0;
}

.full-production::before {
    content: "▶️";
    position: absolute;
    left: -1.25em;
    top: 0;
}
</style>