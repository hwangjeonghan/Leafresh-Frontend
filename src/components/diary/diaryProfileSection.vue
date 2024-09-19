<template>
    <div class="container">
      <!-- 다이어리 프로필 섹션 -->
      <diary-profile />
  
      <!-- 팔로우 리스트 섹션 슬라이더 -->
      <div class="slider" :class="{ 'slider-active': isSliderActive }">
        <follow-list />
      </div>
  
      <!-- 팔로우 목록 버튼 -->
      <button class="follow-button" @click="toggleSlider">
        팔로우목록
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import DiaryProfile from './diaryProfile.vue';
  import FollowList from './FollowersFollowingList.vue';
  
  const isSliderActive = ref(false);
  
  // 슬라이더를 열고 닫는 함수
  const toggleSlider = () => {
    isSliderActive.value = !isSliderActive.value;
  };
  </script>
  
  <style scoped>
  /* 컨테이너 스타일 */
  .container {
    display: flex;
    position: relative;
  }
  
  /* 팔로우 목록 버튼 스타일 */
  .follow-button {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    z-index: 10;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 50px, 10px;
    padding: 10px;
    width: 40px;
    height: 150px;
    cursor: pointer;
    transition: transform 0.3s ease, right 0.3s ease;
    writing-mode: vertical-rl; /* 텍스트를 세로로 */
    text-align: center;
    font-size: 16px;
    letter-spacing: 5px;
  }
  
  /* 슬라이더 스타일 */
  .slider {
    position: fixed;
    top: 0;
    right: -40%; /* 처음에는 화면 밖에 위치 */
    width: 40%;
    height: 100%;
    background-color: #f9f9f9;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    transition: right 0.3s ease;
    z-index: 9;
  }
  
  /* 슬라이더가 활성화되면 오른쪽 끝으로 이동 */
  .slider-active {
    right: 0;
  }
  
  /* 팔로우 버튼이 슬라이더와 함께 움직이도록 조정 */
  .slider-active + .follow-button {
    transform: translate(0, -50%);
    right: 40%; /* 슬라이더와 함께 이동 */
  }
  </style>
  