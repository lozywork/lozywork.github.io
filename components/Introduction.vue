<template>
  <div class="flex flex-col items-start pt-6 gap-8 md:flex-row-reverse md:items-center md:justify-between">
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
        I'm <b>Lozy</b> - music producer, filmmaker and lifelong experimenter. What began as a hobby now fuels my career as I produce music, films and push each project further than the last.
      </p>
      <div class="mt-2 flex flex-col md:flex-row items-center mx-auto md:mx-0 gap-6 md:gap-24">
        <!--ZoLo Cinema-->
        <div class="flex flex-col gap-3">
          <p class="mt-4 font-medium text-[#848484] mx-auto">
            🎬 ZoLo Cinema
          </p>
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
        <div class="flex flex-col gap-3">
          <p class="mt-4 font-medium text-[#848484] mx-auto">
            🎧 prodby.sassey
          </p>
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