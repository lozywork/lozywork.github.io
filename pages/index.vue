<template>
  <div>
    <Header />
    <div class="content-body mx-auto flex min-h-screen max-w-6xl flex-col px-8 pb-20 gap-24">
      <Introduction />
      <Timeline
        :items="[
          { 
            name: 'Riff-2 Bootleg',
            description: 'Original: Flawed Mangoes - Riff 2',
            typ: 'music',
            src: '/riff.mp3',
            coverSrc: '/riff.png'
          },
          {
            name: 'Design',
            description: 'Wireframes, UI‑Konzept',
            typ: 'film',
            src: '/assets/video/design.mp4',
            coverSrc: '/image.png'
          },
          {
            name: 'Riff-2 Bootleg',
            description: 'Original: Flawed Mangoes - Riff 2',
            typ: 'music',
            src: '/image.png',
            coverSrc: '/image.png'
          },
          {
            name: 'Riff-2 Bootleg',
            description: 'Original: Flawed Mangoes - Riff 2',
            typ: 'music',
            src: '/image.png',
            coverSrc: '/image.png'
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
