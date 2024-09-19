<template>
    <div class="follow-list-container">
      <!-- 팔로워 목록 -->
      <div class="follow-column">
        <h2>팔로워 목록</h2>
        <ul v-if="followers.length" class="follow-list">
          <li v-for="follower in followers" :key="follower.userNickname" class="follow-card">
            <img :src="'data:image/jpeg;base64,' + follower.imageUrl" alt="Profile Image" class="profile-image" />
            <div class="user-info">
              <span class="user-nickname">{{ follower.userNickname }}</span>
            </div>
          </li>
        </ul>
        <p v-else class="empty-message">팔로워가 없습니다.</p>
      </div>
  
      <!-- 팔로잉 목록 -->
      <div class="follow-column">
        <h2>팔로잉 목록</h2>
        <ul v-if="following.length" class="follow-list">
          <li v-for="followedUser in following" :key="followedUser.userNickname" class="follow-card">
            <img :src="'data:image/jpeg;base64,' + followedUser.imageUrl" alt="Profile Image" class="profile-image" />
            <div class="user-info">
              <span class="user-nickname">{{ followedUser.userNickname }}</span>
            </div>
          </li>
        </ul>
        <p v-else class="empty-message">팔로잉하는 사용자가 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const followers = ref([]);
  const following = ref([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('accessToken');
  
  // 팔로워와 팔로잉 리스트를 가져오는 함수
  const fetchFollowLists = async () => {
    try {
      const followersResponse = await axios.get(`${API_BASE_URL}/follow/followers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      followers.value = followersResponse.data;
  
      const followingResponse = await axios.get(`${API_BASE_URL}/follow/following`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      following.value = followingResponse.data;
    } catch (error) {
      console.error('팔로워 및 팔로잉 리스트를 가져오는 중 오류 발생:', error);
    }
  };
  
  // 컴포넌트가 마운트될 때 팔로워와 팔로잉 리스트를 가져옴
  onMounted(fetchFollowLists);
  </script>
  
  <style scoped>
  .follow-list-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 10px;
    max-width: 1000px; 
    margin: 0 auto;
  }
  
  .follow-column {
    flex: 1;
  }
  
  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
    text-align: center;
  }
  
  .follow-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .follow-card {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 좌측 정렬 */
    padding: 10px; /* 패딩을 줄임 */
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); /* 그림자 크기를 줄임 */
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .follow-card:hover {
    transform: translateY(-3px); /* 호버 효과를 줄임 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-image {
    width: 50px; /* 프로필 이미지 크기 조정 */
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .user-nickname {
    font-size: 16px; /* 닉네임 크기 축소 */
    font-weight: 500; /* 폰트 굵기 조정 */
    color: #333;
  }
  
  .empty-message {
    text-align: center;
    color: #888;
    font-size: 14px;
    margin-top: 15px;
  }
  
  </style>
  