<script setup>
import Calender from "./calender.vue";
import TodayTodo from "./todayTodo.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from 'axios';

import {
  isModalOpen,
  newTodoContent,
  openModal,
  closeModal,
} from "@/assets/js/todo"; // todo.js에서 가져옴
import { ref, computed } from "vue";


import { useTodoStore } from "@/stores/todoStore";
import { useUserstore } from "@/stores/users";


const todoStore = useTodoStore();
const userStore = useUserstore();
const userId = computed(() => userStore.userId);


// API_BASE_URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // VITE 환경변수로부터 읽어옴

// 할 일 추가 함수
const addTodo = async () => {
  if (!newTodoContent.value || !date.value) {
    alert('할 일 내용과 날짜를 모두 입력하세요.');
    return;
  }

  try {
    // 서버에 todo 데이터 전송
    const response = await axios.post(`${API_BASE_URL}/garden-diary/todo/add`, {
      todoContent: newTodoContent.value,  // 할 일 내용
      todoSelectedDate: date.value,     // 선택된 날짜
      userId: userId.value,           
    });

    if (response.status === 200) {
      // 성공적으로 저장된 경우 Pinia 스토어에 추가
      todoStore.addTodo({
        content: newTodoContent.value,
        selectedDate: date.value,
        userId: userId.value, // 추가로 userId도 저장
      });
      alert("할 일이 성공적으로 저장되었습니다.");
      
        // 입력 필드 초기화
        newTodoContent.value = '';
        date.value = null;


    } else {
      alert("저장 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error(error);
    alert("서버 요청 중 오류가 발생했습니다.");
  }

  closeModal();  // 모달 닫기
};



const date = ref();

</script>

<template>
  <div>
    <div class="garden_title">나의 정원일정</div>
    <div class="line_9"></div>

    <!-- 캘린더 -->

    <div class="schedule_container">
      <!-- Calender 컴포넌트에서 날짜 클릭 이벤트를 받아서 처리 -->
      <div class="calender_box">
        <Calender />
      </div>

      <div class="today_todo_box">
        <TodayTodo />

        <button @click="openModal">할일추가</button>
      </div>

    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Add New Todo</h2>

        <div>
          <h1>todo날짜를 입력하세용</h1>
          <VueDatePicker v-model="date" :enable-time-picker=false />
        </div>
        <input
          v-model="newTodoContent"
          placeholder="New todo"
          class="todo_input"
        />
        <button @click="addTodo">Save</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 나의 정원일정 */
.garden_title {
  font-family: "Ghanachocolate", sans-serif;
  font-size: 20px;
  background: linear-gradient(90deg, #f7e000, #ffb800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Line 9 */
.line_9 {
  height: 0px;
  border: 3px solid #f1ddc5;
  width: 85%;
}

.schedule_container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 40px;
  gap: 20px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

.todo_input {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
}
</style>
