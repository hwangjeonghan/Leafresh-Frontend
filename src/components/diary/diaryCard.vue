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
      @click="goDiaryDetail(plant.id)"
    >
      <div class="plant-image-container">
        <img :src="plant.imageUrl" alt="식물 이미지" loading="lazy" class="plant-image" />
        
      </div>
      <div class="plant-info">
        <h3>{{ plant.plantName }}</h3>
        <p>{{ plant.plantType }}</p>
        <p>{{ plant.registrationDate }}</p>
      </div>
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
  border: 1px solid #ddd; /* Lighter border for a softer look */
  border-radius: 12px; /* Slightly more rounded corners */
  width: 23%; /* Adjust the width as needed */
  text-align: center;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
  position: relative; /* Position relative for the shimmer effect */
  overflow: hidden; /* Ensure shimmer effect stays within the card */
}

.plant-card:hover {
  background-color: #f9f9f9; /* Slightly lighter background on hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Deeper shadow on hover */
}

.plant-card:hover::before {
  content: ''; /* Empty content for the shimmer effect */
  position: absolute;
  top: -50%; /* Move shimmer effect outside the top edge */
  left: -50%; /* Move shimmer effect outside the left edge */
  width: 200%; /* Expand to cover the entire card */
  height: 200%; /* Expand to cover the entire card */
  background: linear-gradient(
    45deg,
    rgba(255, 215, 0, 0.2) 25%, /* Light gold */
    rgba(255, 215, 0, 0.4) 50%, /* Medium gold */
    rgba(255, 215, 0, 0.2) 75%  /* Light gold */
  );
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite, sparkle 2s infinite; /* Apply shimmer and sparkle animations */
  pointer-events: none; /* Ensure shimmer effect does not interfere with mouse events */
}

@keyframes shimmer {
  0% {
    background-position: -200% -200%;
  }
  100% {
    background-position: 200% 200%;
  }
}

@keyframes sparkle {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 0;
  }
}

.plant-image-container {
  width: 100%;
  height: 0;
  padding-top: 60%; /* Aspect ratio 60% for image */
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #ddd; /* Consistent border with card */
}

.plant-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers the container */
}

.plant-info {
  padding: 15px; /* Increased padding for better spacing */
}

.plant-info h3 {
  margin: 0 0 10px; /* Margin adjustments */
  font-size: 20px; /* Slightly larger font size for better prominence */
  font-weight: bold;
  color: #333; /* Darker text color for better readability */
}

.plant-info p {
  margin: 5px 0;
  font-size: 15px; /* Adjusted font size for better readability */
  color: #666; /* Softer text color */
}
</style>





