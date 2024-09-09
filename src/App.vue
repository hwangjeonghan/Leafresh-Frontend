<script setup>
import DefaultHeader from "@/components/common/defaultHeader.vue";
import DefaultSection from "@/components/common/defaultSection.vue";
import { computed } from "vue"; // computed 사용
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

<template>
  <div class="app-container">
    <div class="sidebar">
      <DefaultHeader />
    </div>
    <div class="content">
      <DefaultSection />
    </div>
    <!-- 로그인 상태에 따라 로그인/로그아웃 버튼 표시 -->
    <button v-if="!isLoggedIn" @click="goToLogin" class="floating-login-btn">
      로그인
    </button>
    <button v-else @click="handleLogout" class="floating-login-btn">
      로그아웃
    </button>
  </div>
</template>

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

/* 플로팅 로그인/로그아웃 버튼 스타일 */
.floating-login-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #1ab546;
  padding: 15px 20px;
  border-radius: 50px;
  border: none;
  font-family: "ghanachoco";
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.floating-login-btn:hover {
  background-color: #0b4f1e;
}

.floating-login-btn:active {
  transform: translateY(2px);
}
</style>
