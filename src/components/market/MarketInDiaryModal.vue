<template>
  <div v-if="market && market.post" class="market_inDiary_page">
    <div class="market_inDiary_container">
        <MarketDetailBox
          :market="market"
          :marketImage="marketImage"
          :isUser="isUser"
          :handleStatusUpdate="() => handleMarketStatusUpdate(market.post.marketId, market.post.marketStatus, market)"
          :editPost="editPost"
          :deletePost="handleDeletePost"
          :allPostList="allPostList"
          :isModal="false"
        />
        <button class="market_inDiary_btn" @click="closeModal">닫기</button>
    </div>
  </div>
</template>

<!--  -->

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
const market = ref({});
const marketId = ref(route.params.id);
const token = localStorage.getItem("accessToken");
const emit = defineEmits(['update:modelValue']);
const closeModal = () => {
  //  모달창닫기
  emit('update:modelValue', false);
}
const props = defineProps({
  marketId: Number, // 부모한테 marketId 전달받음
  modalValue: Boolean,
  isMarketDetailOpen: {
    type: Boolean,
    required: true
  }
});

const marketImage = computed(() => {
  return `${import.meta.env.VITE_API_BASE_URL}/ftp/image?path=${encodeURIComponent(market.value.post.marketImage)}`;
});

const isUser = computed(() => userStore.email === market.value?.post?.userEmail);

const handleMarketStatusUpdate = async (id, status, marketData) => {
  try {
    await updateMarketStatus(id, status, token, marketData);
    
    if(marketData.post.marketStatus) {
      marketData.post.marketStatus = !status;
      alert('분양이 완료되었습니다.');
    }
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
    market.value = await fetchMarketDetails(props.marketId, token);
    console.log('모달창 뜸');
  } catch (error) {
    console.error("오류:", error);
  }
});
</script>

<style scoped>
.market_inDiary_page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 320px; /* 고정된 왼쪽 헤더의 너비만큼 여백 추가 */
  box-sizing: border-box; /* 패딩이 전체 너비에 포함되도록 설정 */
}

.market_inDiary_btn {
  bottom: 1vh; /* 하단에서 20px 떨어진 위치 */
  right: 20px; /* 오른쪽에서 20px 떨어진 위치 */
  background-color: #676767; /* 버튼 색상 */
  color: #fff; /* 버튼 텍스트 색상 */
  border: none;
  border-radius: 4px; /* 버튼 모서리 둥글게 */
  padding: 0.7vw; /* 버튼 내부 여백 */
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  font-size: 0.8em; /* 버튼 글씨 크기 */
}

.market_inDiary_btn:hover {
  background-color: #474747; /* 버튼 호버 색상 */
  transform: scale(1.05); /* 버튼 호버 시 약간의 확대 효과 */
}

.market_inDiary_btn:focus {
  outline: none; /* 포커스 시 기본 테두리 제거 */
}

.market_inDiary_container{
  background-color: #f9fff8;
  padding: 20px;
  border-radius: 8px;
}



</style>