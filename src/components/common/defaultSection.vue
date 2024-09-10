<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="router-view-container">
    <!-- 특정 라우트 이름으로 조건부 트랜지션 적용 -->
    <transition :name="$route.meta.transition" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<style scoped>
.router-view-container {
  /* 라우터 뷰가 스크롤을 가지는 영역의 높이와 너비를 설정 */
  width: 100%;
  height: 100vh; /* 화면 전체 높이 */

  /* 스크롤 관련 속성 */
  overflow-x: auto; /* 가로 스크롤을 허용 */
}

/* 페이드인/페이드아웃 CSS 애니메이션 정의 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
