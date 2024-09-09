import { ref } from 'vue';
import axios from 'axios';

// API_BASE_URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // VITE 환경변수로부터 읽어옴

// 할일 저장
const todos = ref([]);

// 모달 상태 관리
const isModalOpen = ref(false);  // 모달 열림 여부
const clickedDate = ref(null);   // 클릭한 날짜 저장
const newTodoContent = ref('');  // 새로운 할 일 입력을 위한 변수

// 모달 열기/닫기 함수
const openModal = (day) => {
  clickedDate.value = day;  // 클릭한 날짜 저장
  isModalOpen.value = true; // 모달 열기
};



const closeModal = () => {
  isModalOpen.value = false; // 모달 닫기
};

// 할 일 추가 함수
const addTodo = async () => {
  if (!newTodoContent.value.trim()) {
    console.log('입력된 todo가 없습니다.');
    return;
  }
  try {
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
  } catch (error) {
    console.error('새로운 거 추가하다 에러났지롱', error);
  }
};

// 클릭한 날짜와 todos 상태를 리턴
export {
  todos,
  isModalOpen,
  clickedDate,
  newTodoContent,
  openModal,
  closeModal,
  addTodo
};
