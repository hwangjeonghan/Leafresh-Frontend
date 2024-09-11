<template>
    <div v-if="plant" class="plant-detail">
      <div class="detail-header">
        <h1>{{ plant.plantName }}</h1>
        <button @click="goBack" class="back-button">뒤로 가기</button>
      </div>
      <div class="detail-content">
        <div v-if="plant.imageUrl" class="image-container">
          <img :src="plant.imageUrl" alt="식물 이미지" class="plant-image" />
        </div>
        <div class="details">
          <p><strong>종류:</strong> {{ plant.plantType }}</p>
          <p><strong>등록일:</strong> {{ plant.registrationDate }}</p>
          <p><strong>설명:</strong> {{ plant.plantDescription }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  
  const plant = ref(null);
  
  // 식물 ID를 URL 파라미터에서 가져오기
  const plantId = route.params.id;
  
  const fetchPlantDetails = async () => {
    try {
      const response = await axios.get(`/api/garden-diary/${plantId}`);
      plant.value = response.data;
    } catch (error) {
      console.error('식물 정보 가져오기 실패:', error);
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  // 컴포넌트가 마운트될 때 식물 정보 가져오기
  onMounted(() => {
    fetchPlantDetails();
  });
  </script>
  
  <style scoped>
  .plant-detail {
    padding: 20px;
  }
  
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .back-button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .back-button:hover {
    background-color: #0056b3;
  }
  
  .detail-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .image-container {
    margin-bottom: 20px;
  }
  
  .plant-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }
  
  .details {
    text-align: center;
  }
  
  .details p {
    margin: 10px 0;
  }
  </style>
  