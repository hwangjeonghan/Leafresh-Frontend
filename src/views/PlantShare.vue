<script setup>
import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import MarketAddPost from "@/views/MarketAddPost.vue";
</script>

<template>
  <div class="share_container">
    <div class="share_text">식물분양 페이지 입니다.</div>
    <div>
      <router-link to="/addpost" class="addPost_btn">포스트 등록</router-link>
    </div>
  </div>
</template>

<style scoped>
.share_container {
  width: 100%;
  height: 100%;
  background-color: #f2d9bb;
  display: flex;
  justify-content: center;
  align-items: center;
}

.share_text {
  font-family: "GothicA1-Light";
  font-size: 20px;
  color: #b3b3b3;
}
</style>
