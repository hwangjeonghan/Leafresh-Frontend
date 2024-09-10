<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Pinia 스토어 인스턴스 생성
const loginState = useUserstore();

// 페이지 로드 시 토큰 확인하여 로그인 상태 설정
onMounted(() => {
  if (localStorage.getItem("accessToken")) {
    loginState.setLoginState(true);
    loginState.fetchUserProfile(); // 로그인 상태이면 사용자 정보 로드
  }
});

// isLoggedIn 상태를 감시하여 UI 업데이트
watch(
  () => loginState.isLoggedIn,
  (newValue) => {
    if (newValue) {
      loginState.fetchUserProfile(); // 로그인 상태가 true로 변경되면 사용자 정보 로드
    } else {
      loginState.clearUserProfile(); // 로그아웃 시 사용자 정보 초기화
    }
  }
);

// 원예일지로 이동하는 함수
const goToGardenDiary = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
  } else if (!userProfileExists.value) { // 프로필이 없는 경우
    router.push('/profile/registration'); // 프로필 등록 페이지로 이동
  } else {
    router.push('/garden-diary/${loginState.userNickname}'); // 프로필이 있는 경우 원예일지 페이지로 이동
  }
};
</script>

<template>
  <div class="header_container">
    <div class="header_text_container col">
      <div class="header_item">
        <router-link to="/" class="header_title point">Leafresh</router-link>
      </div>
      <div class="header_item header_profile">
        <!-- 프로필 이미지 표시 -->
        <img
          v-if="loginState.imageUrl"
          :src="loginState.imageUrl"
          alt="프로필 아이콘"
          class="profile-icon"
        />
      </div>
      <div class="header_item col">
        <router-link to="/community" class="header_navigator point"
          >커뮤니티</router-link
        >
        <router-link to="/market" class="header_navigator point"
          >식물분양</router-link
        >
        <!-- username을 포함한 동적 경로로 이동 -->
        <router-link
          v-if="loginState.isLoggedIn"
          :to="`/garden-diary/${loginState.userNickname}`"
          class="header_navigator point"
          >원예일지</router-link
        >
      </div>
      <div class="footer_item">
        <div class="footer_upper">
          What's Leafresh
        </div>
        <div class="footer_middle">
          <div>공지사항</div>
          <div>이벤트</div>
        </div>
        <div class="footer_under">
          All rights reserved. © Leafresh.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
.col {
  flex-direction: column;
}
.row {
  flex-direction: row;
}
.point {
  cursor: pointer;
}

.header_container {
  height: 100dvh;
  width: 320px;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, #1ab546, #0b4f1e);
}

.header_text_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header_item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer_item {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.header_title {
  font-family: "ghanachoco";
  font-size: 32px;
  color: #fff;
}

.header_profile {
  font-family: "ghanachoco";
  color: #fff;
}

.header_navigator {
  font-family: "ghanachoco";
  font-size: 18px;
  color: #fff;
  margin: 30px;
}

.header_navigator:hover {
  color: #a68b6a;
}

.router-link-active {
  color: #a68b6a;
}

.header_menu {
  font-family: "ghanachoco";
  font-size: 18px;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
}

.header_menu:hover {
  color: #a68b6a;
}

.profile-icon {
  width: 150px;
  height: 150px;
  border-radius: 70%;
}

.footer_upper,
.footer_middle,
.footer_under {
  font-family: "ghanachoco";
  font-size: 14px;
  color: #fff;
  text-align: center;
}

.footer_middle {
  display: flex;
  flex-direction: row;
  justify-content: space-around; /* 두 항목 사이에 간격 추가 */
  width: 100%; /* 컨테이너 전체 너비 사용 */
}
</style>

