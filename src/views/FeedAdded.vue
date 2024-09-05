<template>
    <div class="feed-page">
      <div class="feed-container">
        <FeedForm @addFeed="addFeed" />
  
        <!-- 다이어리 목록으로 돌아가기 버튼 -->
        <div style="margin-top: 20px;">
          <button @click="goBackToDiary" class="btn btn-secondary">
            돌아가기
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import
  import FeedForm from '@/components/feed/feedForm.vue';  // FeedForm 컴포넌트 import
  import axios from 'axios';  // axios import
  
  // 환경 변수에서 API URL 가져오기
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const router = useRouter();  // router 사용 설정
  
  // 피드 추가 요청 처리 함수
  const addFeed = async (feedInfo) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/feeds`, feedInfo);  // 서버에 피드 추가 요청 전송
      if (response.data.success) {
        // 피드 추가 성공 시 가든 다이어리 페이지로 리다이렉트
        alert('피드가 성공적으로 등록되었습니다.');
        router.push('/garden-diary');
      } else {
        alert('피드 등록 실패: ' + response.data.message);
      }
    } catch (error) {
      console.error('피드 등록 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };
  
  // 다이어리 목록으로 돌아가기 함수
  const goBackToDiary = () => {
    router.push('/garden-diary');  // 다이어리 목록 페이지로 이동
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
  