import type { ProjectItem } from '~/components/Timeline.vue';

export const useCurrentProjectStore = defineStore('current-project', {
  state: () => ({
    item: {} as ProjectItem,
    audio: null as HTMLAudioElement | null,
  }),
  actions: {
    playMusic(item: ProjectItem): void {
      if (this.audio != null && this.item.src == item.src) {
        this.audio.play();
      } else {
        this.item = item;
        this.audio = new Audio('/music' + item.src);
        this.audio.play();
      }
    },
    pauseMusic(): void {
      this.audio?.pause();
    }
  },
  getters: {
    currentProject: (state): ProjectItem => {
      return state.item;
    },
  }
});
