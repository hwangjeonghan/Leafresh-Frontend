<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // useRouter 사용
import axios from "axios";
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기

import FeedCard from "@/components/feed/feedCard.vue";
import GardenCard from "@/components/diary/diaryCard.vue";
import Profile from "@/components/diary/diaryProfile.vue";
import Schedule from "@/components/diary/diarySchedule.vue";

const router = useRouter();
const activeComponent = ref("Feed");
const accessToken = localStorage.getItem("accessToken");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loginState = useUserstore(); // Pinia 스토어에서 로그인된 사용자 정보 가져오기
const feedData = ref([]); // 피드 데이터를 저장할 상태
const isLoading = ref(false); // 로딩 상태 추가

// 피드 데이터를 가져오는 함수
const fetchUserFeeds = async () => {
  isLoading.value = true; // 로딩 상태 시작
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.get(`${API_BASE_URL}/feeds/id/${loginState.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && response.data.length > 0) {
      feedData.value = response.data.map(feed => {
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
    isLoading.value = false; // 로딩 상태 종료
  }
};

// 로그인 상태 확인 및 피드 데이터 불러오기
onMounted(async () => {
  if (!accessToken) {
    router.push("/login"); // 로그인이 되어 있지 않으면 로그인 페이지로 리다이렉트
  } else {
    console.log(`현재 유저: ${loginState.userNickname}`);
    await fetchUserFeeds(); // 피드 데이터를 비동기로 불러오기
  }
});

// 각 컴포넌트를 미리 등록
const components = {
  Feed: FeedCard,
  Garden: GardenCard,
};
</script>

<template>
  <div class="diary_container">
    <div class="profile">
      <Profile />
    </div>
    <div class="schedule">
      <Schedule />
    </div>

    <ul class="diary_card_nav">
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeComponent === 'Feed' }"
          @click="activeComponent = 'Feed'"
          >피드</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeComponent === 'Garden' }"
          @click="activeComponent = 'Garden'"
          >반려정원</a
        >
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          :class="{ active: activeComponent === 'Adoption' }"
          @click="activeComponent = 'Adoption'"
          >분양중</a
        >
      </li>
    </ul>

    <div class="hairline"></div>

    <!-- 선택된 컴포넌트만 교체 -->
    <div class="Card">
      <component :is="components[activeComponent]" :feedData="feedData" />
    </div>
  </div>
</template>

<style scoped>
.diary_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.profile,
.schedule,
.card {
  width: 95%;
  margin: 10px 0;
}

/* 헤어라인 div 스타일 */
.hairline {
  width: 85%; /* 선 길이 */
  height: 1px; /* 얇은 선 */
  margin: 20px 0; /* 상하 여백 */
  border: #a68b6a solid 2px;
}

.nav-tabs {
  border-bottom: 2px solid #eee;
  width: 100%;
  justify-content: center;
}

.nav-item {
  margin: 0 20px;
}

.nav-link {
  font-family: "GothicA1-Light";
  color: #000;
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 10px;
  position: relative;
  text-align: center;
  cursor: pointer;
}

.nav-link.active {
  color: #a68b6a;
}

.nav-link:hover {
  color: #a68b6a;
}

.diary_card_nav {
  display: flex;
  flex-direction: row;
  width: 95%;
  justify-content: space-around;
}

.Card {
  width: 85%;
}
</style>
