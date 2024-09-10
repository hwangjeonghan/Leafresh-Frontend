<template>
  <div>
    <h1>오늘 날짜를 선택하세요:</h1>
    <!-- 캘린더를 통한 날짜 선택 -->
    <div>
    <VueDatePicker v-model="date" />
  </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date= ref();


</script>

  
