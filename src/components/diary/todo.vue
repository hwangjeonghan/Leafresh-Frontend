<template>
  <div>
    <h1>Todo List</h1>
    <!-- 오늘 날짜 표시 -->
    <p>Today's Date: {{ todayDate }}</p>

    <!-- 할 일 목록 표시 -->
    <ul>
      <li v-for="todo in todos" :key="todo.todoId">
        <input type="checkbox" :checked="todo.todoStatus === 'Y'" @change="updateTodoStatus(todo)">
        {{ todo.todoContent }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 반응성 변수를 정의한다.
const todos = ref([]);  // 할 일 목록을 저장하는 배열
const newTodoContent = ref('');  // 새로운 할 일 내용을 저장

const todayDate = ref('');  // 오늘 날짜
const clickedDate = ref(null); // 클릭한 날짜를 저장하는 변수 추가

// 선택된 날짜를 상위 컴포넌트에서 받는다
defineProps({
  selectedDate: {
    type: [Date, null], // Date 또는 null 타입
    default: null
  }
});

// 백엔드 연결을 위한 env 파일을 정의한다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 오늘 날짜를 포맷하여 저장
todayDate.value = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' 일';

// 전체조회
const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/garden-diary/todo/`);
    if (response.data && response.data.todos) {  // 올바른 데이터 필드 확인
      todos.value = response.data.todos;
    }
  } catch (error) {
    console.error('할 일 목록을 가져오다가 에러났습니다!', error);
  }
};

// 체크박스에 따라 할일 목록의 상태를 업데이트 한다.
const updateTodoStatus = async (todo) => {
  const newStatus = todo.todoStatus === 'Y' ? 'N' : 'Y'; // 상태 토글

  try {
    await axios.put(`${API_BASE_URL}/garden-diary/todo/update-status/${todo.todoId}`, { status: newStatus }); // 서버에 상태 업데이트 요청

    // 요청이 성공한 후 상태 업데이트
    todo.todoStatus = newStatus;
  } catch (error) {
    console.error('할 일 상태 업데이트 중 오류 발생:', error);
  }
};

// 컴포넌트가 마운트될 때 전체 할 일 목록을 불러옴
onMounted(() => {
  fetchTodos();
});
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  margin-top: 10px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
}

.modal-content input {
  width: 100%;
}
</style>
