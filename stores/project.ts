import { useMusicFlow } from 'vue-music-flow';
import type { ProjectItem } from '~/types/project';
const { onPlaySingleTrack } = useMusicFlow();

export const useCurrentProjectStore = defineStore('current-project', {
  state: () => ({
    item: {} as ProjectItem,
    audio: null as HTMLAudioElement | null,
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
    }
  },
  getters: {
    currentProject: (state): ProjectItem => {
      return state.item;
    },
  }
});
