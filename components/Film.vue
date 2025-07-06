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
      I cut stories under the label <b>ZoLo Cinematics</b>, shaping rhythm and emotion - often scripting and shooting them myself with whatever gear's at hand. My aim is to master every facet of filmmaking and team up with others to craft idea-driven films.
    </p>

    <div class="pb-8">
      <div class="relative w-fit mx-auto">
        <h1 class="title text-2xl font-bold text-center example-project">
          Example Project
        </h1>
      </div>
      <p class="mt-2 font-medium text-[#848484] text-center pb-5">
        Here's a promotion video I made with snv_prodd - I ran the edit, sculpting its flow, rhythm, and feel in post-production.
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
      Up next, you'll find a button linking to my graduation project, created as part of my matura graduation.
      It was the first project where I handled the entire production process independently - from initial idea and script to camera work, lighting, editing, and post-production.
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