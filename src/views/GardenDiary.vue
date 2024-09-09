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

// 로그인된 사용자의 피드 데이터를 가져오는 함수
const fetchUserFeed = async () => {
  if (!accessToken) {
    router.push("/login"); // 토큰이 없으면 로그인 페이지로 리다이렉트
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/user/me/feed`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    // 사용자의 피드 목록 저장하는 로직 추가
  } catch (error) {
    console.error("피드 로드 오류:", error);
  }
};

// 로그인 상태 확인 및 리다이렉트 처리
onMounted(() => {
  if (!accessToken) {
    router.push("/login"); // 로그인이 되어 있지 않으면 로그인 페이지로 리다이렉트
  } else {
    fetchUserFeed(); // 로그인 되어 있으면 피드를 로드
    console.log(`현재 유저: ${loginState.username}`); // Pinia에서 username 사용
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
      <component :is="components[activeComponent]" />
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
  width: 95%; /* 선 길이 */
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
</style>
