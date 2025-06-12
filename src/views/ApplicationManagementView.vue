<script setup lang="ts">
import { reactive } from "vue";
import { useEnvironmentStore } from "@/stores/environment";
const apiDomain = import.meta.env.VITE_API_DOMAIN;

const environmentStore = useEnvironmentStore();

interface App {
  envId: number | null;
  name: string;
  passkey: string;
}

const app: App = reactive({
  envId: environmentStore.currentEnvId,
  name: "",
  passkey: "",
});

interface AppResponseData {
  name: string;
  passkey: string;
}

const createApp = () => {
  fetch(`${apiDomain}/api/v1/application/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(app),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then(async (data: AppResponseData) => {
      app.passkey = data.passkey;
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<template>
  <h2 class="title">Customer environment</h2>
  <div class="top-right">
    <RouterLink to="/environment-settings" class="back">Back ⮨</RouterLink>
  </div>
  <div class="wrapper">
      <div class="small-display-box">
        <form @submit.prevent class="align-contents-center">
          <!--Application name -->
          <label for="AppNameInput">Application name:</label>
          <input id="AppNameInput" type="text" v-model="app.name" />
        </form>
        <div v-if="app.passkey.length > 0" class="token-reveal">
          <p>Be careful with your application token and save it somewhere else, it won't be shown ever again:</p>
          <p>{{ app.passkey }}</p>
        </div>
      </div>

      <button type="submit" class="submit-btn" @click="createApp">Register application</button>
  </div>
</template>

<style scoped>
.title {
  color: #fff;
  margin: 5px;
}

form {
  display: flex;
  flex-direction: column;
  width: 95%;
}

label {
  width: 80%;
  align-self: flex-start;
  display: block;
  margin-top: 5px;
  color: #fff;
  font-style: italic;
}

input {
  display: block;
  width: 100%;
  margin: 10px 0;
  background-color: #404040;
  padding: 15px;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 1.2rem;
}

input:focus {
  outline: 2px solid #404040;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.token-reveal {
  text-align: center;
  color: #fff;
}

.submit-btn {
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 10px;
  border: none;
  background-color: #404040;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  width: calc(18rem + 30vw);
}


.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}

.back {
  color: var(--vt-c-white);
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
}

.back:hover {
  text-decoration: underline;
}
</style>
