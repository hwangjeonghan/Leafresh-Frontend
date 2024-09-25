<template>
  <div class="outer-container">
    <div class="community_container">
      <CommunityDetail
        v-for="feed in feeds"
        :key="feed.feedId"
        :feed="feed"
        @addComment="handleAddReply(feed.feedId, $event)"
        class="feed-card"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CommunityDetail from '@/components/common/communityDetail.vue'; // FeedDetail 컴포넌트 가져오기
import { fetchReplyLists, getUserInfo } from '@/assets/js/feedReplyService';

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

    const feedsData = response.data
      .map(feedData => ({
        username: feedData.userNickname,
        content: feedData.feedContent,
        time: feedData.feedCreateAt,
        imageUrl: feedData.feedImage
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(feedData.feedImage)}`
          : "/default-profile-image.jpg",
        comments: feedData.comments || [],
        feedId: feedData.feedId
      }))
      .sort((a, b) => new Date(b.time) - new Date(a.time)); // 최신순으로 정렬

    // Fetch user images and comments for each feed
    const feedsWithDetails = await Promise.all(feedsData.map(async (feed) => {
      // Fetch comments with user information
      const comments = ref([]);
      await fetchReplyLists(feed.feedId, token, comments); // Fetch comments for each feed

      const commentsWithUserInfo = await Promise.all(comments.value.map(async (comment) => {
        try {
          const { userNickname, profileImg } = await getUserInfo(comment.userId, token);
          return {
            ...comment,
            userNickname, // 댓글 작성자 닉네임
            profileImg: `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(profileImg)}`, // 댓글 작성자 프로필 이미지
          };
        } catch (error) {
          console.error(`유저 정보 조회 실패 for userId ${comment.userId}`, error);
          return comment;
        }
      }));

      // Fetch feed owner's profile image
      try {
        const userImgResponse = await axios.get(`${API_BASE_URL}/user/info-by-nickname`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            nickname: feed.username, // Fetch image using username
          },
          timeout: 5000,
        });

        const userImg = userImgResponse.data.imageUrl;
        feed.userimg = userImg
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(userImg)}`
          : "/default-profile-image.jpg";
      } catch (error) {
        console.error(`피드 작성자 프로필 이미지 조회 오류 for ${feed.username}:`, error);
        feed.userimg = "/default-profile-image.jpg"; // Set default image if error occurs
      }

      return {
        ...feed,
        comments: commentsWithUserInfo,
      };
    }));

    feeds.value = feedsWithDetails; // Set the feeds array with complete data
  } catch (error) {
    console.error("피드 리스트 조회 오류:", error);
  }
};

// 댓글 추가 후 처리하는 함수
const handleAddReply = (feedId, newReply) => {
  const feed = feeds.value.find(feed => feed.feedId === feedId);
  if (feed) {
    feed.comments.push({ replyContent: newReply, displayDate: "방금 전" });
  }
};

onMounted(async () => {
  fetchFeeds();
});
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
