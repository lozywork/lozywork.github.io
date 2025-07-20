<template>
  <div class="timeline">
    <div
      v-for="(ev, i) in events"
      :key="i"
      @click="setCurrentProject(ev.title, ev.description);"
    >
      <div
        v-if="ev.type == MUSIC"
        class="timeline-item left-0 text-right relative w-1/2 py-4 px-8"
      >
        <div class="marker right-[-6px]" />
        <div class="flex gap-1">
          <div class="w-[100px] h-[100px] bg-blue-400">
            <img src="/btn.png">
          </div>
          <div class="text-left">
            <p class=" font-bold">
              {{ ev.title }}
            </p>
            <span>
              {{ ev.description }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-else-if="ev.type == FILM"
        class="timeline-item left-1/2 text-left relative w-1/2 py-4 px-8"
      >
        <div class="marker left-[-6px]" />
        <div class="flex gap-1">
          <div class="w-[60%] h-[60%]">
            <img src="/yt.png">
          </div>
          <div class="text-left">
            <p class=" font-bold">
              {{ ev.title }}
            </p>
            <span>
              {{ ev.description }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentProjectStore } from '~/stores/project';

const MUSIC = 'music';
const FILM = 'film';

const { setCurrentProject } = useCurrentProjectStore();


const events = [
  { type: MUSIC, title: 'Lonnys toller song', date: '2025-01-02', description: 'asdfökljasdflö kasdjf klpasdj föklasdjf ' },
  { type: FILM, title: 'Lonny film 1',   date: '2025-03-15', description: 'Erster Release'   },
  { type: FILM, title: 'Lonny film 2',      date: '2025-06-01', description: 'Produktivgang'    },
];
</script>

<style scoped>
.timeline {
  position: relative;
  margin: 0 auto;
  padding: 0;
  width: 100%;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 49.8%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #848484;
}

.marker {
  position: absolute;
  top: 1.25rem;
  width: 12px;
  height: 12px;
  background: #848484;
  border: 3px solid #848484; /* blau */
  border-radius: 50%;
  z-index: 2;
}

</style>
