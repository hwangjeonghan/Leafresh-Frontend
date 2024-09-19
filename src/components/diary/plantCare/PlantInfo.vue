<template>
  <div class="plant-info" v-if="plant">
    <h2>{{ plant.plantName }}</h2>
    <p>종류: {{ plant.plantType }}</p>
    <p>만난 날: {{ formattedDate(plant.registrationDate) }}</p>
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
</style>
