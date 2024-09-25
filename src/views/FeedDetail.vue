<template>
  <div class="feedDetail-container">
    <div class="container">
      <div class="photo-section">
        <img :src="imageUrl" class="feed-img" alt="Feed Image"/>
      </div>
      <div class="content-section">
        <div class="user-header">
          <div class="user-info">
            <img
              :src="userProfileImg"
              alt="User Profile"
              class="photo"
            />
            <div>{{ username }}</div>
          </div>
          <div class="detail-exit">
            <!-- 동적 경로 설정 -->
            <RouterLink :to="`/garden-diary/${username}`">
              <span class="material-icons">close</span>
            </RouterLink>
          </div>
        </div>
        <div class="middle-container">
          <div class="time-container">
            작성일자 : {{ time }}
          </div>
          <div class="btn-container" v-if="isOwner">
            <!-- 수정 버튼 추가 -->
            <div class="modify-button-section">
              <button @click="goToFeedEdit" class="modify-button">
                <span class="material-icons">edit</span>
              </button>
            </div>
            <!-- 삭제 버튼 추가 -->
            <div class="modify-button-section">
              <button @click="goToFeedDelete" class="modify-button">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        </div>
        <div class="content mb-10">
          <p>{{ content }}</p>
        </div>
        <div class="comments mb-10">
          <div>Comments</div>
          <ul>
            <replyForm :feedId="Number(feedId)" @addComment="handleAddReply" />
            <li v-for="(comment, index) in comments" :key="index" class="comments_item">
              <img :src="comment.profileImg" alt="User Profile Image" class="reply_user_image" />
              <p class="comments_nickName">{{ comment.userNickname }}</p>
              <p class="comments_content">{{ comment.replyContent }}</p>
              <p class="comments_date">{{ comment.displayDate }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from 'sweetalert2';
import { fetchReplyLists, getUserInfo } from '@/assets/js/feedReplyService';
import replyForm from '@/components/feed/replyForm.vue';
import { useUserstore } from "@/stores/users";

// -------------------- 상수 정의 --------------------
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// -------------------- 라우터 설정 --------------------
const route = useRoute();
const router = useRouter();
const useStore = useUserstore();

// -------------------- 상태 변수 정의 --------------------
const username = ref("");
const feedId = ref(route.params.id);

const content = ref("");
const comments = ref(["아직 댓글이 없습니다!"]);
const imageUrl = ref("/default-profile-image.jpg");
const userProfileImg = ref("/default-profile-image.jpg");
const time = ref("");
const isOwner = ref(false); // 수정/삭제 버튼 노출 여부

// -------------------- 유틸리티 함수 --------------------

// 토큰 가져오기 함수
const getToken = () => localStorage.getItem("accessToken");

// 에러 메시지 처리 함수
const getErrorMessage = (error) => {
  let message = '서버와 통신 중 오류가 발생했습니다.';
  if (axios.isAxiosError(error)) {
    if (error.response) {
      message = error.response.data.message || `서버 오류: ${error.response.status}`;
    } else if (error.request) {
      message = '서버 응답이 없습니다. 네트워크 상태를 확인해주세요.';
    } else {
      message = error.message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }
  return message;
};

// 로딩 스피너 표시 함수
const showLoading = (title = '로딩 중...') => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// 로딩 스피너 닫기 함수
const closeLoading = () => {
  Swal.close();
};

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// -------------------- 주요 함수 --------------------

// 피드 상세 정보를 가져오는 함수
const fetchFeedDetail = async () => {
  const token = getToken();

  if (!token) {
    return Swal.fire({
      icon: 'warning',
      title: '인증 필요',
      text: '로그인이 필요합니다. 다시 로그인해주세요.',
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/feeds/${feedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    closeLoading();
    const feedData = response.data;

    if (!feedData) {
      throw new Error('피드 데이터를 가져오는 데 실패했습니다.');
    }

    // 피드 데이터 할당
    username.value = feedData.userNickname; 
    content.value = feedData.feedContent;
    time.value = formatDate(feedData.feedCreateAt);
    
    // 로그인한 유저와 피드 작성자가 같은지 확인
    isOwner.value = useStore.userNickname === feedData.userNickname;

    // 이미지 URL 설정
    const ftpImagePath = feedData.feedImage;
    imageUrl.value = ftpImagePath
      ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`
      : "/default-profile-image.jpg";
    
    // Fetch user profile image after fetching feed details
    await fetchUserImg();

  } catch (error) {
    closeLoading();
    console.error("피드 상세 조회 오류:", error);
    const errorMessage = getErrorMessage(error);

    Swal.fire({
      icon: 'error',
      title: '피드 조회 실패',
      text: errorMessage,
    });

    // 기본 이미지 설정
    imageUrl.value = "/default-profile-image.jpg";
  }
};

// 작성한 유저의 프로필 사진을 조회하는 함수
const fetchUserImg = async () => {
  const token = getToken();

  if (!token) {
    return Swal.fire({
      icon: 'warning',
      title: '인증 필요',
      text: '로그인이 필요합니다. 다시 로그인해주세요.',
    });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/user/info-by-nickname`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        nickname: username.value, // 닉네임 값 사용
      },
      timeout: 5000,
    });
    const userImg = response.data.imageUrl;
    const ftpImagePath = userImg;

    userProfileImg.value = ftpImagePath
      ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`
      : "/default-profile-image.jpg";
    return userProfileImg.value; // 최종적으로 프로필 이미지 URL 반환
    
  } catch (error) {
    console.error("오류 발생:", error); // 에러 내용 출력
    Swal.fire({
      icon: 'error',
      title: '오류 발생',
      text: '유저 프로필 사진을 불러오는데 실패했습니다.',
    });
  }
};

// 피드 수정 페이지로 이동하는 함수
const goToFeedEdit = () => {
  router.push(`/garden-diary/feed-modify/${username.value}/${feedId.value}`);
};

// 피드 삭제 함수
const goToFeedDelete = () => {
  Swal.fire({
    title: '피드를 삭제하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f00',
    cancelButtonColor: '#b3b3b3',
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  })
  .then((result) => {
    if (result.isConfirmed) {
      const token = getToken();

      if (!token) {
        return Swal.fire({
          icon: 'warning',
          title: '인증 필요',
          text: '로그인이 필요합니다. 다시 로그인해주세요.',
        });
      }

      showLoading('피드 삭제 중...');

      axios.put(`${API_BASE_URL}/feeds/${feedId.value}/delete`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      })
      .then(response => {
        closeLoading();
        if (response.status === 200) {
          Swal.fire(
            '삭제 완료!',
            '피드가 성공적으로 삭제되었습니다.',
            'success'
          ).then(() => {
            goBackToDiary();
          });
        } else {
          Swal.fire(
            '삭제 실패',
            '피드 삭제 중 오류가 발생했습니다.',
            'error'
          );
        }
      })
      .catch(error => {
        closeLoading();
        console.error('피드 삭제 오류:', error);
        const errorMessage = getErrorMessage(error);

        Swal.fire(
          '삭제 실패',
          errorMessage,
          'error'
        );
      });
    }
  });
};

// 피드 목록으로 돌아가는 함수
const goBackToDiary = () => {
  router.push(`/garden-diary/${useStore.userNickname}`);
};

// 댓글 추가 이벤트를 받기 위한 emit 정의
const emit = defineEmits(['addComment']);

// 댓글 추가하기
const handleAddReply = async (newReply) => {
  try {
    comments.value.push(newReply);
    emit('addComment', newReply);

    await allCommentLists();
  } catch(error) {
    console.error("댓글등록 이후에 다시 불러오는거 안됨..", error);
  }
};

// 댓글 목록 가져오기
const allCommentLists = async () => {
  const token = getToken();

  if (!token) {
    return Swal.fire({
      icon: 'warning',
      title: '인증 필요',
      text: '로그인이 필요합니다. 다시 로그인해주세요.',
    });
  }

  try {
    await fetchReplyLists(feedId.value, token, comments);

    // 각 댓글의 유저 정보를 가져와 닉네임과 프로필 이미지 설정
    for (const comment of comments.value) {
      try {
        const { userNickname, profileImg } = await getUserInfo(comment.userId, token);
        comment.userNickname = userNickname;  // 댓글에 닉네임 추가
        comment.profileImg = profileImg
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(profileImg)}`
          : "/default-profile-image.jpg";
      } catch (error) {
        console.error(`유저정보 조회 실패 for userId ${comment.userId}`, error);
        // 기본 이미지 및 닉네임 설정
        comment.userNickname = "Unknown";
        comment.profileImg = "/default-profile-image.jpg";
      }
    }
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    Swal.fire({
      icon: 'error',
      title: '댓글 조회 실패',
      text: '댓글을 불러오는 중 오류가 발생했습니다.',
    });
  }
};

