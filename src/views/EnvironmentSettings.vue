<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <div class="top-right">
      <RouterLink to="/dashboard" class="back">Back ⮨</RouterLink>
    </div>

    <h1>Environment settings</h1>
    <router-link to="/people-management" class="link">People management</router-link>
    <router-link to="/application-management" class="link">Application management</router-link>
  </div>
</template>

<style scoped>
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

.link {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  font-size: 20px;
}

.link:hover {
  text-decoration: underline;
}
</style>