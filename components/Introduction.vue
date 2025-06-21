<template>
  <div class="flex flex-col items-start pt-3 gap-8 md:flex-row-reverse md:items-center md:justify-between">
    <img
      alt="Portrait"
      width="175"
      height="175"
      class="rounded-lg transition-transform duration-300 transform hover:scale-110"
      style="color: transparent;"
      src="/me.jpg"
    >
    <div class="flex flex-col">
      <h1 class="title text-4xl font-bold">
        Hi, I'm Lonny Zeindler
      </h1>
      <p class="mt-4 font-medium text-[#848484]">
        A creative mind working passionately in the fields of music and film. Under the name Lozy, I bring together my projects, ideas, and visions - gradually building a path toward a sustainable creative career.<br><br>
        What started as a hobby has increasingly become my professional goal. Over the past few years, I've brought various projects to life, explored new directions, and continue working on expanding my portfolio, skills, and knowledge.<br><br>
        Here you'll find an overview of what I do - and where I'm heading.
      </p>
      <div class="mt-8 flex items-center gap-24">
        <!--ZoLo Cinema-->
        <div class="flex flex-col gap-8">
          <p class="mt-4 font-medium text-[#848484] mx-auto">🎬 ZoLo Cinema</p>
          <div class="flex gap-6 mx-auto">
            <a
              href="https://www.instagram.com/zolo_cinema/"
              target="_blank"
              class="default-hover"
              title="instagram"
            >
              <Icon
                name="mdi:instagram"
                size="24"
              />
            </a>
            <a
              href="https://www.youtube.com/@zolo.cinema"
              target="_blank"
              class="default-hover"
              title="youtube"
            >
              <Icon
                name="mdi:youtube"
                size="24"
              />
            </a>
          </div>
        </div>

        <!--prodby.sassey-->
        <div class="flex flex-col gap-8">
          <p class="mt-4 font-medium text-[#848484] mx-auto">🎧 prodby.sassey</p>
          <div class="flex gap-6">
            <a
              href="https://www.instagram.com/prodby.sassey/"
              target="_blank"
              class="default-hover"
              title="instagram"
            >
              <Icon
                name="mdi:instagram"
                size="24"
              />
            </a>
            <a
              href="https://www.youtube.com/@Prodby.sassey"
              target="_blank"
              class="default-hover"
              title="youtube"
            >
              <Icon
                name="mdi:youtube"
                size="24"
              />
            </a>
            <a
              href="https://www.tiktok.com/@prodby.sassey"
              target="_blank"
              class="default-hover"
              title="tiktok"
            >
              <Icon
                name="ic:baseline-tiktok"
                size="24"
              />
            </a>
            <a
              href="https://www.beatstars.com/sasseyprod"
              target="_blank"
              class="default-hover"
              title="beatstars"
            >
              <Icon
                name="simple-icons:beatstars"
                size="24"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>