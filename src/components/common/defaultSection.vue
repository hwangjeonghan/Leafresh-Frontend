<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <div class="router-view-container">
    <RouterView />
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
</style>
