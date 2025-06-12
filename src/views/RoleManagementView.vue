<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useEnvironmentStore } from "@/stores/environment";
const apiDomain = import.meta.env.VITE_API_DOMAIN;

const environmentStore = useEnvironmentStore();

interface Role {
  name: string;
}

const roles = ref<Role[]>([]);

const showInput = ref(false);
const newRole = ref("");
const toggleInput = () => {
  showInput.value = !showInput.value;
  newRole.value = "";
};

const addRole = () => {
  fetch(`${apiDomain}/api/v1/role/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      envId: environmentStore.currentEnvId,
      role: newRole.value,
    }),
    credentials: "include",
  })
  .then((response) => {
      if (!response.ok) throw Error(response.statusText);
  })
  .then(async () => {
      roles.value.unshift({ name: newRole.value });
      toggleInput();
  })
  .catch((error) => {
      console.error(error);
  });
};

onMounted(() => {
  fetch(`${apiDomain}/api/v1/role/get/${environmentStore.currentEnvId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then(async (data) => {
      roles.value = data;
    })
    .catch((error) => {
      console.error(error);
    });
});
</script>

<template>
  <h2 class="title">Customer environment</h2>
  <div class="top-right">
    <RouterLink to="/environment-settings" class="back">Back ⮨</RouterLink>
  </div>

  <div class="table-container">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Role management</th>
            <th class="edit-btn-col plus-btn" @click="toggleInput" style="cursor: pointer">+</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="showInput">
            <td colspan="1" class="input-row">
              <input
                v-model="newRole"
                @keyup.enter="addRole"
                placeholder="Give us an e-mail address"
                class="add-person-input"
                autofocus
              />
            </td>
            <td colspan="1" class="add-btn-row">
              <button @click="addRole" class="add-btn">Add</button>
            </td>
          </tr>
          <tr v-for="(role, index) in roles" :key="index">
            <td class="email-col">{{ role.name }}</td>
            <td class="edit-btn-col"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">1/1</div>
</template>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px;
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  height: calc(100vh - 120px);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  min-height: 400px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: #fff;
  font-size: 16px;
}

th,
td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  background: var(--color-background-soft);
  color: #fff;
  font-weight: bold;
  font-size: 20px;
}

tr:nth-child(even) {
  background: var(--color-background-mute);
}

tr:last-child td {
  border-bottom: 1px solid var(--color-border);
}

.email-col {
  width: 85%;
}

.edit-btn-col {
  width: 5%;
  text-align: center;
  font-weight: bold;
  user-select: none;
}

.input-row {
  display: flex;
  align-items: center;
  padding: 5px 0;
}

.add-person-input {
  width: 100%;
  font-size: 16px;
  padding: 15px;
  background: none;
  border: none;
  color: var(--vt-c-white);
  font-style: italic;
  font-weight: bold;
  text-align: left;
  outline: none;
  box-shadow: none;
}

.add-btn {
  margin-left: 10px;
  font-weight: bold;
  background-color: var(--color-background);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;
}

.plus-btn {
  font-size: 40px;
  font-weight: bold;
  padding: 0;
  user-select: none;
}

.pagination {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.title {
  color: #fff;
  margin: 5px;
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
