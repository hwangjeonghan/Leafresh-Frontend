<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useUserstore } from "@/stores/users.js";

const router = useRouter();
const loginState = useUserstore();

const id = ref(1); // id 값 (예시)

const goDiaryDetail = () => {
  if (loginState.userNickname && id.value) { // userNickname과 id가 있는지 확인
    router.push(`/garden-diary/diary-detail/${loginState.userNickname}/${id.value}`);
  } else {
    console.error('사용자 정보나 ID가 누락되었습니다.');
    loginState.logout(); // 누락된 경우 로그아웃 처리
  }
};

</script>

<template>
  <!-- 식물1 버튼을 클릭하면 goDiaryDetail 함수 호출 -->
  <button @click="goDiaryDetail"> 식물1 </button>
</template>
