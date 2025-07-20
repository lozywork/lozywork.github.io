export const useCurrentProjectStore = defineStore('current-project', {
  state: () => ({
    name: '',
    description: ''
  }),
  actions: {
    setCurrentProject(name: string, description: string): void {
      this.name = name;
      this.description = description;
    }
  },
  getters: {
    currentProject: (state): {name: string, description: string} => {
      return { name: state.name, description: state.description };
    },
  }
});
