<template>
  <div>
    <h1>ToDo App</h1>
    <input v-model="newTask" placeholder="Add task" />
    <button @click="addTask">Add</button>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }}
        <button @click="deleteTask(task.id)">X</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tasks = ref([])
const newTask = ref('')

const apiEndpoint = 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/todo' // ganti nanti

const fetchTasks = async () => {
  const res = await axios.get(apiEndpoint)
  tasks.value = res.data
}

const addTask = async () => {
  const task = { id: Date.now().toString(), title: newTask.value }
  await axios.post(apiEndpoint, task)
  newTask.value = ''
  fetchTasks()
}

const deleteTask = async (id) => {
  await axios.delete(`${apiEndpoint}?id=${id}`)
  fetchTasks()
}

onMounted(fetchTasks)
</script>
