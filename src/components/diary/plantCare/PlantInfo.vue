<template>
  <div class="plant-info">
    <h2>{{ plantName }}</h2>
    <p>종류: {{ species }}</p>
    <p>만난 날: {{ meetDate }}</p>
    <p>D + {{ daysPassed }}</p>
    <p>{{ description }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const plantName = ref('식물의 별명');
const species = ref('스투키');
const meetDate = ref('2022-05-01');
const daysPassed = ref(1220);
const description = ref('우리 스투키카운요... (식물 소개)');
</script>

<style scoped>
.plant-info {
  width: 80%;
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}
</style>
