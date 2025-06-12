<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
const apiDomain = import.meta.env.VITE_API_DOMAIN;

interface Credentials {
  username: string,
  password: string,
  password_confirmation: string
}

const credentials: Credentials = reactive({
  username: "",
  password: "",
  password_confirmation: "",
})

const register = async (): Promise<void> => {
  fetch(`${apiDomain}/api/v1/account/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to register: ${response.statusText}`);
      console.log("Registration successful:", response.json());
      login();
    })
    .catch((error) => {
      console.error("An Error occurred during registration:", error);
    });
}

const login = async () => {
  fetch(`${apiDomain}/api/v1/account/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include"
  })
    .then((response) => {
      if (!response.ok) throw Error(`Failed to login: ${response.statusText}`);
      console.log("Login successful:", response.json());
      router.push("/environment-selector");
    })
    .catch((error) => {
      console.error("An Error occurred during login:", error);
    });
}
</script>
<template>
  <div class="wrapper">
    <div class="small-display-box">
      <h1 class="logo">&lt;SignUp/&gt;</h1>
      <form @submit.prevent class="align-contents-center">
        <!-- E-mail address -->
        <label for="UsernameInput">E-mail address:</label>
        <input id="UsernameInput" type="text" v-model="credentials.username" />

        <!-- Password -->
        <label for="PasswordInput">Password:</label>
        <input
          id="PasswordInput"
          type="password"
          v-model="credentials.password"
          autocapitalize="none"
        />

        <!-- Password confirmation -->
        <label for="PasswordConfirmationInput">:Password confirmation</label>
        <input
          id="PasswordConfirmationInput"
          type="password"
          v-model="credentials.password_confirmation"
          autocapitalize="none"
        />
      </form>
    </div>

    <button type="submit" class="submit-btn" @click="register">SignUp</button>
    <RouterLink class="login-link" to="/login">Already have an account?</RouterLink>
  </div>
</template>

<style scoped>
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

.submit-btn:hover {
  outline: 2px solid #404040;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.submit-btn:focus {
  outline: 2px solid #404040;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.login-link {
  color: #fff;
  padding: 10px;
  font-size: 1.1rem;
}
</style>
