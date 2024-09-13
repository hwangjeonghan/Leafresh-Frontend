<template>
  <div class="todo-container">
    <h1 class="todo-header">Today's Todo List</h1>
    <div class="today_date"></div> 
    <div class="today_todolist">

      <div class="todo_box">
        <ul>
        <li v-for="todo in todos" :key="todo.todoId" class="todo-item">
          <input type="checkbox" class="todo-checkbox">
          <span class="todo-content">{{ todo.todoContent }}</span>
          <button class="delete-btn" @click="deleteTodo(todo.todoId, 0)"> x</button>
        </li>
      </ul>
      </div>
      
    </div>
  </div>
</template>
  
  <script setup>
  import { useUserstore } from "@/stores/users";
  import { useTodoStore } from "@/stores/todoStore";
  import { ref, onMounted, computed, watch } from 'vue';
  import axios from 'axios';

// 사용자 및 todo 상태정의
  const userStore = useUserstore();
  const todoStore = useTodoStore();

  const userId = computed(() => userStore.userId);
  // todos 상태를 ref로 정의
  const todos = ref([]);
  
  // 엔드포인트 연결
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  // pinia 스토어의 todo를 상태를 감지하고 반영
  watch(
    () => useTodoStore.todos,
    (newTodos) => {
      todos.value = newTodos;
    },
    {immediate: true }
  );



  // API로 오늘의 TODO 목록 가져오는 함수
  const fetchTodayTodos = async () => {
    try {
      // userId를 가져와 쿼리 파라미터로 사용
      const response = await axios.get(`${API_BASE_URL}/garden-diary/todo/today`, {
        params: {
          userId: userId.value  // userId를 쿼리 파라미터로 추가
        }
      });

        // API 응답 확인
       console.log("API 응답:", response.data.todoIndex);
      
      if (response.data && response.data.todoIndex) {
        todos.value = response.data.todoIndex;
        todoStore.setTodos(response.data.todoIndex);  // Pinia 스토어에 todos 저장

      } else {
        console.log('todoIndex가 없습니다. 응답 데이터:', response.data);
      }


    } catch (error) {
      console.error('오늘날짜 가져오다 에러나버림! ', error);
    }
  };


// 할 일을 삭제하는 함수 (todoId와 action을 서버로 전송)
const deleteTodo = async (todoId, action) => {

  console.log("삭제할 todoId:", todoId);

  if (!todoId) {
    console.error("todoId가 없습니다:", todoId); // null 또는 undefined 체크
    return;
  }
  

  try {
    // 서버로 POST 요청 (todoId와 action을 JSON 형태로 전송)
    const response = await axios.post(`${API_BASE_URL}/garden-diary/todo/delete`, {
      todoId: todoId,
      action: action
    });

    // 서버 응답에서 status와 message를 확인
    const { status, message, deletedTodoId } = response.data;
    if (status === "success") {
      // action이 0이면 목록에서 삭제
      todos.value = todos.value.filter(todo => todo.todoId !== deletedTodoId);
      todoStore.setTodos(todos.value);  // Pinia 스토어에서 상태 업데이트
  
      alert(message);  // 서버의 메시지를 UI에 표시
    } else {
      alert(message);  // 실패 메시지
    }
  } catch (error) {
    console.error('할 일 삭제 중 에러 발생:', error);
  }
};
  
  // 컴포넌트가 마운트되면 fetchTodayTodos 호출
  onMounted(() => {
    fetchTodayTodos();
  });
  </script>
<style scoped>


/* Container for the todo list */
.todo-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f0f4f8;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'LeeSeoyun', sans-serif; /* 폰트 적용 */
  border-radius: 6px;
  box-shadow: 0px 2px 23px 0px #E4E6E9;
}

/* Header styling */
.todo-header {
  font-size: 30px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Todo list container */
.today_todolist {
  padding: 10px;
 
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

  width: 80%;
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* 간격을 20px으로 설정 */
  list-style-type: none;
 
}

.todo_box{
  width: 400px;
  height: 100px;
}

.todo-content {
  font-size: 20px;


}

/* 삭제버튼 */

.delete-btn {
  color: #000;
  border: none;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}

</style>
