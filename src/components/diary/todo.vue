<template>
  <div>
    <h1>Todo List</h1>
     <!-- 오늘 날짜 표시 -->
      <p>Today's Date: {{ todayDate }}</p>

    <!-- 할 일 목록 표시 -->
    <ul>
      <li v-for="todo in todos" :key="todo.todoId">
        {{ todo.todoContent }}
        
      </li>
    </ul>

    <ul>
        <li v-for="todo in todos" :key="todo.todoId">
          <input type="checkbox" :checked="todo.todoStatus === 'Y'" @change="updateTodoStatus(todo)">
          {{ todo.todoContent }}
        </li>
      </ul>


    <!-- 할 일 추가 버튼 (모달 오픈 버튼) -->
    <button @click="openModal">Add Todo</button>

    <!-- 모달 -->
    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Add New Todo</h2>
        <input v-model="newTodoContent" placeholder="New todo" />
        <button @click="addTodo">Save</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// 반응성 변수를 정의한다. 
const todos = ref([]);  // 할 일 목록을 저장하는 배열
const newTodoContent = ref('');  // 새로운 할 일 내용을 저장
const isModalOpen = ref(false);  // 모달 표시 여부
const todayDate = ref('');  // 오늘 날짜를 저장


// 백엔드 연결을 위한 env 파일을 정의한다. 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 오늘 날짜를 포맷하여 저장
const formatTodayDate = () => {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options) + '일';
};

// 오늘 날짜를 setup 함수에서 설정
todayDate.value = formatTodayDate();



// 전체조회
// 1. axios.get 을 통해 벡엔드 서버의 정보를 가져온다
// 2. await 를 써서 정보를 다 가져올 때까지 기다린다.
// 3. response에 데이터가 담겨있고, todoIndex 가 잘 담겼는지 확인한다.
// 4. 담겨진 데이터를 todo.value 에 넣는다.
// 5. 오류가 날 경우 오류 출력하삼.

const fetchTodos = async () => {

  try{
    const response = await axios.get(`${API_BASE_URL}/garden-diary/todo/`);
    if(response.data && response.data.todoIndex) {
      todos.value = response.data.todoIndex;
    }

  }catch(error){
    console.error('할일 목록을 가져오다가 에러났습니당!', error);
  }

}

// 새로운 할일을 추가한다.
// 0. 모달창을 통해 사용자가 할일을 입력할 수 있는 페이지를 띠운다.
// 1. 사용자가 할일을 입력했는지 확인한다.
// 2. 할 일을 자알 입력했다면 axios.put 을 통해 서버로 할일을 보낸다.
// 3. 서버로 보낸 할일을 목록에 반영한다.
// 

 const addTodo = async () => {
  if(!newTodoContent.value.trim()) {
    console.log('입력된 todo가 없습니다.?_?');
    return;
  }


  try{
      const response = await axios.post(`${API_BASE_URL}/garden-diary/todo/create`, {
      todoContent: newTodoContent.value,
      todoCreateAt: new Date().toISOString(),
      userId: 1, // 유저 ID는 임의로 1로 설정
    });

    if (response.data && response.data.todoIndex) {
      todos.value.push(response.data.todoIndex); // 새로 추가된 할 일 목록에 반영
      newTodoContent.value = ''; // 입력 필드를 초기화
      closeModal(); // 할 일 추가 후 모달 닫기
  }

  }catch(error){

    console.error('새로운 거 추가하다 에러났지롱', error);

  }

};

// 체크박스에 따라 할일 목록의 상태를 업데이트 한다.



const updateTodoStatus = async (todo) => {
const newStatus = todo.todoStatus === 'Y' ? 'N' : 'Y'; // 상태 토글

try {
  const response = await axios.put(`${API_BASE_URL}/garden-diary/todo/update-status/${todo.todoId}`, {status: newStatus}); // Request body에 status를 직접 전달

  // 업데이트된 할 일을 반영
  todo.todoStatus = newStatus;
} catch (error) {
  console.error('할 일 상태 업데이트 중 오류 발생:', error);
}
};






 
// 모달 열고 닫기
const openModal = () => {  
 isModalOpen.value = true;
};

const closeModal = () => {
isModalOpen.value = false;
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
  width: 100
}

</style>
