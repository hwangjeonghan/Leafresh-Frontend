<template>
  <div class="market_detail_page">
    <div class="market_detail_container">
      <div v-if="market" class="market_detail_box">
        <div class="market_detail_header">
          <div class="market_text_box">
            <div class="market_category_box">{{ market.post.marketCategory }}</div>
            <div class="market_title_box">{{ market.post.marketTitle }}</div>
          </div>
          <div class="market_post_info_box">
            <div :class="market.post.marketStatus ? 'market_status_box_true' : 'market_status_box_false'" @click="market.post.marketStatus ? updateMarketStatus(market.post.marketId, market.post.marketStatus) : showComplatedAlert">
              <p>{{ market.post.marketStatus ? "분양중" : "분양 완료" }}</p>
            </div>
            <div class="market_created_box">
              <p class="market_created_at" style="text-align: right">{{ market.post.displayDate }}</p>
            </div>
          </div>
        </div>
        <img class="market_image_box" :src="marketImage" alt="Market Image" />
        <div class="market_content_box">{{ market.post.marketContent }}</div>
        <div class="market_btn_box">
          <div v-if="isUser">
            <button class="market_btn_edit" @click="editPost(market.post.marketId)">수정하기</button>
            <button class="market_btn_delete" @click="deletePost(market.post.marketId)">삭제하기</button>
          </div>
          <button class="market_btn_list" @click="allPostList">글목록</button>
        </div>

        <div class="market_user_container" v-if="userInfo">
          <img :src="imageUrl" alt="User Profile Image" class="user_image" />
          <div class="user_info">
            <p class="user_nickname">{{ userInfo.userNickname }}</p>
            <p class="user_phonenumber">{{ userInfo.userPhoneNumber }}</p>
          </div>
          <!-- 원형 채팅하기 버튼 -->
          <button @click="openChatModal" class="market_chat_circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12c0 1.72.55 3.31 1.47 4.6L2 22l5.4-1.48C8.69 21.45 10.28 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.71 0-3.3-.53-4.6-1.47l-1.24.37.39-1.23C5.53 15.3 4 13.36 4 11c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm-1-9h2v2h-2zm0 4h2v2h-2z"
              />
            </svg>
          </button>
        </div>
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
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ChatComponent from "./Chat.vue";
import { useUserstore } from '@/stores/users.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const userStore = useUserstore();
const marketId = ref(route.params.id);
const market = ref(null);
const marketImage = ref("");
const isChatModalOpen = ref(false); // 모달 창 열림 상태
const userInfo = ref(null);
const imageUrl = ref('');

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
    const token = localStorage.getItem("accessToken"); // 현재 접속한 사용자의 액세스 토큰 가져옴

    // market detail 데이터 가져옴
    const response = await fetch(`${API_BASE_URL}/market/detail/${marketId.value}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || "알수없는 오류"}`);
    }
    const marketData = await response.json(); // 응답받은 데이터
    market.value = marketData;
    const userEmail = market.value.post.userEmail; // 게시글에 저장된 email 가져오기
    const imagePath = marketData.post.marketImage; // 게시글 url 경로 가져옴
    marketImage.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(imagePath)}`;

    // user 데이터 가져옴
    const userResponse = await fetch(`${API_BASE_URL}/user/info-market?email=${userEmail}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
    });
    const userData = await userResponse.json(); // 응답받은 user 데이터
    userInfo.value = userData;
  
    const userImagePath = userData.imageUrl; // 유저 프로필 이미지 가져와야함
    imageUrl.value = `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(userImagePath)}`;

    if (market.value && market.value.post) {
      const createdDate = new Date(marketData.post.marketCreatedAt); //  게시글 등록일을 가져와서 Date객체로 바꿈
      const today = new Date();
      const timeDiff = today - createdDate; // 밀리초 차이
      const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 일(day)로 변환

      if (dayDiff === 0) {
        market.value.post.displayDate = "오늘";
      } else if (dayDiff === 1) {
        market.value.post.displayDate = "어제";
      } else {
        market.value.post.displayDate = `${dayDiff}일 전`;
      }
    }
  } catch (error) {
    console.error("오류:", error);
  }
};

const isUser = computed(() => {
  return market.value.post.userEmail === userStore.email; // 작성자와 현재 로긍인한 사용자 이메일 같은지 비교
});

onMounted(async() => {
  await fetchMarketDetails();
});

// 분양완료 상태일때 버튼을 다시 누르면 실행시킴
const showCompletedAlert = () => {
  alert("이미 분양이 완료되었습니다. 변경이 불가능합니다");
}

// 분양중과 분양완료 상태만 바꿔서 백엔드에 저장함
const updateMarketStatus = async (id, status) => {
  if (!id) {
    console.error("게시글이 존재하지 않습니다. 다시 시도해주세요");
    return;
  }

  if (!status) { // 이미 분양 완료 상태인 경우
    showCompletedAlert();
    return;
  }

  const confirmed = confirm("분양이 완료되셨다면 확인을 눌러주세요. 분양이 완료 될 경우 다시 되돌릴 수 없습니다.");

  if (!confirmed) {
    // 사용자가 취소를 누르면 함수 종료
    return;
  }
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/market/update-status/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: !status,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`서버 응답 오류 : ${errorData.message || "알 수 없는 오류"}`);
    }

    const marketData = await response.json();
    market.value.post.marketStatus = !status;
    alert("상태가 업데이트되었습니다.");
  } catch (error) {
    console.error("오류:", error);
    alert("상태 업데이트 중 오류가 발생했습니다.");
  }
};

