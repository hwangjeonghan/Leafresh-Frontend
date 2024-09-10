<template>
  <div>
    <h1>오늘 날짜를 선택하세요:</h1>
    <!-- 캘린더를 통한 날짜 선택 -->
    <DatePicker v-model="internalSelectedDate" />

    <!-- 선택된 날짜 표시 -->
    <p>선택된 날짜: {{ formattedDate }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore'; // Pinia 스토어 가져오기
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

// Pinia 스토어 사용
const todoStore = useTodoStore();

// 내부적으로 사용될 selectedDate
const internalSelectedDate = ref(todoStore.clickedDate || new Date().toISOString().slice(0, 10));

// selectedDate가 변경될 때 Pinia 스토어 업데이트
watch(internalSelectedDate, (newVal) => {
  todoStore.setClickedDate(newVal); // Pinia 스토어 업데이트
});

// 선택된 날짜를 YYYY-MM-DD 형식으로 변환하여 표시
const formattedDate = computed(() => {
  return internalSelectedDate.value ? new Date(internalSelectedDate.value).toISOString().slice(0, 10) : '';
});
</script>

  
