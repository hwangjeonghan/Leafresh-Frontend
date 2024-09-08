<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useLoginState } from "@/stores/users.js"; // Pinia 스토어 가져오기

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Pinia 스토어 인스턴스 생성
const loginState = useLoginState();

// 로그아웃 메서드 정의
const logout = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // 토큰을 로컬 스토리지에서 가져오기
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    // 로컬 스토리지에서 accessToken과 refreshToken 모두 삭제
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    loginState.setLoginState(false); // 로그인 상태 변경
    loginState.clearUserProfile(); // 사용자 정보 초기화
    router.push("/login");
  } catch (error) {
    console.error("로그아웃 오류:", error);
    alert("서버 오류가 발생했습니다.");
  }
};

// 로그인 후 사용자 정보를 가져오는 함수
const fetchUserProfile = async () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ftpImagePath = response.data.imageUrl;

      // Pinia 스토어에 사용자 정보 저장
      loginState.setUserProfile({
        username: response.data.userNickname,
        imageUrl: `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(
          ftpImagePath
        )}`,
      });
    } catch (error) {
      console.error("사용자 정보 로드 오류:", error);
      if (error.response && error.response.status === 401) {
        // 401 오류가 발생하면 로그아웃 처리
        await logout();
      }
    }
  } else {
    console.error("토큰이 존재하지 않습니다.");
  }
};

// 원예일지로 이동하는 함수
const goToGardenDiary = () => {
  if (loginState.isLoggedIn) {
    router.push(`/garden-diary/${loginState.username}`); // 로그인된 유저의 이름을 기반으로 페이지 이동
  } else {
    router.push("/login"); // 로그인되어 있지 않으면 로그인 페이지로 이동
  }
};

// 페이지 로드 시 토큰 확인하여 로그인 상태 설정
onMounted(() => {
  if (localStorage.getItem("accessToken")) {
    loginState.setLoginState(true);
    fetchUserProfile(); // 로그인 상태이면 사용자 정보 로드
  }
});

// isLoggedIn 상태를 감시하여 UI 업데이트
watch(
  () => loginState.isLoggedIn,
  (newValue) => {
    if (newValue) {
      fetchUserProfile(); // 로그인 상태가 true로 변경되면 사용자 정보 로드
    } else {
      loginState.clearUserProfile(); // 로그아웃 시 사용자 정보 초기화
    }
  }
);
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
        <button @click="goToGardenDiary">원예일지</button>
      </div>
      <div class="header_item">
        <!-- 로그인 상태에 따라 로그인/로그아웃 버튼 표시 -->
        <router-link
          v-if="!loginState.isLoggedIn"
          to="/login"
          class="header_menu point"
          >로그인</router-link
        >
        <button v-else @click="logout" class="header_menu point">
          로그아웃
        </button>
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
</style>
