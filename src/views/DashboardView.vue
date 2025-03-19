<script setup lang="ts">
import { ref } from "vue";

interface log {
  time: string;
  severity: "Info" | "Error" | "Critical" | "Warning" | "Debug";
  details: string;
  tags: string[];
}

const logs = ref<log[]>([
  {
    time: '12:24:34 03-03-2025',
    severity: 'Error',
    details: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  ',
    tags: ['suspicious behaviour']
  },
  {
    time: '12:24:12 03-03-2025',
    severity: 'Info',
    details: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  ',
    tags: ['sale', 'e-mail sent']
  },
  {
    time: '12:22:54 02-03-2025',
    severity: 'Critical',
    details: 'Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.  ',
    tags: ['suspicious behaviour']
  }
]);
</script>

<template>
  <h1 class="title">Customer environment</h1>
  <div class="top-right">
    <a href="#" class="env-settings">Environment settings ⛭</a>
  </div>
  <div class="table-container">
    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
          <th class="time-col">Time</th>
          <th class="severity-col">Severity</th>
          <th class="details-col">Details</th>
          <th class="tags-col">Tags</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(log, index) in logs" :key="index">
          <td class="time-col">{{ log.time }}</td>
          <td class="severity-col">{{ log.severity }}</td>
          <td class="details-col">{{ log.details }}</td>
          <td class="tags-col">{{ log.tags.join(', ') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="pagination">1/1</div>
</template>

<style scoped>
.top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}

.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 20px 0 20px;
  overflow: hidden;
}

.title {
  margin: 10px 0 10px 20px;
  font-size: 18px;
  font-weight: bold;
  align-self: flex-start;
  color: #fff;
}

.env-settings {
  color: var(--vt-c-white);
  text-decoration: none;
  font-size: 15px;
  font-weight: bold;
  margin-right: 10px;
}

.env-settings:hover {
  text-decoration: underline;
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

th, td {
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
  padding: 10px 0 10px 15px;
}

tr:nth-child(even) {
  background: var(--color-background-mute);
}

tr:last-child td {
  border-bottom: 1px solid var(--color-border);
}

.time-col {
  width: 8%;
}

.severity-col {
  width: 5%;
}

.details-col {
  width: 45%;
}

.tags-col {
  width: 15%;
}

.pagination {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: auto;
  }
}
</style>
