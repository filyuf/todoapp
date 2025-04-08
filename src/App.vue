<template>
  <div class="container">
    <div class="todo-box">
      <h1>📝 Todo App</h1>

      <form @submit.prevent="isEditing ? updateTodo() : addTodo()">
        <input
          v-model="todo.task"
          placeholder="Enter task"
          class="input"
        />
        <button type="submit" class="btn">
          {{ isEditing ? 'Update' : 'Add' }}
        </button>
      </form>

      <ul class="todo-list">
        <li v-for="item in todos" :key="item.id" class="todo-item">
          <span>{{ item.task }}</span>
          <div class="actions">
            <button @click="editTodo(item)" class="btn edit">Edit</button>
            <button @click="deleteTodo(item.id)" class="btn delete">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export default {
  data() {
    return {
      todos: [],
      todo: {
        id: '',
        task: ''
      },
      isEditing: false
    }
  },
  mounted() {
    this.getTodos()
  },
  methods: {
    async getTodos() {
      try {
        const res = await axios.get('https://uhhoch5rm6.execute-api.us-east-1.amazonaws.com/todoapp/todos')
        this.todos = res.data
      } catch (err) {
        console.error('GET error:', err)
      }
    },
    async addTodo() {
      try {
        const newTodo = { id: uuidv4(), task: this.todo.task }
        await axios.post('https://uhhoch5rm6.execute-api.us-east-1.amazonaws.com/todoapp/todos', newTodo)
        this.todo.task = ''
        this.getTodos()
      } catch (err) {
        console.error('POST error:', err)
      }
    },
    editTodo(item) {
      this.todo = { ...item }
      this.isEditing = true
    },
    async updateTodo() {
      try {
        await axios.put(`https://uhhoch5rm6.execute-api.us-east-1.amazonaws.com/todoapp/todos/${this.todo.id}`, {
          task: this.todo.task
        })
        this.todo = { id: '', task: '' }
        this.isEditing = false
        this.getTodos()
      } catch (err) {
        console.error('PUT error:', err)
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`https://uhhoch5rm6.execute-api.us-east-1.amazonaws.com/todoapp/todos/${id}`)
        this.getTodos()
      } catch (err) {
        console.error('DELETE error:', err)
      }
    }
  }
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.todo-box {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.todo-box h1 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 16px;
}

.btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

.btn:hover {
  background-color: #2980b9;
}

.todo-list {
  list-style-type: none;
  padding: 0;
  margin-top: 16px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding: 10px 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit {
  background-color: #f1c40f;
}

.edit:hover {
  background-color: #d4ac0d;
}

.delete {
  background-color: #e74c3c;
}

.delete:hover {
  background-color: #c0392b;
}
</style>
