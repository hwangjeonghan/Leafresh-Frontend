<template>
  <div class="outer-container">
    <div class="community_container">
      <CommunityDetail
        v-for="feed in feeds"
        :key="feed.feedId"
        :feed="feed"
        class="feed-card"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CommunityDetail from '@/components/common/communityDetail.vue'; // FeedDetail 컴포넌트 가져오기

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("accessToken");

const feeds = ref([]);

// Fetching multiple feeds
const fetchFeeds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feeds`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    feeds.value = response.data
  .map(feedData => ({
    username: feedData.userNickname,
    userimg: feedData.userProfileImg,
    content: feedData.feedContent,
    time: feedData.feedCreateAt,
    imageUrl: feedData.feedImage
      ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(feedData.feedImage)}`
      : "/default-profile-image.jpg",
    comments: feedData.comments || [],
    feedId: feedData.feedId
  }))
  .sort((a, b) => new Date(b.time) - new Date(a.time)); // 최신순으로 정렬
  } catch (error) {
    console.error("피드 리스트 조회 오류:", error);
  }
};

onMounted(fetchFeeds);
</script>

<style scoped>
.outer-container {
  height: 100vh; /* 부모 컨테이너가 화면 전체를 차지 */
  overflow-y: scroll; /* 세로 스크롤 활성화 */
  scroll-snap-type: y mandatory; /* 스크롤 스냅 설정 */
}

/* 스크롤바 숨기기 */
.outer-container::-webkit-scrollbar {
  display: none; /* 웹킷 브라우저에서 스크롤바 숨기기 */
}

.outer-container {
  -ms-overflow-style: none;  /* IE와 Edge에서 스크롤바 숨기기 */
  scrollbar-width: none;  /* Firefox에서 스크롤바 숨기기 */
}

.community_container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feed-card {
  width: 95%;
  height: 100vh; /* 카드가 한 화면에 꽉 차도록 설정 */
  max-width: 1200px;
  margin-bottom: 20px;
  scroll-snap-align: start; /* 스크롤이 이 요소의 시작 부분에 스냅됨 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
