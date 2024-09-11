<script setup>
import diaryForm from '@/components/diary/diaryForm.vue';
import diaryProfile from '@/components/diary/diaryProfile.vue';
import { useUserstore } from '@/stores/users';

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const loginState = useUserstore();



</script>

<template>


<diaryProfile />



<h1>여기다가 다이어리 쓸거라고!!</h1>
<br>



<diaryForm />



</template>
