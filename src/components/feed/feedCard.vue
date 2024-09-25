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
            loading="lazy"
          />
        </div>
      </li>
    </ul>

    <div v-else>
      <p>유저의 피드가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from 'sweetalert2'; // Swal 사용을 통한 에러 처리
import loading from "../common/loading.vue";

const router = useRouter();
const route = useRoute();
const userNickname = ref(route.params.userNickname);
const myObject = ref([]); // 피드 데이터를 저장할 상태
const isLoading = ref(true); // 로딩 상태 관리

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // API 기본 경로

// 유저 피드를 가져오는 함수
// 유저 피드를 가져오는 함수
const fetchUserFeeds = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: '인증 오류',
        text: '로그인이 필요합니다.',
      });
      router.push('/login');
      return;
    }

    console.log(`Fetching feeds for user: ${userNickname.value}`);
    const response = await axios.get(`${API_BASE_URL}/feeds/nickname/${userNickname.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 응답 데이터가 있고 피드 목록이 있을 경우 처리
    if (response.data && response.data.length > 0) {
      myObject.value = response.data.map(feed => {
        return {
          ...feed,
          feedImage: feed.feedImage
            ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(feed.feedImage)}`
            : 'https://via.placeholder.com/150',
        };
      });
    } else {
      myObject.value = [];
    }
  } catch (error) {
    // 404 상태 코드에 대한 처리
    if (error.response && error.response.status === 404) {
      console.log("유저의 피드가 없습니다!");
      myObject.value = []; // 피드 데이터를 빈 배열로 설정하여 처리
    } else {
      // 다른 오류에 대한 처리
      Swal.fire({
        icon: 'error',
        title: '서버 오류',
        text: '피드를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    }
  } finally {
    isLoading.value = false;
  }
};


// 페이지 로드 시 피드 데이터 가져오기
onMounted(() => {
  fetchUserFeeds();
});

// userNickname이 변경될 때마다 피드 데이터 다시 가져오기
watch(() => route.params.userNickname, (newNickname) => {
  userNickname.value = newNickname;
  isLoading.value = true;
  fetchUserFeeds();
});

// 피드 상세 페이지로 이동하는 함수
const goToFeedDetail = (id) => {
  router.push(`/garden-diary/feed-detail/${userNickname.value}/${id}`); // 피드 상세 페이지로 이동
};
</script>

<style scoped>
.feed-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.spinner-container {
  display: flex;
  justify-content: center;
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
  margin-bottom: 10px;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
