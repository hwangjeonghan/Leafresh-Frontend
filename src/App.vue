<template>
  <div class="app-container">
    <div class="sidebar">
      <DefaultHeader />
    </div>
    <div class="content">
      <DefaultSection />
    </div>
    
    <!-- 로그인 상태에 따라 버튼을 같은 위치에서 교차로 표시 -->
    <div class="button-container">
      <button v-if="!isLoggedIn" @click="goToLogin" class="action-btn">
        <span class="material-icons">login</span>
        <span class="btn-text">로그인</span>
      </button>

      <div v-else class="dropdown">
        <button class="dropbtn">
          <span class="material-icons">list</span>
        </button>
        <!-- 드롭다운 내용 -->
        <div class="dropdown-content">
          <a @click="handleLogout">
            <span class="material-icons">logout</span> 
            <span class="btn-text">로그아웃</span>
          </a>
          <a @click="goToFeedAdd">
            <span class="material-icons">edit_note</span>
            <span class="btn-text">피드추가</span>
          </a>
        </div>
      </div>
    </div>
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

const goToFeedAdd = () => {
  router.push("/garden-diary/feed-add"); // 피드 추가 페이지로 이동
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

/* 버튼 컨테이너 스타일 */
.button-container {
  position: fixed;
  top: 20px;
  right: 20px;
}

/* 로그인 및 드롭다운 버튼 스타일 */
.action-btn, .dropbtn {
  background-color:  #a68b6a;;
  color: white;
  padding: 12px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-text {
  font-family: "ghanachoco";
  font-size: 16px;
  color: #fff;
}

.action-btn:hover, .dropbtn:hover {
  background-color: #a68b6a;;
}

/* 드롭다운 메뉴 스타일 */
.dropdown-content {
  display: none;
  position: absolute;
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  min-width: 130px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 8px;
  right: 0;
}

/* 드롭다운 항목 스타일 */
.dropdown-content a {
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

/* 드롭다운 메뉴를 보여주기 */
.dropdown:hover .dropdown-content {
  display: block;
}

/* 아이콘 스타일 */
.material-icons {
  font-size: 24px;
}
</style>
