<script setup lang="ts">
</script>

<template>
  <div class="wrapper">
    <div class="small-display-box">
      <h1 class="logo">&lt;Oog/&gt;</h1>
      <p class="description">The ultra flexible and simple application logging solution.</p>
      <a href="/signup" class="a-register">Get started</a>
      <a href="/login" class="a-login">Or login here</a>
    </div>
  </div>
</template>

<style scoped>
.description {
  font-size: 20px;
  margin: 10px;
  text-align: center;
}

.a-register {
  margin: 10px 0 10px 0;
  padding: calc(5px + 0.1vw) calc(30px + 10vw);
  box-sizing: border-box;
  background-color: #fff;
  font-weight: bold;
  font-size: 2rem;
  border: none;
  border-radius: 180px;
  color: #000;
  text-decoration: none;
  transition: 0.2s;
}

.a-register:hover {
  outline: 2px solid #fff;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}

.a-register:focus {
  outline: 2px solid #fff;
  outline-offset: 5px;
  transition: 0.2s ease-out;
}


.a-login {
  color: #fff;
  padding: 10px;
  font-size: 1.1rem;
}
</style>
