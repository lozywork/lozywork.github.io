<template>
  <div>
    <Header :class="fullScreenActive() ? '!z-0 !bg-[#171717] !opacity-100' : '!z-50'" />
    <div class="content-body mx-auto flex min-h-screen max-w-6xl flex-col px-8 pb-20 gap-48">
      <Introduction />
      <Timeline
        :items="[
          {
            id: 1,
            date: 'März 2024',
            name: '21 Savage X Young Nudy Type Beat',
            description: '',
            typ: 'music',
            src: '/beat1.wav',
            coverSrc: '/beat1.jpg',
          },
          {
            id: 1.5,
            date: 'März 2024',
            name: 'Film 123',
            description: '',
            typ: 'film',
            src: '/beat1.wav',
            coverSrc: '/beat1.jpg',
          },
          {
            id: 2,
            date: 'März 2024',
            name: '21Savage X Offset Type Beat',
            description: '',
            typ: 'music',
            src: '/Beat2.wav',
            coverSrc: '/Beat2.jpg'
          },
          {
            id: 3,
            date: 'März 2024',
            name: 'Lil Baby type Beat',
            description: '',
            typ: 'music',
            src: '/Beat3.wav',
            coverSrc: '/Beat3.jpg'
          },
          {
            id: 4,
            date: 'März 2024',
            name: 'Beat4',
            description: '',
            typ: 'music',
            src: '/Beat4.mp3',
            coverSrc: '/Beat4.png '
          },
        ]"
        :dot-spacing="170"
      />
      <Film />
      <Music />
      <Contact />
      <Lozy />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { fullScreenActive } = useCurrentProjectStore();
</script>