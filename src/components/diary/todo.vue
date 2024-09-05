<template>
    <div>
      <h1>Todo List</h1>
      
      <!-- 할 일 목록 표시 -->
      <ul>
        <li v-for="todo in todos" :key="todo.todoId">
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
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  

  export default {
    setup() {
      const todos = ref([]);  // 할 일 목록을 저장하는 배열
      const newTodoContent = ref('');  // 새로운 할 일 내용을 저장
      const isModalOpen = ref(false);  // 모달 표시 여부

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
      // 전체 할 일 목록을 가져오는 함수
      const fetchTodos = async () => {
        try {
          const response = await axios.get('http://localhost:8080/garden-diary/todo/');
          if (response.data && response.data.todoIndex) {
            todos.value = response.data.todoIndex;
          }
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      };
  
      // 새로운 할 일 추가 함수
      const addTodo = async () => {
        if (!newTodoContent.value.trim()) {
          return;
        }
  
        try {
          const response = await axios.post(`${API_BASE_URL}/garden-diary/todo/create`, {
            todoContent: newTodoContent.value,
            todoCreateAt: new Date().toISOString(),
            userId: 1 // 유저 ID는 임의로 1로 설정
          });
  
          if (response.data && response.data.todoIndex) {
            todos.value.push(response.data.todoIndex);  // 새로 추가된 할 일 목록에 반영
            newTodoContent.value = '';  // 입력 필드를 초기화
            closeModal();  // 할 일 추가 후 모달 닫기
          }
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      };
  
      // 모달 열기/닫기
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
  
      return {
        todos,
        newTodoContent,
        isModalOpen,
        openModal,
        closeModal,
        addTodo
      };
    }
  };
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
  