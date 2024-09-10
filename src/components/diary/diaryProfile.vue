<template>
    <div class="profile-container">
      <!-- 프로필 이미지와 사용자 정보 -->
      <div class="profile-header" v-if="profileExists">
        <div class="profile-image-container">
          <img :src="profileImage" alt="Profile Image" class="profile-image" />
        </div>
        <div class="profile-info">
          <div class="profile-header-row">
            <h2 class="profile-username">{{ username }}</h2>
            <button class="follow-button">👤+</button>
          </div>
          <div class="profile-stats">
            <span>반려식물 {{ followerPlants }}개</span>
            <span>판매식물 {{ salePlants }}개</span>
            <span>팔로워 {{ followers }}명</span>
          </div>
          <div class="profile-bio">
            <p class="profile-title">{{ profileTitle }}</p>
            <p class="profile-description">{{ profileDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기
  
  const userStore = useUserstore(); // Pinia 스토어 인스턴스 가져오기
  const profileExists = ref(true);
  const profileImage = ref('https://via.placeholder.com/150');
  const username = ref('Unknown User');
  const followerPlants = ref(17);
  const salePlants = ref(5);
  const followers = ref('1만');
  const profileTitle = ref('자연을 사랑하는 식집사');
  const profileDescription = ref('식물 관련 정보를 함께 나눠요!\n희귀식물 00 아가들 분양중..');
  
  const router = useRouter();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Pinia store의 fetchUserProfile 메서드 호출
  const fetchUserProfile = async () => {
    await userStore.fetchUserProfile(); // 사용자 정보를 가져오는 메서드 호출
  };
  
  // watch를 사용하여 userStore의 상태 변화를 감지
  watch(
    () => userStore.userNickname,
    (newNickname) => {
      if (newNickname) {
        username.value = newNickname;
      }
    },
    { immediate: true } // 초기 로드 시에도 실행되도록 설정
  );
  
  watch(
    () => userStore.imageUrl,
    (newImageUrl) => {
      profileImage.value = newImageUrl || 'https://via.placeholder.com/150';
    },
    { immediate: true } // 초기 로드 시에도 실행되도록 설정
  );
  
  onMounted(async () => {
    await fetchUserProfile(); // 컴포넌트가 로드될 때 사용자 정보 가져오기
    try {
      // 프로필 정보 가져오기
      const response = await axios.get(`${API_BASE_URL}/profile/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
  
      const profileData = response.data;
      profileTitle.value = profileData.profileTitle || '프로필 제목 없음';
      profileDescription.value = profileData.profileDescription || '프로필 설명 없음';
    } catch (error) {
      console.error('프로필 정보 가져오기 오류:', error);
      if (error.response && error.response.status === 404) {
        alert('프로필이 존재하지 않습니다. 프로필을 먼저 등록해주세요.');
        router.push('/profile/registration');
      } else {
        alert('프로필을 가져오는 중 오류가 발생했습니다.');
        router.push('/login'); // 오류 발생 시 로그인 페이지로 이동
      }
    }
  });
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
  }
  
  .profile-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: #ddd;
  }
  
  .profile-info {
    padding-left: 30px;
  }
  
  .profile-header-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
  
  .profile-username {
    font-size: 32px;
    font-weight: bold;
  }
  
  .follow-button {
    padding: 8px 15px;
    margin-left: 30px;
    border: none;
    background-color: #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
  }
  
  .follow-button:hover {
    background-color: #d4d4d4;
  }
  
  .profile-stats {
    margin: 15px 0;
    font-size: 20px;
    display: flex;
    padding-bottom: 20px;
    gap: 30px;
  }
  
  .profile-bio {
    margin-top: 15px;
    font-size: 18px;
  }
  
  .profile-title {
    font-weight: bold;
    font-size: 20px;
    padding-bottom: 10px;
  }
  
  .profile-description {
    white-space: pre-line;
    color: #666;
    font-size: 18px;
  }
  </style>
  