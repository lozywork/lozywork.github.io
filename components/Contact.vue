<!-- eslint-disable vue/no-v-html -->
<template>
  <section
    id="contact"
    class="flex flex-col"
  >
    <div class="relative w-fit mx-auto">
      <h1 class="title text-3xl font-bold text-center contact-title">
        Get in touch
      </h1>
    </div>
    
    <p class="mt-2 font-medium text-[#848484] text-center pb-8">
      Interested in collaborating - in music, film, or a mix of both?<br> Feel free to get in touch.
      <br><br>
      I'm open to creative ideas, fresh approaches, and exciting crossovers - whether clearly defined or more experimental in nature.<br>
      I also welcome inquiries related to TikTok content, social media videos, or promotional spots - whether it's about concept, editing, or production.<br>
    </p>

    <div class="flex items-center gap-12 mx-auto">
      <div class="flex flex-col gap-2">
        <p class="mt-4 font-medium text-[#848484] mx-auto">
          Personal
        </p>
        <div class="flex gap-6 mx-auto">
          <a
            href="mailto:lozys.work@gmail.com"
            class="default-hover"
            title="email"
          >
            <Icon
              name="ic:baseline-email"
              size="24"
            />
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="mt-4 font-medium text-[#848484] mx-auto">
          Video
        </p>
        <div class="flex gap-6 mx-auto">
          <a
            href="mailto:zolo.cinematics@gmail.com"
            class="default-hover"
            title="email"
          >
            <Icon
              name="ic:baseline-email"
              size="24"
            />
          </a>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="mt-4 font-medium text-[#848484] mx-auto">
          Music
        </p>
        <div class="flex gap-6 mx-auto">
          <a
            href="mailto:sassman.business@gmail.com"
            class="default-hover"
            title="email"
          >
            <Icon
              name="ic:baseline-email"
              size="24"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import rawEmbed from '~/musicInstagramEmbed';

const embed = ref(rawEmbed);
</script>


<style scoped lang="scss">
.contact-title::before {
    content: "✉️";
    position: absolute;
    left: -1.25em;
    top: 0;
}
</style>