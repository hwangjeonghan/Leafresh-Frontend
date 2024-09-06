<template>
<div class="market_detail_page">
    <div class="market_detail_container">
    <div v-if="market">
      <div class="market_detail_header">
        <div class="market_category_box"> {{ market.post.marketCategory }} </div>
        <div class="market_post_info_box">
          <div :class="market.post.marketStatus ? 'market_status_box_true' : 'market_status_box_false'">
            <p>{{ market.post.marketStatus ? '분양중' : '분양 완료' }}</p>
          </div>
          <div class="market_created_box">
            <p class="market_created_at">{{ market.post.displayDate }}</p>
          </div>
        </div>
      </div>
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
    market.value = result;
    const imagePath = result.post.marketImage; // url 경로 가져옴
    marketImage.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(imagePath)}`;

    if (market.value && market.value.post) {
      const createdDate = new Date(result.post.marketCreatedAt); //  게시글 등록일을 가져와서 Date객체로 바꿈
      const today = new Date();
      const timeDiff = today - createdDate; // 밀리초 차이
      const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일(day)로 변환

      if (dayDiff === 0) {
        market.value.post.displayDate = '오늘';
      } else if (dayDiff === 1) {
        market.value.post.displayDate = '어제';
      } else {
        market.value.post.displayDate = `${dayDiff}일 전`;
      }
    }
    
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
  /* justify-content: center; */
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  /* text-align: center; */
}

.market_created_box {
  width: 3vw;
  text-align: right;
  font-size: 1.5vw;
  font-weight: bold;
  margin-bottom: 10px;
  color: #bdbdbd;
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

.market_status_box_true {
  margin: 0 0 1.8vw 0;
  width: 4vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #ffb357;
  color: white;
  border-radius: 1vw;
}

.market_status_box_false {
  margin: 0 0 1.8vw 0;
  width: 4.5vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #b6b6b6;
  color: white;
  border-radius: 1vw;
}

.market_status_box_true,
.market_status_box_false {
  margin-right: 10px; /* status 박스와 created 박스 간의 간격 */
}

.market_detail_header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 아이템을 가로로 중앙 정렬합니다. */
}

.market_post_info_box {
  align-items: center;
  padding-left: 5vw;
}
</style>