// -------------------- 라이프사이클 훅 --------------------
onMounted(() => {
  fetchFeedDetail();
  allCommentLists();
});
</script>

<style scoped>
.mb-10 {
  margin-bottom: 10px;
}

.mb-20 {
  margin-bottom: 20px;
}

.user-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  width: 100%;
  padding: 5px;
  border-radius: 8px;
}

.feedDetail-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: row;
  width: 95%;
  height: 800px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  border: 5px solid #a68b6a;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.photo-section {
  flex: 1.8;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feed-img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
}

.photo {
  height: 30px;
  border-radius: 50%; /* 원형 이미지로 표시 */
  margin-right: 10px;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  border-radius: 8px;
  border: none;
}

.user-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
}

.user-info div {
  font-family: "GothicA1-Light";
  font-size: 1em;
  color: #fff;
}

.content {
  flex: 3;
  overflow-wrap: break-word; /* 긴 단어나 URL이 박스를 넘어가지 않도록 줄바꿈 */
  word-wrap: break-word; /* IE11 이전 호환 */
  word-break: break-word; /* 긴 단어들이 자동으로 잘리도록 */
  overflow: hidden; /* 넘치는 텍스트 숨기기 */
}

.content p {
  font-family: "GothicA1-Light";
  margin-top: 10px;
  font-size: 0.85em;
  line-height: 1.5;
}

