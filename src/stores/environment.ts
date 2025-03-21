import { defineStore } from "pinia";

export const useEnvironmentStore = defineStore("environment", {
  state: () => ({
    currentEnvId: null as bigint | null,
  }),
  actions: {
    setEnvId(envId: bigint) {
      this.currentEnvId = envId;
    },
  },
  persist: true
});
