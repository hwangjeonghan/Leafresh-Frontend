<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import MarketAddPost from "@/views/MarketAddPost.vue";

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
    
    const ftpImagePath = response.formData.imageUrl;
    imageUrl.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`;

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
    }

    const result = await response.json();
    markets.value = result;
    console.log('게시글 전체조회 성공', result);
  } catch (error) {
    console.error('오류:', error);
  }
}

onMounted(() => {
  fetchMarkets();
})
</script>

<template>
<div class="market-page">
  <div class="share_container">
    <div class="share_text">
      <div v-if="markets.length > 0" class="market-list">
        <div v-for="(market, index) in markets.slice().reverse()" :key="index" class="market-item">
          <div class="market_image_box">
            <p class="market-category">{{ market.marketCategory }}</p>
            <img :src="market.imageUrl" alt="Market Image" class="market-image" />
          </div>
          <div class="market_text_box">
            <p class="market-title">{{ market.marketTitle }}</p>
            <p class="market-content">{{ market.marketContent }}</p>
            <!-- <p>작성자: {{ market.userNickname }}</p>
            <p>상태: {{ market.marketStatus ? '분양 중' : '분양 완료' }}</p>
            <p>게시일: {{ market.marketCreatedAt }}</p> -->
          </div>
        </div>
      </div>

      <div v-else>
        <p>현재 등록된 게시글이 없습니다.</p>
      </div>

      <div>
        <router-link to="/market/addpost" class="addPost_btn">포스트 등록</router-link>
      </div>
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
  background-color: #f2d9bb;
  overflow: auto;
}

.share_container {
  width: 100%;
  height: 100%;
  background-color: #f2d9bb;
  display: flex;
  justify-content: space-between;
}

.share_text {
  font-family: "GothicA1-Light";
  font-size: 20px;
  color: #b3b3b3;
}

.market-list {
  width: 600px;
  max-width: 800px;
  height: 500px;
  margin: 10px 350px auto;
}

.market-list::-webkit-scrollbar {
  display: none; /* 웹킷 브라우저에서 스크롤바 숨기기 */
}

.market-item {
  background-color: white;
  border-radius: 10px;
  height: 150px;
  padding: 18px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
}

.market-category {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #d0d0d0;
}

.market-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #848484;
}

.market-content {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #848484;
}

.market-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  justify-content: center;
}

.market_image_box {
  width: 25%;
  margin-right: 20px;
}

.market_text_box {
  width: 75%;
  margin-top: 5px;
}

.addPost_btn {
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

.addPost_btn:hover {
  background-color: #148838;
}


/* 반응형 안됨...수정필요....wait... */
@media (max-width: 1200px) {
  .market-list {
    width: 90%;
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
  .market-list {
    width: 90%;
    margin: 10px auto;
  }

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

  .addPost_btn {
    position: static;
    display: block;
    margin: 20px auto;
  }
}

@media (max-width: 480px) {
  .market-category, .market-title, .market-content {
    font-size: 16px;
  }

  .market-item {
    padding: 10px;
    margin-bottom: 5px;
  }

  .addPost_btn {
    padding: 8px 16px;
  }
}
</style>
