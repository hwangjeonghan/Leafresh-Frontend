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
  <div class="diaryschedule_container">
    
    <div class="garden_title">나의 정원일정</div>
    <div class="hairline"></div>

    <!-- 캘린더 -->

    <div class="schedule_container">
      <!-- Calender 컴포넌트에서 날짜 클릭 이벤트를 받아서 처리 -->
      <div class="calender_box">
        <Calender />
      </div>

      <div class="today_todo_box">
        <TodayTodo />

        <button class="todo_input_button" @click="openModal">할일추가</button>
      </div>

    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Add New Todo</h2>

        <div class="datepicker_container">
         
          <VueDatePicker v-model="date" :enable-time-picker=false />
        </div>
        <input
          v-model="newTodoContent"
          placeholder="New todo"
          class="todo_input"
        />
        <div class="modal_button">
          <button class="button_save" @click="addTodo">저장</button>
          <button class="button_cancel" @click="closeModal">취소</button>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
    font-family: 'LeeSeoyun';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.diaryschedule_container{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

/* 나의 정원일정 */
.garden_title {
  font-family: 'LeeSeoyun', sans-serif;
  font-size: 30px;
  margin-top: 20px;
  font-weight: bold;
}


/* 헤어라인 div 스타일 */
.hairline {
  width: 85%; /* 선 길이 */
  height: 1px; /* 얇은 선 */
  margin: 20px 0; /* 상하 여백 */
  border: #904F00 solid 2px;
}
.schedule_container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 50px;
  padding: 5px;
}

.today_todo_box{
  margin: 30px;
}

/* 할일 추가 버튼 */

.todo_input_button {
  font-family: 'LeeSeoyun', sans-serif; /* 폰트 설정 */
  padding: 10px 20px; /* 버튼의 내부 여백 */
  background-color: #904F00; /* 버튼 배경색 */
  color: white; /* 버튼 텍스트 색상 */
  border: none; /* 기본 테두리 제거 */
  border-radius: 8px; /* 둥근 모서리 */
  font-size: 16px; /* 텍스트 크기 */
  cursor: pointer; /* 커서 모양 변경 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 부드러운 애니메이션 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
}

/* 마우스를 올렸을 때 효과 */
.todo_input_button:hover {
  background-color: #ff7b24; /* hover 시 배경색 */
  transform: translateY(-2px); /* 살짝 올라가는 효과 */
}

/* 클릭했을 때 효과 */
.todo_input_button:active {
  background-color: #e56620; /* 클릭 시 배경색 */
  transform: translateY(0); /* 클릭 시 원래 위치로 */
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



/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s forwards; /* 모달 등장 애니메이션 */
}

/* 모달 내용 스타일 */
.modal-content {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 16px;
  width: 400px; /* 모달의 너비를 약간 넓게 조정 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2); /* 더 깊은 그림자 */
  text-align: center;
  transform: scale(0.8);
  animation: popUp 0.3s forwards; /* 팝업 애니메이션 */
}


.datepicker_container {
  text-align: center; /* 텍스트 중앙 정렬 */
  margin-bottom: 10px; /* 전체 하단 여백을 줄여서 모달 안에서 더 조밀하게 */
}

.datepicker_container h1 {
  font-size: 18px; /* 제목 폰트 크기 조정 */
  margin-bottom: 5px; /* h1과 DatePicker 간의 간격을 좁힘 */
}

.datepicker_container .vue-datepicker {
  margin-top: 0; /* DatePicker 위쪽 간격을 없앰 */
  width: 100%; /* DatePicker의 너비를 100%로 조정하여 모달 너비에 맞춤 */
  max-width: 350px; /* DatePicker의 최대 너비 제한 */
}


/* 모달 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes popUp {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

/* 제목 스타일 */
.modal-content h2 {
  font-family: 'LeeSeoyun', sans-serif; /* 폰트 설정 */
  margin-top: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

/* 입력 필드 스타일 */
.modal-content input {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box; /* 입력 필드가 박스 크기를 넘지 않도록 */
  transition: border-color 0.3s;
}

.modal-content input:focus {
  border-color: #4CAF50; /* 포커스 시 테두리 색상 변경 */
  outline: none; /* 기본 포커스 테두리 제거 */
}

/* 모달 버튼 */
.modal_button {
  display: flex;
  justify-content: space-between; /* 버튼 간 간격 */
  gap: 10px; /* 버튼 사이의 여백 */
  margin-top: 20px; /* 버튼 상단 여백 */
}

.button_save,
.button_cancel {
  font-family: 'LeeSeoyun', sans-serif; /* 폰트 설정 */
  padding: 10px 20px; /* 버튼의 내부 여백 */
  font-size: 16px; /* 텍스트 크기 */
  border: none; /* 기본 테두리 제거 */
  border-radius: 8px; /* 둥근 모서리 */
  cursor: pointer; /* 커서 모양 변경 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 부드러운 애니메이션 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
}

/* 저장 버튼 스타일 */
.button_save {
  background-color: #4CAF50; /* 저장 버튼의 기본 배경색 (녹색) */
  color: white; /* 저장 버튼의 텍스트 색상 */
}

.button_save:hover {
  background-color: #45a049; /* hover 시 배경색 */
  transform: translateY(-2px); /* hover 시 살짝 올라가는 효과 */
}

.button_save:active {
  background-color: #3e8e41; /* 클릭 시 배경색 */
  transform: translateY(0); /* 클릭 시 원래 위치로 */
}

/* 취소 버튼 스타일 */
.button_cancel {
  background-color: #f44336; /* 취소 버튼의 기본 배경색 (빨간색) */
  color: white; /* 취소 버튼의 텍스트 색상 */
}

.button_cancel:hover {
  background-color: #da190b; /* hover 시 배경색 */
  transform: translateY(-2px); /* hover 시 살짝 올라가는 효과 */
}

.button_cancel:active {
  background-color: #c12e2a; /* 클릭 시 배경색 */
  transform: translateY(0); /* 클릭 시 원래 위치로 */
}
</style>
