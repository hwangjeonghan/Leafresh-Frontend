<script setup>
import MarketDetailBox from './MarketDetailBox.vue';
import { useRoute, useRouter } from "vue-router";
import { useUserstore } from '@/stores/users.js';
import { ref, computed, onMounted } from 'vue';
import { fetchMarketDetails, updateMarketStatus, deletePost } from '@/assets/js/marketService.js';
import "@/assets/css/marketDetail.css";

const route = useRoute();
const router = useRouter();
const userStore = useUserstore();
const market = ref(null);
const marketId = ref(route.params.id);
const token = localStorage.getItem("accessToken");

const marketImage = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/ftp/image?path=${encodeURIComponent(market.value.post.marketImage)}`;
});

const isUser = computed(() => userStore.email === market.value?.post?.userEmail);
const showCompletedAlert = () => alert("분양이 완료된 게시글입니다.");

const handleMarketStatusUpdate = async (id, status, marketData) => {
  try {
    await updateMarketStatus(id, status, token, marketData);
  } catch (error) {
    console.error("Status 문제 발생:", error);
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
  } catch (error) {
    console.error("오류:", error);
  }
});

</script>

<template>
  <div v-if="market && market.post" class="market_inDiary_page">
    <button class="market_inDiary_btn" @click="closeModal">X</button> // 모달창 닫기 버툰
    <div class="market_inDiary_container">
        <MarketDetailBox
          :market="market"
          :marketImage="marketImage"
          :isUser="isUser"
          :handleStatusUpdate="() => handleMarketStatusUpdate(market.post.marketId, market.post.marketStatus, market)"
          :editPost="editPost"
          :deletePost="handleDeletePost"
          :allPostList="allPostList"
        />
    </div>
  </div>
</template>
