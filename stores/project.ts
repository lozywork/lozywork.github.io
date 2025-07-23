import { useMusicFlow } from 'vue-music-flow';
import type { ProjectItem } from '~/types/project';
const { onPlaySingleTrack } = useMusicFlow();

export const useCurrentProjectStore = defineStore('current-project', {
  state: () => ({
    item: {} as ProjectItem,
    audio: null as HTMLAudioElement | null,
    fullScreenID: null as number | null,
  }),
  actions: {
    playMusic(item: ProjectItem): void {
      onPlaySingleTrack({
        id: item.id,
        audio: '/music' + item.src,
        title: item.name,
        artist: 'prodby.sassy',
        artwork: '/music' + item.coverSrc,
        original: {
          source: '/music' + item.src,
        },
        album: ''
      });
      this.item = item;
    },
    pauseMusic(): void {
      this.audio?.pause();
    },
    toggleFullScreen(id: number): void {
      if (this.fullScreenID == id) {
        this.fullScreenID = null;
      } else {
        this.fullScreenID = id;
      }
    },
    isProjectFullscreen(id: number): boolean {
      return this.fullScreenID == id;
    },
    fullScreenActive(): boolean {
      return this.fullScreenID !== null;
    }
  },
  getters: {
    currentProject: (state): ProjectItem => {
      return state.item;
    },
  }
});
