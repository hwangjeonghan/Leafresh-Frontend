<template>
  <div>
    <ul>
      <VueDatePicker v-model="store.selectedDate" />

      <li>물주기: <input type="number" v-model="store.water" min="1" max="5"></li>
      <li>햇빛: <input type="number" v-model="store.sunlight" min="1" max="5"></li>
      <li>분갈이: <input type="checkbox" v-model="store.ventilation"></li>
      <li>가리기: <input type="checkbox" v-model="store.cover"></li>
      <li>영양제: <input type="checkbox" v-model="store.nutrients"></li>
 
    </ul>
    <button @click="store.savePlantCare">저장</button>
  </div>

  <div>
    메모
  </div>
</template>
  
<script setup>

import { ref } from 'vue';
import { usePlantCareStore } from '@/stores/plantCareStore.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const store = usePlantCareStore();
</script>
  