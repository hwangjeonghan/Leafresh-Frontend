<template>
<div class="market_detail_page">
    <div class="market_detail_container">
    <div v-if="market" class="market_detail_box">
      <div class="market_detail_header">
        <div>
          <div class="market_category_box"> {{ market.post.marketCategory }} </div>
          <div class="market_content_box">{{ market.post.userNickname }}</div>
        </div>
        <div class="market_post_info_box">
          <div :class="market.post.marketStatus ? 'market_status_box_true' : 'market_status_box_false'">
            <p>{{ market.post.marketStatus ? '분양중' : '분양 완료' }}</p>
          </div>
          <div class="market_created_box">
            <p class="market_created_at" style="text-align: right;">{{ market.post.displayDate }}</p>
          </div>
        </div>
      </div>

      <img class="market_image_box" :src="marketImage" alt="Market Image" />
      <div class="market_title_box">{{ market.post.marketTitle }} </div>
      <div class="market_content_box">{{ market.post.marketContent }}</div>
      <div class="market_btn_box">
        <button @click="editPost(market.post.marketId)">수정하기</button>
        <button @click="deletePost(market.post.marketId)">삭제하기</button>
      </div>
      
     <!-- 원형 채팅하기 버튼 -->
     <button @click="openChatModal" class="market_chat_circle">채팅하기</button>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>

    <!-- 모달 창 (v-if로 표시 여부 제어) -->
    <div v-if="isChatModalOpen" class="chat-modal">
      <div class="chat-modal-content">
        <!-- Chat.vue 컴포넌트를 모달 내에 렌더링 -->
        <ChatComponent :roomId="market.post.marketId" @close="closeChatModal" />
      </div>
    </div>
  </div>
</template>




<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import  ChatComponent from './Chat.vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const marketId = ref(route.params.id);
const market = ref(null);
const marketImage = ref('');
const isChatModalOpen = ref(false); // 모달 창 열림 상태

// 모달 열기
const openChatModal = () => {
  isChatModalOpen.value = true;
};

// 모달 닫기
const closeChatModal = () => {
  isChatModalOpen.value = false;
};

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

const editPost = (id) => {
    router.push(`/market/modify/${id}`);
}

const deletePost = async (id) => {
  if (!id) {
    console.error('삭제할 게시글 ID가 없습니다.');
    return;
  }

  const confirmed = confirm('삭제된 게시글은 되돌릴 수 없습니다. 그래도 삭제하시겠습니까?');

  if (!confirmed) {
    // 사용자가 취소를 누르면 함수 종료
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/market/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`삭제 오류: ${errorData.message || '알 수 없는 오류'}`);
    }

    // 삭제 성공 시
    console.log('게시글 삭제 성공');
    router.push('/market'); // 삭제 후 리스트 페이지로 리다이렉트
  } catch (error) {
    console.error('오류:', error);
    alert('삭제 중 오류가 발생했습니다.');
  }
}


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
  max-width: 40vw;
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
  /* text-align: center; */
}
.market_detail_box {
  width: 100%;
}

.market_created_box {
  width: 4.5vw;
  text-align: right;
  font-size: 1.2vw;
  font-weight: bold;
  margin-bottom: 10px;
  color: #bdbdbd;
  text-align: right;
  font-size: 0.95em;
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
  margin-bottom: 1.4vw;
  margin-top: 0.8vw;
  color: #d0d0d0;
  text-align: left;
  flex: 1;
}

.market_title_box {
  font-size: 2.2em;
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
  width: 40vw; /* 부모 컨테이너에 맞추기 */
  height: auto; /* 비율 유지하면서 크기 조절 */
  max-width: 100%; /* 최대 너비 설정 */
  max-height: 40vh; /* 최대 높이 설정 */
  object-fit: cover; /* 이미지가 박스에 맞게 잘림 */
  border-radius: 8px; /* 이미지의 모서리를 둥글게 */
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #d1d1d1;
  margin-bottom: 1.3vw;
}

.market_status_box_true {
  margin: 0 0 1.5vw 0;
  width: 4vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #ffb357;
  color: white;
  border-radius: 1vw;
  font-size: 1em;
}

.market_status_box_false {
  margin: 0 0 vw 0;
  width: 4.5vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #b6b6b6;
  color: white;
  border-radius: 1vw;
  font-size: 1em;
}

.market_detail_header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 아이템을 가로로 중앙 정렬합니다. */
  width: 100%;
  margin-bottom: 1vw;
}

.market_post_info_box {
  align-items: flex-end;
  text-align: right;
  padding-left: 5vw;
}

.market_chat_circle {
  width: 60px;
  height: 60px;
  background-color: #1ab546;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
}

.market_chat_circle:hover {
  background-color: #17a43c;
}

/* 모달 스타일 */
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.chat-modal-content {
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  width: 450px;
  max-width: 100%;
  height: 80vh;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
}

</style>