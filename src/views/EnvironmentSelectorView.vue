<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { useEnvironmentStore } from '@/stores/environment';
import router from "@/router";
const apiDomain = import.meta.env.VITE_API_DOMAIN;

const environmentStore = useEnvironmentStore();

interface Env {
  id: number;
  name: string;
}

const envs = ref<Env[]>([]);

/*
* OnClick method for env boxes.
*/
const goToDashboard = (envId: number): void => {
  environmentStore.setEnvId(envId);
  router.push("/dashboard");
};

/*
* Toggle for new env box.
*/
const showInput = ref<boolean>(false);
const toggleNewEnvInput = (): void => {
  showInput.value = !showInput.value;

  // Focus on the input of the new env box when DOM is ready.
  if (showInput.value) {
    nextTick(() => {
      const inputField = document.querySelector("input") as HTMLInputElement;
      inputField?.focus();
    });
  }
};

/*
* Create a new env and add it to the env picker.
*/
interface EnvResponseData {
  id: number;
  name: string;
}

const newEnv: Env = reactive({ id: 0n, name: "" });
const createNewEnv = async () => {
  fetch(`${apiDomain}/api/v1/environment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEnv),
    credentials: "include",
  })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data: EnvResponseData) => {
        const createdEnv: Env = {
          id: data.id,
          name: data.name,
        }

        // Add new environment to the list, reset the new env box.
        envs.value.unshift(createdEnv);
        showInput.value = false;
        newEnv.name = "";
      })
      .catch((error) => {
        console.error(error);
      });
};

/*
// Request all environments of the current user on page load.
*/
onMounted(() => {
  fetch(`${apiDomain}/api/v1/environment/read`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(async (data) => {
        envs.value = data;
      })
      .catch((error) => {
        console.error(error);
      });
});
</script>

<template>
  <div class="wrapper">
    <div class="top-right">
      <a href="#" class="account-settings">Account settings ⛭</a>
    </div>
    <div class="selector-container">
      <div class="environment-selector">
        <div class="add-env" @click="toggleNewEnvInput">
          <span class="plus">+</span>
        </div>

        <!-- New environment box -->
        <transition name="fade-scale">
          <div class="env-box new-env-box" v-if="showInput">
            <input v-model="newEnv.name" @keyup.enter="createNewEnv" placeholder="Give us a name" />
            <button class="create-btn" @click="createNewEnv">Create</button>
          </div>
        </transition>

        <div
            class="env-box"
            v-for="(env, index) in envs"
            :key="index"
            @click="goToDashboard(env.id)">
          {{ env.name }}
        </div>
      </div>
    </div>
    <h1 class="choose-text">Choose an environment</h1>
  </div>
</template>

<style scoped>
.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}

.account-settings {
  color: var(--vt-c-white);
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
}

.account-settings:hover {
  text-decoration: underline;
}

.selector-container {
  display: flex;
  justify-content: left;
  align-items: center;
  border: 2px solid var(--color-border);
  border-radius: 10px;
  padding: 10px;
  background: var(--color-background-soft);
  width: 100%;
  max-width: 1000px;
}

.environment-selector {
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 10px;
  scrollbar-color: #404040 var(--color-background-soft);
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.env-box {
  display: flex;
  align-items: center;
  background: var(--vt-c-black-mute);
  color: var(--vt-c-white);
  padding: 20px;
  border-radius: 10px;
  width: 180px;
  height: 100px;
  font-size: 17px;
  font-weight: bold;
  flex-shrink: 0;
  margin-bottom: 10px;
  cursor: pointer;
}

.env-box:hover {
  outline: 2px solid #404040;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.add-env {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  font-weight: bold;
  background: var(--vt-c-black-mute);
  border-radius: 13px;
  border: 2px solid var(--vt-c-white);
  color: #fff;
  flex-shrink: 0;
  cursor: pointer;
}

.add-env:hover {
  outline: 2px solid #404040;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.add-env span {
  user-select: none;
  height: 60px;
  line-height: 50px;
}

.new-env-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--vt-c-black-mute);
  border-radius: 10px;
  min-width: 100px;
  max-width: 180px;
  height: 100px;
  flex-shrink: 0;
  position: relative;
}

.new-env-box input {
  background: none;
  border: none;
  color: var(--vt-c-white);
  font-style: italic;
  font-weight: bold;
  font-size: 16px;
  text-align: left;
  width: 100%;
  outline: none;
  box-shadow: none;
}

.new-env-box:hover {
  outline: none;
}

.new-env-box:focus-within {
  outline: 2px solid #404040;
  outline-offset: 5px;
}

.create-btn {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 15px;
  color: var(--vt-c-white);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  outline: grey;
}

.create-btn:hover {
  opacity: 1;
}

.create-btn:focus {
  opacity: 1;
}

/* Opening/Closing animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
      opacity 0.35s ease,
      transform 0.35s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.choose-text {
  margin-top: 20px;
  color: var(--vt-c-white);
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 600px) {
  .selector-container {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 80%;
    height: 85%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-right: 0;
  }

  .environment-selector {
    flex-direction: column;
    align-items: center;
  }

  .env-box,
  .add-env {
    width: 100%;
    max-width: 200px;
    margin: 0 10px 0 0;
  }

  .choose-text {
    margin-top: 20px;
  }
}
</style>
