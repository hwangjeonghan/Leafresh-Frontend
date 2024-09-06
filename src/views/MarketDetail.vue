<template>
<div class="market_detail_page">
    <div class="market_detail_container">
    <div v-if="market">
      <div class="market_category_box"> {{ market.post.marketCategory }} </div>
      <div class="market_title_box">{{ market.post.marketTitle }} </div>
      <div class="market_content_box">{{ market.post.marketContent }}</div>
      <div class="market_content_box">{{ market.post.userNickname }}</div>
      <img class="market_image_box" :src="marketImage" alt="Market Image" />
      <div>
         <!-- 채팅하기 버튼 -->
         <router-link :to="{ name: 'Chat', params: { id: market.post.marketId } }" class="market_chat">채팅하기</router-link>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const marketId = ref(route.params.id);
const market = ref(null);
const marketImage = ref('');

const fetchMarketDetails = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/market/detail/${marketId.value}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
    }
    // 백에서 응답받은 데이터를 가져옴
    const result = await response.json();
    console.log(result);
    market.value = result;
    const imagePath = result.post.marketImage; // url 경로 가져옴
    marketImage.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(imagePath)}`;

    console.log('게시글 상세조회 성공', result);
    console.log('이미지 경로 : ', marketImage.value);
  } catch (error) {
    console.error('오류:', error);
  }
}

watch(() => route.params.id, (newId) => {
  marketId.value = newId;
  fetchMarketDetails();
}, { immediate: true });

onMounted(() => {
  fetchMarketDetails();
});
</script>

<style scoped>
.market_detail_page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fff8;
  overflow: auto;
  font-family: "GothicA1-Light";
}

.market_detail_container {
  background-color: #f9fff8;
  max-width: 500px;
  width: 100%;
  /* max-height: 90vh; */
  height: 600px;
  display: flex;
  justify-content: center;
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  text-align: center;
}

.market_chat {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1ab546;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.market_category_box {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #d0d0d0;
}

.market_title_box {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #848484;
}

.market_content_box {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #848484;
}

.market_image_box {
  width: 100%; /* 부모 컨테이너에 맞추기 */
  height: auto; /* 비율 유지하면서 크기 조절 */
  max-width: 300px; /* 최대 너비 설정 */
  max-height: 300px; /* 최대 높이 설정 */
  object-fit: cover; /* 이미지가 박스에 맞게 잘림 */
  border-radius: 8px; /* 이미지의 모서리를 둥글게 */
}
</style>