<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기
import loading from "../common/loading.vue";

const router = useRouter();
const loginState = useUserstore(); // Pinia 스토어에서 로그인 정보 가져오기
const myObject = ref([]); // 피드 데이터를 저장할 상태
const isLoading = ref(true); // 로딩 상태 관리

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // API 기본 경로

// 유저 피드를 가져오는 함수
const fetchUserFeeds = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // 액세스 토큰 가져오기

    const response = await axios.get(`${API_BASE_URL}/feeds/user/${loginState.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.length > 0) {
      // FTP 이미지 경로를 API를 통해 접근 가능한 URL로 변환
      myObject.value = response.data.map(feed => {
        return {
          ...feed,
          feedImage: feed.feedImage
            ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(feed.feedImage)}`
            : 'https://via.placeholder.com/150', // 기본 이미지 설정
        };
      });
    } else {
      console.log("유저의 피드가 없습니다.");
    }
  } catch (error) {
    console.error("피드 가져오기 오류:", error);
  } finally {
    isLoading.value = false; // 데이터를 모두 가져오면 로딩을 끝냄
  }
};

// 페이지 로드 시 피드 데이터 가져오기
onMounted(() => {
  fetchUserFeeds();
});

const goToFeedAdd = () => {
  router.push("/garden-diary/feed-add"); // 피드 추가 페이지로 이동
};
// 피드 상세 페이지로 이동하는 함수
const goToFeedDetail = (id) => {
  router.push(`/garden-diary/feed-detail/${loginState.userNickname}/${id}`);
};
</script>

<template>
  <div class="feed-container">
    <div v-if="isLoading" class="spinner-container">
      <loading/>
    </div>

    <ul v-else-if="myObject.length > 0" class="feed-list">
      <li
        v-for="(card, index) in myObject"
        :key="card.feedId"
        @click="goToFeedDetail(card.feedId)"
        class="feed-card"
      >
        <div class="card">
          <img
            :src="card.feedImage"
            alt="feed image"
            class="card-img"
          />
        </div>
      </li>
    </ul>

    <div v-else>
      <p>유저의 피드가 없습니다.</p>
    </div>

    <div style="text-align: center; margin-top: 20px">
      <button @click="goToFeedAdd" class="btn btn-primary">피드 추가</button>
    </div>
  </div>
</template>

<style scoped>
.feed-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.feed-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 한 줄에 4개의 열을 생성 */
  gap: 20px; /* 카드 간격 설정 */
  padding: 0;
  list-style-type: none;
  width: 100%;
  max-width: 1200px;
}

.feed-card {
  width: 100%;
  cursor: pointer;
}

.card {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
