<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserstore } from '@/stores/users.js';
import { useGardenStore } from '@/stores/gardenStore.js';

const router = useRouter();
const loginState = useUserstore();
const gardenStore = useGardenStore();

const selectedPlantId = ref(null);

const goDiaryDetail = (plantId) => {
  if (loginState.userNickname && plantId) {
    router.push(`/garden-diary/diary-detail/${loginState.userNickname}/${plantId}`);
  } else {
    console.error('사용자 정보나 식물 ID가 누락되었습니다.');
    loginState.logout();
  }
};
</script>

<template>
  <div class="plants-container">
    <div
      v-for="(plant, index) in gardenStore.plants"
      :key="plant.id"
      class="plant-card"
    >
      <img :src="plant.imageUrl" alt="식물 이미지" class="plant-image" />
      <div class="plant-info">
        <h3>{{ plant.plantName }}</h3>
        <p>{{ plant.plantType }}</p>
        <p>{{ plant.registrationDate }}</p>
      </div>
      <button @click="goDiaryDetail(plant.id)" class="details-button">
        상세보기
      </button>
    </div>
  </div>
</template>

<style scoped>
.plants-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.plant-card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  width: 23%; /* 4칸을 위한 적절한 너비 */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plant-image {
  width: 120px;
  height: 120px;
  object-fit: contain; /* 이미지가 잘리는 문제를 방지하기 위해 'contain'으로 변경 */
  margin-bottom: 10px;
}

.plant-info {
  margin-bottom: 10px;
}

.details-button {
  margin-top: 10px;
  background-color: #4CAF50; /* 배경색 */
  color: white; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 둥근 모서리 */
  padding: 10px 20px; /* 상하, 좌우 패딩 */
  font-size: 16px; /* 글꼴 크기 */
  cursor: pointer; /* 마우스 포인터 변경 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 부드러운 색상 변경과 클릭 효과 */
}

.details-button:hover {
  background-color: #45a049; /* 호버 시 배경색 변경 */
}

.details-button:active {
  transform: scale(0.98); /* 클릭 시 버튼이 살짝 눌리는 효과 */
}

.details-button:focus {
  outline: none; /* 포커스 테두리 제거 */
}
</style>
