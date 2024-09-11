<script setup>

import  { ref } from 'vue';
import diaryForm from './diaryForm.vue';
import {useRouter} from "vue-router";
import { useUserstore } from "@/stores/users.js";


const router =useRouter();
const loginState = useUserstore();

const id = ref(1); // id 값 (예시)



const goDairyDetail = (id) => {
  router.push(`/garden-diary/diary-detail/${loginState.userNickname}/${id.value}`);
};
</script>

<template>
  <button @click="() => router.push(`/garden-diary/diary-detail/${username}/${id}`)"> 식물1 </button>

  <button @click="goDairyDetail"> 이거 찐 </button>

</template>
