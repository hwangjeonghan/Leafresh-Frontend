<template>
  <div class="plant-care-container" >

    <div class="date_picker_container" >
      <VueDatePicker v-model="store.selectedDate" :enable-time-picker="false" />
      <ul>
        <li>
          물주기: <input class="fas fa-tint" type="number" v-model="store.water" min="1" max="5" />
        </li>
        <li>
          햇빛: <input type="number" v-model="store.sunlight" min="1" max="5" />
        </li>
        <li>분갈이: <input type="checkbox" v-model="store.ventilation"></li>
        <li>가지치기: <input type="checkbox" v-model="store.cover"></li>
        <li>영양제: <input type="checkbox" v-model="store.nutrients"></li>     
     </ul>
  
    <button class="save_button" @click="saveData">저장</button>
    </div>


  </div>


</template>
  
<script setup>

import { usePlantCareStore } from '@/stores/plantCareStore.js';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const store = usePlantCareStore();

const saveData = async () => {
  await store.savePlantCare();
};
</script>

<style>
@font-face {
    font-family: 'LeeSeoyun';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

.plant-care-container {
  font-family: 'LeeSeoyun', sans-serif; /* 폰트를 컴포넌트 전체에 적용 */
}

.date_picker_container{
  width: 80%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.date_picker_container li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

input[type="number"] {
  width: 60px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.save_button{
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

}
.save_button:hover {
  background-color: #45a049;
}




</style>
