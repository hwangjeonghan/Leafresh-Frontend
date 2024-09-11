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
    <button @click="saveData">저장</button>
  </div>

  <div class="meme_box">

    <h1>메모</h1>

    <memo />

  </div>
</template>
  
<script setup>

import memo from './plantCarememo.vue';
import { usePlantCareStore } from '@/stores/plantCareStore.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'


const store = usePlantCareStore();

const saveData = async () => {
  await store.savePlantCare();
};
</script>

<style>

.meme_box{
  display: flex;
  margin: 20px;
}


</style>