.comments {
  flex: 2;
}

.comments div {
  font-family: "ghanachoco";
  margin-bottom: 10px;
  font-size: 1em;
  color: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.comments ul {
  height: 95%;
  list-style-type: none;
  border: none;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 5px;
}

.comments li {
  font-family: "GothicA1-Light";
  margin-top: 10px;
  font-size: 0.9em;
}

.comments_item {
  display: flex;
  align-items: center;
  margin: 8px !important;
}

.reply_user_image {
  width: 20px; /* 이미지 크기 */
  height: 20px; /* 이미지 크기 */
  border-radius: 100%; /* 동그라미 모양 */
  object-fit: cover; /* 이미지 비율 유지 */
  margin-right: 5px;
  cursor: pointer;
}

.comments_content {
  font-size: 1em !important;
  margin: 0 0.5em 0 0 !important;
}

.comments_nickName {
  font-size: 0.8em !important;
  font-weight: bold;
  color: #2d8b5d !important;
  margin: 0 0.5em 0 0 !important;
}

.comments_date {
  font-size: 0.5em !important;
  margin: 0 !important;
}

.middle-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.time-container {
  font-family: "GothicA1-Light";
  font-size: 0.8em;
  line-height: 0.8em;
  color: #999;
  width: 100%;
  padding: 5px;
}

.btn-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: right;
  flex: 0.2;
}

.modify-button-section {}

.modify-button {
  background: #76b852; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white;
  padding: 2px 6px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.material-icons {
  font-size: 21px;
  color: #fff;
}
</style>
