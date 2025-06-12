<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useEnvironmentStore } from "@/stores/environment";
const apiDomain = import.meta.env.VITE_API_DOMAIN;

const environmentStore = useEnvironmentStore();

interface Person {
  id: number;
  username: string;
  roles?: string[];
}

interface Role {
  id: number;
  envId: number;
  name: string;
}

const people = ref<Person[]>([]);
const roles = ref<Role[]>([]);

const showInput = ref(false);
const newAccount = ref("");

const editingIndex = ref<number | null>(null);
const selectedRoles = ref<string[]>([]);

const toggleInput = () => {
  showInput.value = !showInput.value;
  newAccount.value = "";
};

const addPerson = async () => {
  fetch(`${apiDomain}/api/v1/environment/add/account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      envId: environmentStore.currentEnvId,
      username: newAccount.value,
    }),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
    })
    .then(async () => {
      const response = await fetch(`${apiDomain}/api/v1/environment/get/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          envId: environmentStore.currentEnvId,
        }),
        credentials: "include",
      });
      if (!response.ok) throw Error(response.statusText);
      people.value = await response.json();
      toggleInput();
    })
    .catch((error) => {
      console.error(error);
    });
};

const edit = async (index: number, currentRoles?: string[]) => {
  const person = people.value[index];

  if (editingIndex.value === index) {
    cancelEdit();
    return;
  }

  editingIndex.value = index;

  try {
    const response = await fetch(`${apiDomain}/api/v1/account/get/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        envId: environmentStore.currentEnvId,
        accountId: person.id,
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch roles");

    const roleData: { accountId: number; roleId: number }[] = await response.json();

    selectedRoles.value = roleData
      .map((roleEntry) => {
        const matched = roles.value.find((r) => r.id === roleEntry.roleId);
        return matched?.name;
      })
      .filter((name): name is string => !!name);
  } catch (error) {
    console.error("Failed to fetch person's roles:", error);
    selectedRoles.value = currentRoles ? [...currentRoles] : [];
  }
};

const cancelEdit = () => {
  editingIndex.value = null;
  selectedRoles.value = [];
};

const saveRoles = (person: Person) => {
  fetch(`${apiDomain}/api/v1/account/add/role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      envId: environmentStore.currentEnvId,
      accountId: person.id,
      roleIds: selectedRoles.value
        .map((roleName) => {
          const role = roles.value.find((r) => r.name === roleName);
          return role?.id;
        })
        .filter((id): id is number => typeof id === "number"),
    }),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error("Failed to assign roles");
      return response.json();
    })
    .then(() => {
      person.roles = [...selectedRoles.value];
      cancelEdit();
    })
    .catch((error) => {
      console.error("Failed to assign roles:", error);
    });
};

onMounted(() => {
  // Load accounts
  fetch(`${apiDomain}/api/v1/environment/get/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      envId: environmentStore.currentEnvId,
    }),
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      people.value = data;
    })
    .catch((error) => {
      console.error(error);
    });

  // Load roles
  fetch(`${apiDomain}/api/v1/role/get/${environmentStore.currentEnvId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
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
            <th>People management</th>
            <th class="edit-btn-col plus-btn" @click="toggleInput" style="cursor: pointer">+</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="showInput">
            <td colspan="1" class="input-row">
              <input
                v-model="newAccount"
                @keyup.enter="addPerson"
                placeholder="Give us an e-mail address"
                class="add-person-input"
                autofocus
              />
            </td>
            <td colspan="1" class="add-btn-row">
              <button @click="addPerson" class="add-btn">Add</button>
            </td>
          </tr>

          <template v-for="(person, index) in people" :key="index">
            <tr>
              <td class="email-col">{{ person.username }}</td>
              <td class="edit-btn-col">
                <span @click="edit(index, person.roles)" style="cursor: pointer">✎</span>
              </td>
            </tr>
            <tr v-if="editingIndex === index">
              <td colspan="2" style="background: var(--color-background-soft); padding: 10px">
                <div>
                  <label class="role-select-label">Assign Roles:</label>
                  <select v-model="selectedRoles" multiple class="role-select">
                    <option v-for="role in roles" :key="role.name" :value="role.name">
                      {{ role.name }}
                    </option>
                  </select>
                </div>
                <div class="action-btn-row">
                  <button @click="cancelEdit" class="cancel-btn" style="margin-left: 10px">
                    Cancel
                  </button>
                  <button @click="() => saveRoles(person)" class="save-btn">Save</button>
                </div>
              </td>
            </tr>
          </template>
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

.role-select {
  width: 15%;
  padding: 10px;
  font-size: 16px;
  background: var(--color-background);
  color: var(--vt-c-white);
  border: 1px solid var(--color-border);
  border-radius: 5px;
  margin-top: 5px;
}

.role-select-label {
  width: 100%;
  display: block;
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

.action-btn-row {
  float: right;
}

.save-btn {
  border: none;
  background-color: var(--color-background-soft);
  color: #fff;
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
}

.cancel-btn {
  border: none;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
}
</style>
