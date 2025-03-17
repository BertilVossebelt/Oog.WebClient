<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

interface Credentials {
  username: string
  password: string
}

const credentials: Credentials = reactive({
  username: "",
  password: "",
})

const register = async () => {

  fetch("https://localhost:4040/api/v1/account/authenticate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include"
  })
    .then((response) => {
      if (!response.ok) throw Error(`Failed to login: ${response.statusText}`)
      console.log("Login successful:", response.json())
      router.push('/environment-selector');
    })
    .catch((error) => {
      console.error("An Error occurred during login:", error)
    })
}
</script>

<template>
  <div class="wrapper">
    <div class="small-display-box">
      <h1 class="logo">&lt;LogIn/&gt;</h1>
      <form @submit.prevent class="align-contents-center">
        <!-- E-mail address -->
        <label for="UsernameInput">E-mail address:</label>
        <input id="UsernameInput" type="text" v-model="credentials.username" />

        <!-- Password -->
        <label for="PasswordInput">Password:</label>
        <input id="PasswordInput" type="password" v-model="credentials.password" />
      </form>
    </div>

    <button type="submit" class="submit-btn" @click="register">LogIn</button>
    <RouterLink to="/signup" class="register-link">Don't have an account?</RouterLink>
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

.small-display-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(18rem + 30vw);
  max-width: 90%;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #404040;
  margin-bottom: 20px;
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

.register-link {
  color: #fff;
  padding: 10px;
  font-size: 1.1rem;
}
</style>
