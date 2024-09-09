<script setup>
import Calender from './calender.vue';
import Todo from './todo.vue';
import TodayTodo from './todayTodo.vue';
import { todos, isModalOpen, clickedDate, newTodoContent, openModal, closeModal, addTodo } from '@/assets/todo'; // todo.js에서 가져옴




</script>

<template>
  <div>
    <div class="garden_title">나의 정원일정</div>
    <div class="line_9"></div>

    
    <!-- 캘린더 -->

    <div class="schedule_container">
        <!-- Calender 컴포넌트에서 날짜 클릭 이벤트를 받아서 처리 -->
        <div class="calender_box">
          <Calender @open-modal="openModal" /> 
        </div>

        <div class="today_todo_box">
          <TodayTodo />

        </div>
    


    
      
    </div>




    <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Add New Todo</h2>
        <h2>{{ clickedDate }} 일 </h2> <!-- 클릭한 날짜 표시 -->
        <input v-model="newTodoContent" placeholder="New todo" />
        <button @click="addTodo">Save</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>


  </div>
</template>

<style scoped>
/* 나의 정원일정 */
.garden_title {
  font-family: 'Ghanachocolate', sans-serif;
  font-size: 20px;
  background: linear-gradient(90deg, #f7e000, #ffb800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Line 9 */
.line_9 {
  height: 0px;
  border: 3px solid #F1DDC5;
}

.schedule_container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px;
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
</style>
