<template>
  <div class="app-container">
    <div class="sidebar">
      <DefaultHeader />
    </div>
    <div class="content">
      <DefaultSection />
    </div>
    <!-- 로그인 상태에 따라 로그인/로그아웃 아이콘 버튼 표시 -->
    <button v-if="!isLoggedIn" @click="goToLogin" class="floating-login-btn">
      <span class="material-icons">login</span>
      <span class="btn-text">로그인</span>
    </button>
    <button v-else @click="handleLogout" class="floating-login-btn">
      <span class="material-icons">logout</span>
      <span class="btn-text">로그아웃</span>
    </button>
  </div>
</template>

<script setup>
import DefaultHeader from "@/components/common/defaultHeader.vue";
import DefaultSection from "@/components/common/defaultSection.vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useUserstore } from "@/stores/users.js";

// Pinia 스토어 및 Vue Router 설정
const router = useRouter();
const loginState = useUserstore();

// Pinia의 isLoggedIn 상태를 computed로 가져오기
const isLoggedIn = computed(() => loginState.isLoggedIn);

// 로그인 페이지로 이동하는 함수
const goToLogin = () => {
  router.push("/login");
};

// 로그아웃 처리 함수
const handleLogout = () => {
  loginState.logout(); // Pinia의 로그아웃 함수 호출
  router.push("/"); // 로그아웃 후 메인 페이지로 이동
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 320px;
}
.content {
  flex: 1;
}

/* 플로팅 로그인/로그아웃 아이콘 버튼 스타일 */
.floating-login-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #1ab546;
  padding: 10px;
  width: 45px; /* 기본 크기: 아이콘만 보이도록 */
  border-radius: 12px;
  border: none;
  color: #fff;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
}

.floating-login-btn:hover {
  background-color: #289547;
  width: auto; /* 호버 시 버튼이 커짐 */
}

.btn-text {
  font-family: "ghanachoco";
  font-size: 14px;
  line-height: 14px;
}

/* 호버 시 텍스트 나타나기 */
.floating-login-btn .btn-text {
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.floating-login-btn:hover .btn-text {
  opacity: 1;
}

.floating-login-btn:active {
  transform: translateY(2px);
}

.material-icons {
  font-size: 24px;
}
</style>
