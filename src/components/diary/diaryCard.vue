<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserstore } from '@/stores/users.js';
import { useGardenStore } from '@/stores/gardenStore.js';
import axios from 'axios';

const router = useRouter();
const loginState = useUserstore();
const gardenStore = useGardenStore();

const isLoading = ref(true);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to fetch plants from API
const fetchPlants = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // 액세스 토큰 가져오기
    const response = await axios.get(`${API_BASE_URL}/api/plants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data && Array.isArray(response.data)) {
      gardenStore.plants = response.data.map(plant => ({
        ...plant,
        imageUrl: plant.imageUrl
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(plant.imageUrl)}`
          : 'https://via.placeholder.com/150', // 기본 이미지 설정
      }));
    } else {
      console.error('잘못된 데이터 구조:', response.data);
    }
  } catch (error) {
    console.error('식물 목록을 가져오는 중 오류가 발생했습니다:', error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch plants when component is mounted
onMounted(() => {
  fetchPlants();
});

// Watch for changes in the plants list
watch(
  () => gardenStore.plants,
  (newPlants, oldPlants) => {
    console.log('식물 목록이 업데이트되었습니다.', newPlants);
  },
  { deep: true } // Deep watch to monitor nested changes
);

// Function to handle navigation to diary detail
const goDiaryDetail = (plantId) => {
  if (loginState.userNickname && plantId) {
    router.push(
      `/garden-diary/diary-detail/${loginState.userNickname}/${plantId}`
    );
  } else {
    console.error("사용자 정보나 식물 ID가 누락되었습니다.");
    loginState.logout();
  }
};

// Function to get the image URL, using a placeholder if necessary
const getImageUrl = (url) => {
  return url && url.trim() !== "" ? url : 'https://via.placeholder.com/150';
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 'auto-fill'을 사용하여 가능한 한 많은 카드가 한 줄에 배치됩니다. */
  gap: 20px; /* 카드 간격 */
  padding: 20px; /* 컨테이너 패딩 */
  justify-content: start; /* 왼쪽 정렬 */
}

.plant-card {
  border: 1px solid #ddd; /* Lighter border for a softer look */
  border-radius: 12px; /* Slightly more rounded corners */
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





