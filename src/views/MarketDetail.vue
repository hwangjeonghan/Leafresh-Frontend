<template>
  <div v-if="market && market.post" class="market_detail_page">
    <div class="market_detail_container">
      <MarketDetailBox 
        :market="market"
        :marketImage="marketImage"
        :isUser="isUser"
        :handleStatusUpdate="() => handleMarketStatusUpdate(market.post.marketId, market.post.marketStatus)"
        :editPost="editPost"
        :deletePost="handleDeletePost"
        :allPostList="allPostList"
      />
        <div class="market_user_container" v-if="userInfo">
          <img :src="userImage" alt="User Profile Image" class="user_image" />
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
import MarketDetailBox from '@/components/market/MarketDetailBox.vue';
import { useUserstore } from '@/stores/users.js';
import { fetchMarketDetails, updateMarketStatus, deletePost, getUserInfo } from '@/assets/js/marketService.js';
import "@/assets/css/marketDetail.css";

const route = useRoute();
const router = useRouter();
const userStore = useUserstore();
const market = ref(null);
const marketId = ref(route.params.id);
const isChatModalOpen = ref(false); // 모달 창 열림 상태
const imageUrl = ref('');
const userInfo = ref(null);
const token = localStorage.getItem("accessToken");

const marketImage = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/ftp/image?path=${encodeURIComponent(market.value.post.marketImage)}`;
});

const userImage = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/ftp/image?path=${encodeURIComponent(userInfo.value?.imageUrl)}`;
})

const isUser = computed(() => userStore.email === market.value?.post?.userEmail);
const showCompletedAlert = () => alert("분양이 완료된 게시글입니다.");

const allPostList = () => {
  router.push('/market');
};
const editPost = (id) => {
  router.push(`/market/modify/${id}`);
};

// 모달 열기
const openChatModal = () => {
  isChatModalOpen.value = true;
};

// 모달 닫기
const closeChatModal = () => {
  isChatModalOpen.value = false;
};

const handleMarketStatusUpdate = async (id, status) => {
  try {
    await updateMarketStatus(id, status, token);
  } catch (error) {
    console.error("Edit 문제 발생:", error);
  }
};

const handleDeletePost = async (id) => {
  try {
    await deletePost(id, token);
    router.push('/market');
  } catch (error) {
    console.error("delete 문제 발생:", error);
  }
};

onMounted(async () => {
  try {
    market.value = await fetchMarketDetails(marketId.value, token);
    if (market.value) {
      const userEmail = market.value.post.userEmail;
      console.log('이메일 정상적으로 전달되는지',userEmail);
      if (userEmail) {
        const userData = await getUserInfo(userEmail, token); // 작성자의 Email을 기준으로 getUserInfo 함수를 실행함.
        userInfo.value = userData;
        console.log('userData: ',userData);
      }
    }
  } catch (error) {
    console.error("오류:", error);
  }
});
</script>

<style scoped>
</style>
