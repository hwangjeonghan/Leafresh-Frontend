<template>
  <div class="todo-container">
    <h1 class="todo-header">Todo List</h1>

    <div class="today_todolist">
      <ul>
        <li v-for="todo in todos" :key="todo.id" class="todo-item">
          <input type="checkbox" class="todo-checkbox">
          <span class="todo-content">{{ todo.todoContent }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // todos 상태를 ref로 정의
  const todos = ref([]);
  
  // API로 오늘의 TODO 목록 가져오는 함수
  const fetchTodayTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/garden-diary/todo/today`);
      
      todos.value = response.data.todoIndex;

      console.log(response.data);
      console.log(response.data.todoIndex);


    } catch (error) {
      console.error('오늘날짜 가져오다 에러나버림! ', error);
    }
  };
  
  // 컴포넌트가 마운트되면 fetchTodayTodos 호출
  onMounted(() => {
    fetchTodayTodos();
  });
  </script>
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');

/* Container for the todo list */
.todo-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f0f4f8;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Lato', sans-serif;
  border-radius: 6px;
  box-shadow: 0px 2px 23px 0px #E4E6E9;
}

/* Header styling */
.todo-header {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Todo list container */
.today_todolist {
  padding: 20px;
 
}
.todo-checkbox{
  border-radius: 2px;
  background: #F2F3F3;
  width: 18px;
  height: 15px;
  flex-shrink: 0;
}

/* Each todo item */
.todo-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 간격을 20px으로 설정 */
  list-style-type: none;
 
}


</style>
