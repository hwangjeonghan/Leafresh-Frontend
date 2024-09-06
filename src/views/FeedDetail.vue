<template>
    <div class="feedDetail-container">
      <div class="container">
        <div class="photo-section">
          
        </div>
        <div class="content-section">
          <div class="user-header mb-20 ">
            <div class="user-info">
              <img :src="imageUrl || '/default-profile-image.jpg'" alt="profile" class="photo" />
              <div>{{ username }}</div>
            </div>
            <div class="detail-exit">
              <RouterLink to="/garden-diary"><span class="material-icons">close</span></RouterLink>
            </div>
          </div>
          <div class="content mb-10 ">
            <p>{{ content }}</p>
          </div>
          <div class="comments mb-10 ">
            <div>Comments</div>
            <ul>
              <li v-for="(comment, index) in comments" :key="index">
                {{ comment }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  // 라우터에서 id 파라미터 가져오기
  const route = useRoute();
  const username = ref(route.params.username); // URL에서 유저 이름을 가져옴
  const feedId = ref(route.params.id); // URL에서 피드 ID를 가져옴
  
  // API 기본 경로 설정
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // 반응형 데이터 선언

  const content = ref('This is a sample post content.');
  const comments = ref([
    'This is the first comment.',
    'Nice photo!',
    'Love this!',
  ]);
  const imageUrl = ref('');  // 프로필 이미지 URL을 저장할 상태
  
  // 사용자 프로필 정보를 가져오는 함수
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${feedId}`);
      const userProfile = response.data;
      username.value = userProfile.username;
      content.value = userProfile.content;  // 사용자의 게시물 내용
      const ftpImagePath = userProfile.imageUrl;  // 서버에서 받은 이미지 경로
      imageUrl.value = ftpImagePath
        ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`
        : '/default-profile-image.jpg';  // 기본 프로필 이미지 설정
    } catch (error) {
      console.error('프로필 로드 오류:', error);
      imageUrl.value = '/default-profile-image.jpg';  // 오류 시 기본 이미지 설정
    }
  };
  
  // 페이지가 로드될 때 사용자 정보 가져오기
  onMounted(() => {
    fetchUserProfile();
  });
  </script>
  
  <style scoped>
  .mb-10 {
    margin-bottom: 10px;
  }

  .mb-20 {
    margin-bottom: 20px;
  }
  
  .user-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .detail-exit {
    
  }

  .feedDetail-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 95%;
    height: 800px;
    max-width: 1200px;
    margin: 0 auto;
    border: 2px solid #A68B6A;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .photo-section {
    flex: 1.8;
  }
  
  .photo {
    height: 20px;
    border-radius: 50%; /* 원형 이미지로 표시 */
    margin-right: 20px;
  }
  
  .content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #F2D9BB;
    border-radius: 8px;
    border: 2px solid #A68B6A;
  }
  
  .user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  .user-info h3 {
    margin: 0;
    font-size: 1.2em;
    font-weight: bold;
  }
  
  .content {
    flex: 3;
  }

  .content p {
    margin-top: 10px;
    font-size: 1em;
  }
  
  .comments {
    flex: 2;
  }

  .comments h4 {
    margin-top: 20px;
    font-size: 1.1em;
  }
  
  .comments ul {
    height:95%;
    list-style-type: none;
    border: none;
    border-radius: 10px;
    background-color: #fff;
    padding: 5px;
  }
  
  .comments li {
    margin-top: 10px;
    font-size: 0.9em;
  }
  </style>
  