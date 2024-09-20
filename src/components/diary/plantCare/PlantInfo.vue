<template>
  <div class="plant-info" v-if="plant">
    <h2>{{ plant.plantName }}</h2>
    <p>종류: {{ plant.plantType }}</p>
    <p> 처음 만난 날: {{ formattedDate(plant.registrationDate) }}</p>
    <p>D + {{ daysPassed(plant.registrationDate) }}</p>
    <p>{{ plant.plantDescription }}</p>
  </div>
  <div v-else>

    <p>Loading ,,,</p>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useGardenStore } from '@/stores/gardenStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const store = useGardenStore();
const id = route.params.id;

const plant = computed(() => store.plants.find(p => p.id === Number(id))); // plants 배열에서 id에 해당하는 식물 찾기

onMounted(() => {
  if (!store.plants.length) {
    store.fetchPlants(); // store에 plants 데이터가 없으면 API 호출
  }
});


const formattedDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const daysPassed = (registrationDate) => {
  const registration = new Date(registrationDate);
  const now = new Date();
  const diffTime = Math.abs(now - registration);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};



</script>

<style scoped>
.plant-info {
  width: 80%;
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

/* h2 태그의 글씨 크기를 키움 */
h2 {
  font-size: 2em; /* 글씨 크기를 크게 설정 */
  font-weight: bold; /* 글씨를 굵게 */
  margin-bottom: 20px; /* h2 아래 간격 */
}

/* p 태그들 사이의 간격을 조절 */
p {
  margin-bottom: 15px; /* p 태그들 사이의 간격을 넓힘 */
  font-size: 1.1em; /* p 태그 안의 글씨 크기를 살짝 키움 */
}

</style>
