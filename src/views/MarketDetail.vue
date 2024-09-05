<template>
<div class="market_detail_page">
    <div class="market_detail_container">
    <div v-if="market">
      <div class="market_category_box"> {{ market.post.marketCategory }} </div>
      <div class="market_title_box">{{ market.post.marketTitle }} </div>
      <div class="market_content_box">{{ market.post.marketContent }}</div>
      <!-- <img :src="market.imageUrl" alt="Market Image" /> -->
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

const fetchMarketDetails = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/market/detail/${marketId.value}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    
    // const ftpImagePath = response.formData.imageUrl;
    // imageUrl.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
    }

    const result = await response.json();
    market.value = result;
    console.log('게시글 상세조회 성공', result);
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
  background-color: #ffe4cb;
  overflow: auto;
  font-family: "GothicA1-Light";
}

.market_detail_container {
  background-color: #f2d9bb;
  max-width: 500px;
  width: 100%;
  /* max-height: 90vh; */
  height: 400px;
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
</style>