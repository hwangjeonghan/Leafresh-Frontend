<script setup>
import { onMounted } from 'vue';
import { useFollowStore } from '@/stores/followStore';

const followStore = useFollowStore();
const token = localStorage.getItem('accessToken');

// 팔로워 및 팔로잉 리스트 가져오기
onMounted(async () => {
  if (token) {
    await followStore.fetchFollowLists(token);
  }
});
</script>

<template>
  <div class="follow-list-container">
    <!-- 팔로워 목록 -->
    <div class="follow-column">
      <h2>팔로워 목록</h2>
      <ul v-if="followStore.followers.length" class="follow-list">
        <li v-for="follower in followStore.followers" :key="follower.userNickname" class="follow-card">
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
      <ul v-if="followStore.following.length" class="follow-list">
        <li v-for="followedUser in followStore.following" :key="followedUser.userNickname" class="follow-card">
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
    justify-content: flex-start;
    padding: 10px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .follow-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-image {
    width: 50px;
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
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  .empty-message {
    text-align: center;
    color: #888;
    font-size: 14px;
    margin-top: 15px;
  }
  </style>
  