const allPostList = () => {
  router.push(`/market`);
}

const editPost = (id) => {
  router.push(`/market/modify/${id}`);
};

const deletePost = async (id) => {
  if (!id) {
    console.error("삭제할 게시글 ID가 없습니다.");
    return;
  }

  const confirmed = confirm("삭제된 게시글은 되돌릴 수 없습니다. 그래도 삭제하시겠습니까?");

  if (!confirmed) {
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_BASE_URL}/market/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`삭제 오류: ${errorData.message || "알 수 없는 오류"}`);
    }

    // 삭제 성공 시
    router.push("/market"); // 삭제 후 리스트 페이지로 리다이렉트
  } catch (error) {
    console.error("오류:", error);
    alert("삭제 중 오류가 발생했습니다.");
  }
};
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
  height: 90vh;
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
  margin-top: 0.9vh;
  color: #d0d0d0;
  text-align: left;
  flex: 1;
}

.market_title_box {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 15px;
  margin-top: 1.2vh;
  color: #848484;
}

.market_content_box {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 2vh;
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
  width: 7vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #ffb357;
  color: white;
  border-radius: 1vw;
  font-size: 1em;
  cursor: pointer;
}

.market_status_box_true:active {
  transform: translateY(0);
}

.market_status_box_false {
  margin: 0 0 1.5vw 0;
  width: 8vw;
  text-align: center;
  padding: 0.7vw;
  background-color: #b6b6b6;
  color: white;
  border-radius: 1vw;
  font-size: 1em;
  cursor: pointer;
}

.market_status_box_false:active {
  transform: translateY(0);
}

.market_detail_header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 아이템을 가로로 중앙 정렬합니다. */
  width: 100%;
  margin-bottom: 1vw;
}

.market_text_box {
  margin-top: 0.2vh;
}

.market_post_info_box {
  align-items: flex-end;
  text-align: right;
  padding-left: 5vw;
}

.market_chat_circle {
  width: 70px; /* 크기 */
  height: 70px;
  background-color: #28a745; /* 녹색 배경 */
  color: white;
  border-radius: 50%; /* 완전한 원형 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  /* position: fixed; 고정된 위치 */
  margin-right: 10px;
  right: 30px; /* 오른쪽 여백 */
  bottom: 30px; /* 아래 여백 */
  font-size: 24px; /* 아이콘 크기 */
  font-weight: bold;
  border: none; /* 검은색 선(테두리) 제거 */
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer; /* 마우스 커서 */
}

.market_chat_circle:hover {
  background-color: #218838; /* 어두운 초록색으로 전환 */
  transform: translateY(-5px); /* 떠오르는 효과 */
}

.market_chat_circle:active {
  transform: translateY(0); /* 클릭 시 원래 위치로 복귀 */
}

.market_chat_circle svg {
  width: 32px; /* 아이콘 크기 */
  height: 32px;
  fill: white; /* 아이콘 색상 */
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

.market_btn_box {
  display: flex;
  justify-content: flex-end;
  margin-top: 3.5vh;
}

.market_btn_list {
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  padding: 0.6vw;
  background-color: #b3b3b3;
  border: none;
  color: white;
  font-size: 0.8em;
  border-radius: 10px;
  margin-right: 0.3vw;
}

.market_btn_list:hover {
  background-color: #797979;
  transform: translateY(-2px);
}

.market_btn_edit {
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  padding: 0.6vw;
  background-color: #ff822f;
  border: none;
  color: white;
  font-size: 0.8em;
  border-radius: 10px;
  margin-right: 0.3vw;
}

.market_btn_edit:hover {
  background-color: #c76524;
  transform: translateY(-2px);
}

.market_btn_edit:active {
  transform: translateY(0);
}

.market_btn_delete {
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  padding: 0.6vw;
  background-color: #2f90ff;
  border: none;
  color: white;
  font-size: 0.8em;
  border-radius: 10px;
  margin-right: 0.3vw;
}

.market_btn_delete:hover {
  background-color: #2470c7;
  transform: translateY(-2px);
}

.market_btn_delete:active {
  transform: translateY(0);
}

.market_user_container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3vh;
  height: 14vh;
  padding: 1vw;
  border: 1px solid #dcdcdc; /* 연한 회색 테두리 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 살짝 그림자 */
  background-color: #fff; /* 배경색을 흰색으로 설정 */
}

.user_image {
  width: 100px; /* 이미지 크기 */
  height: 100px; /* 이미지 크기 */
  border-radius: 50%; /* 동그라미 모양 */
  object-fit: cover; /* 이미지 비율 유지 */
  margin-left: 10px;
}

.user_info {
  display: flex;
  flex-direction: column;
}

.user_nickname {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 14px;
}

.user_phonenumber {
  font-size: 14px;
  color: #666;
}

</style>
