<template>
  <div class="feedDetail-container">
    <div class="container">
      <div class="photo-section">
        <img :src="imageUrl" class="feed-img"/>
      </div>
      <div class="content-section">
        <div class="user-header mb-20">
          <div class="user-info">
            <img
              :src="userimg"
              alt="profile"
              class="photo"
            />
            <div>{{ username }}</div>
          </div>
          <div class="detail-exit">
            <RouterLink :to="`/garden-diary/${username}`">
              <span class="material-icons">close</span>
            </RouterLink>
          </div>
        </div>
        <div class="content mb-10">
          <p>{{ content }}</p>
        </div>
        <div class="comments mb-10">
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기

// 라우터에서 id 파라미터 가져오기
const route = useRoute();
const username = ref(""); // 반응형 상태로 초기화
const feedId = ref(route.params.id); // URL에서 피드 ID를 가져옴
const loginState = useUserstore();

// API 기본 경로 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 반응형 데이터 선언
const content = ref("");
const comments = ref(["아직 댓글이 없습니다!"]);
const imageUrl = ref(""); // 프로필 이미지 URL을 저장할 상태
const userimg = ref("");

const token = localStorage.getItem("accessToken"); // 토큰을 가져오기

// 피드 상세 정보를 가져오는 함수
const fetchFeedDetail = async () => {
  try {
    // 서버에서 피드 상세 정보 조회
    const response = await axios.get(`${API_BASE_URL}/feeds/${feedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
      },
    });
    
    console.log("서버 응답:", response.data); // 서버 응답 로그 출력

    // 서버로부터 받은 피드 데이터를 사용하여 상태 업데이트
    const feedData = response.data;
    username.value = feedData.userNickname; // 반응형 상태로 업데이트
    userimg.value = loginState.imageUrl;
    content.value = feedData.feedContent;   // 반응형 상태로 업데이트
    const ftpImagePath = feedData.feedImage; // 서버에서 받은 이미지 경로

    // 이미지 경로가 존재하면 해당 경로를 사용, 없으면 기본 프로필 이미지 사용
    imageUrl.value = ftpImagePath
      ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`
      : "/default-profile-image.jpg";
    
  } catch (error) {
    console.error("피드 상세 조회 오류:", error);
    imageUrl.value = "/default-profile-image.jpg"; // 오류 시 기본 이미지 설정
  }
};

// 페이지가 로드될 때 피드 상세 정보를 가져오기
onMounted(() => {
  fetchFeedDetail();
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
  padding: 0;
  border: 2px solid #a68b6a;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.photo-section {
  flex: 1.8;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feed-img {
  width: 99%;
  height: 99%;
  object-fit: cover;
}

.photo {
  height: 30px;
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
  background-color: #f2d9bb;
  border-radius: 8px;
  border: 2px solid #a68b6a;
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
  height: 95%;
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
