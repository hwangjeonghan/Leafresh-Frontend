<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import MarketAddPost from "@/views/MarketAddPost.vue";
import MarketDetail from './MarketDetail.vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();
const markets = ref([]); // 게시글 리스트
const imageUrl = ref('');  // 이미지 url

const fetchMarkets = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/market`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    const result = await response.json();
    console.log('조회결과 : ', result);
    markets.value = result;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
    }

    // 게시글 이미지 경로를 하나하나 꺼내옴
    markets.value.forEach(market => {
      const imagePath = market.marketImage;
      market.imageUrl = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(imagePath)}`;
      
      const createdDate = new Date(market.marketCreatedAt); //  게시글 등록일을 가져와서 Date객체로 바꿈
      const today = new Date();
      const timeDiff = today - createdDate; // 밀리초 차이
      const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일(day)로 변환

      if (dayDiff === 0) {
        market.displayDate = '오늘';
      } else if (dayDiff === 1) {
        market.displayDate = '어제';
      } else {
        market.displayDate = `${dayDiff}일 전`;
      }
    });
  } catch (error) {
    console.error('오류:', error);
  }
}

const detailPost = (id) => {
    router.push(`/market/detail/${id}`);
}

onMounted(() => {
  fetchMarkets();
})
</script>

<template>
<div class="market-page">
  <div class="share_container">
      <div v-if="markets.length > 0" class="market-list">
        <div v-for="(market, index) in markets.slice().reverse()" :key="index" class="market-item" @click="detailPost(market.marketId)">
          <div class="market_image_box">
            <img :src="market.imageUrl" alt="Market Image" class="market-image" />
          </div>
          <div class="market_text_box">
            <div :class="market.marketStatus ? 'market_status_box_true' : 'market_status_box_false'">
              <p>{{ market.marketStatus ? '분양중' : '분양 완료' }}</p>
            </div>
            <p class="market-category">{{ market.marketCategory }}</p>
            <p class="market-title">{{ market.marketTitle }}</p>
            <p class="market-content">{{ market.userNickname }}</p>
          </div>
          <div class="market_created_box">
            <p class="market_created_at">{{ market.displayDate }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <p>현재 등록된 게시글이 없습니다.</p>
      </div>

      <div class="market_btn_box">
        <router-link to="/market/addpost" class="addPost_btn">+</router-link>
      </div>
  </div>
</div>
</template>

<style scoped>
.market-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f9fff8;
  overflow: hidden;
  font-family: "GothicA1-Light";
}

.share_container {
  width: 100vw;
  height: 100vh;
  background-color: #f9fff8;
  display: flex;
  flex-direction: column; /* 아이템을 세로로 정렬합니다. */
  align-items: center; /* 아이템을 가로로 중앙 정렬합니다. */
  justify-content: space-between;
}

.market-list {
  width: 90vw;
  max-width: 100%;
  height: auto;
  margin: 3vw 0 3vw 10vw;
  display: flex;
  flex-direction: column; /* 아이템을 세로로 배치 */
  overflow-y: auto; /* 세로 스크롤 가능 */
}

.market-list::-webkit-scrollbar {
  display: none; /* 스크롤바 숨기기 */
}

.market_btn_box {
  width: 10%;
}

.market-list::-webkit-scrollbar {
  display: none; /* 웹킷 브라우저에서 스크롤바 숨기기 */
}

.market-item {
  width: 50vw;
  background-color: white;
  border-radius: 1vw;
  height: 10vw;
  padding: 2vw;
  margin-bottom: 1vw;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #656565;
  display: flex;
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

.market-category {
  font-size: 1.5vw;
  font-weight: bold;
  margin-bottom: 1vw;
  color: #d0d0d0;
}

.market-title {
  font-size: 2vw;
  font-weight: bold;
  margin-bottom: 10px;
  color: #848484;
}

.market-content {
  font-size: 1.5vw;
  line-height: 1.5;
  margin-bottom: 1.5vw;
  color: #848484;
}

.market-image {
  width: 70%; /* 부모 컨테이너에 맞추기 */
  height: auto; /* 비율 유지하면서 크기 조절 */
  object-fit: cover; /* 이미지가 박스에 맞게 잘림 */
  border-radius: 1vw; /* 이미지의 모서리를 둥글게 */
  /* justify-content: center; 
  align-items: center;  */
}

.market_image_box {
  width: 25%;
  height: auto;
  margin-right: 2vw;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 중앙 정렬 */
}

.market_text_box {
  width: 75%;
  margin-top: 1vw;
}

.market_created_box {
  width: 10%;
  text-align: right;
  font-size: 1.5vw;
  font-weight: bold;
  margin-bottom: 10px;
  color: #bdbdbd;
}

.addPost_btn {
  padding: 1vw 2vw;
  background-color: #1ab546;
  color: white;
  border-radius: 1vw;
  text-decoration: none;
  position: fixed;
  right: 2vw;
  bottom: 2vw;
}

.addPost_btn:hover {
  background-color: #148838;
}


/* 반응형 안됨...수정필요....wait... */
@media (max-width: 1200px) {
  .market-list {
    width: 90vw;
  }
}

@media (max-width: 992px) {
  .market-item {
    flex-direction: column;
    align-items: center;
    height: auto;
  }

  .market_image_box {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .market_text_box {
    width: 100%;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .market-btn_box {
    width: 20vw;
  }
}

@media (max-width: 480px) {
  .market-category, .market-title, .market-content {
    font-size: 4vw;
  }

  .market-item {
    padding: 5vw;
    margin-bottom: 2vw;
  }

  .addPost_btn {
    padding: 3vw 6vw;
  }
}
</style>
