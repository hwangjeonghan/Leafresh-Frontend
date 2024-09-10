import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTodoStore = defineStore('todo', () => {
  const clickedDate = ref(''); // 선택된 날짜 저장

  // 날짜 업데이트 함수
  const setClickedDate = (date) => {
    clickedDate.value = date;
  };

  return { clickedDate, setClickedDate };
});
