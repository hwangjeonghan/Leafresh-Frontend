<template>
  <div class="feed-page">
    <div class="feed-container">
      <!-- FeedForm 컴포넌트 -->
      <FeedForm @addFeed="addFeed" />

      <!-- 다이어리 목록으로 돌아가기 버튼 -->
      <div style="margin-top: 20px">
        <button @click="goBackToDiary" class="btn btn-secondary">
          돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"; // vue-router 사용
import FeedForm from "@/components/feed/feedForm.vue"; // FeedForm 컴포넌트 import
import axios from "axios"; // axios import
import Swal from "sweetalert2"; // SweetAlert2 import
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 import

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter(); // router 사용 설정
const loginState = useUserstore(); // Pinia 스토어에서 유저 정보 가져오기

// 피드 추가 요청 처리 함수
const addFeed = (feedInfo) => {
  // 로컬 스토리지에서 엑세스 토큰 가져오기
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return Swal.fire({
      icon: 'warning',
      title: '인증 필요',
      text: '로그인이 필요합니다. 다시 로그인해주세요.',
    });
  }

  axios.post(`${API_BASE_URL}/feeds`, feedInfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 5000,
  })
  .then(async response => {
    const { success, message } = response.data;

    if (success) {
      await Swal.fire({
        icon: 'success',
        title: '성공',
        text: '피드가 성공적으로 등록되었습니다.',
      });
      goBackToDiary();
    } else {
      return Swal.fire({
        icon: 'error',
        title: '등록 실패',
        text: message || '피드 등록 중 오류가 발생했습니다.',
      });
    }
  })
  .catch(error => {
    console.error("피드 등록 오류:", error);
    let errorMessage = '서버와 통신 중 오류가 발생했습니다.';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버가 응답했지만 상태 코드가 2xx가 아님
        errorMessage = error.response.data.message || `서버 오류: ${error.response.status}`;
      } else if (error.request) {
        // 요청이 만들어졌으나 응답을 받지 못함
        errorMessage = '서버 응답이 없습니다. 네트워크 상태를 확인해주세요.';
      } else {
        // 요청 설정 중 문제 발생
        errorMessage = error.message;
      }
    }
    
    return Swal.fire({
      icon: 'error',
      title: '서버 오류',
      text: errorMessage,
    });
  });
};

// 다이어리 목록으로 돌아가기 함수
const goBackToDiary = () => {
  router.push(`/garden-diary/${loginState.userNickname}`); // 스토어에서 유저 닉네임을 가져와 이동
};
</script>

<style scoped>
.feed-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
}

.feed-container {
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
  padding: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.btn-secondary:active {
  transform: translateY(0);
}
</style>
