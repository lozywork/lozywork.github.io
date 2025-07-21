<template>
  <div>
    <Header :class="fullScreen ? '!z-0 !bg-[#171717] !opacity-100' : '!z-50'" />
    <div class="content-body mx-auto flex min-h-screen max-w-6xl flex-col px-8 pb-20 gap-48">
      <Introduction />
      <Timeline
        :items="[
          { 
            id: 1,
            name: 'Riff-2 Bootleg',
            description: 'Original: Flawed Mangoes - Riff 2',
            typ: 'music',
            src: '/riff.mp3',
            coverSrc: '/riff.png'
          },
          {
            id: 2,
            name: 'Beat1',
            description: '',
            typ: 'music',
            src: '/Beat1.wav',
            coverSrc: '/Beat1.jpg'
          },
          {
            id: 3,
            name: 'Beat2',
            description: '',
            typ: 'music',
            src: '/Beat2.wav',
            coverSrc: '/Beat2.jpg'
          },
          {
            id: 4,
            name: 'Beat3',
            description: '',
            typ: 'music',
            src: '/Beat3.wav',
            coverSrc: '/Beat3.jpg'
          },
          {
            id: 5,
            name: 'Beat4',
            description: '',
            typ: 'music',
            src: '/Beat4.mp3',
            coverSrc: '/Beat4.png '
          },
        ]"
        :dot-spacing="170"
        @toggle-fullscreen="fullScreen = !fullScreen"
      />
      <Film />
      <Music />
      <Contact />
      <Lozy />
    </div>
  </div>
</template>

<script lang="ts" setup>
const fullScreen = ref(false);
</script>