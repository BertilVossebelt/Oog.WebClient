import { defineStore } from "pinia";

export const useEnvironmentStore = defineStore("environment", {
  state: () => ({
    currentEnvId: null as number | null,
  }),
  actions: {
    setEnvId(envId: number) {
      this.currentEnvId = envId;
    },
  },
  persist: true
});
