<template>
  <div class="feedDetail-container">
    <div class="container">
      <div class="photo-section">
        <img :src="imageUrl" class="feed-img"/>
      </div>
      <div class="content-section">
        <div class="user-header">
          <div class="user-info">
            <img
              :src="userimg"
              alt="profile"
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
            <li v-for="(comment, index) in comments" :key="index">
              {{ comment }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'; // SweetAlert2 import
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router"; // 라우터를 사용하여 페이지 이동
import axios from "axios";
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 가져오기

// 라우터에서 id 파라미터 가져오기
const route = useRoute();
const router = useRouter(); // router 사용 설정
const username = ref(""); 
const feedId = ref(route.params.id); 
const loginState = useUserstore();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const content = ref("");
const comments = ref(["아직 댓글이 없습니다!"]);
const imageUrl = ref("");
const time = ref("");
const userimg = ref("");
const isOwner = ref(false); // 수정/삭제 버튼 노출 여부

const token = localStorage.getItem("accessToken");

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 두 자리로 맞춤
  const day = String(date.getDate()).padStart(2, '0'); // 일을 두 자리로 맞춤
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 피드 상세 정보를 가져오는 함수
const fetchFeedDetail = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/feeds/${feedId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    
    const feedData = response.data;
    username.value = feedData.userNickname; 
    userimg.value = feedData.userProfileImg;
    content.value = feedData.feedContent;
    time.value = formatDate(feedData.feedCreateAt);
    const ftpImagePath = feedData.feedImage;

    // 로그인한 유저와 피드 작성자가 같은지 확인
    isOwner.value = loginState.userNickname === feedData.userNickname;

    imageUrl.value = ftpImagePath
      ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(ftpImagePath)}`
      : "/default-profile-image.jpg";
    
  } catch (error) {
    console.error("피드 상세 조회 오류:", error);
    imageUrl.value = "/default-profile-image.jpg";
  }
};

// 피드 수정 페이지로 이동하는 함수
const goToFeedEdit = () => {
  router.push(`/garden-diary/feed-modify/${username.value}/${feedId.value}`);
};

// 피드 삭제 함수
const goToFeedDelete = async () => {
  // SweetAlert2로 삭제 확인 절차를 추가
  const result = await Swal.fire({
    title: '피드를 삭제하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f00',
    cancelButtonColor: '#b3b3b3',
    confirmButtonText: '삭제',
    cancelButtonText: '취소'
  });

  // 사용자가 삭제를 확인하면 요청을 보냄
  if (result.isConfirmed) {
    try {
      const response = await axios.put(`${API_BASE_URL}/feeds/${feedId.value}/delete`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire(
          '삭제 완료!',
          '피드가 성공적으로 삭제되었습니다.',
          'success'
        );
        // 삭제 후 피드 목록으로 리다이렉션
        goBackToDiary();
      } else {
        Swal.fire(
          '삭제 실패',
          '피드 삭제 중 오류가 발생했습니다.',
          'error'
        );
      }
    } catch (error) {
      console.error('피드 삭제 오류:', error);
      Swal.fire(
        '삭제 실패',
        '피드 삭제 중 오류가 발생했습니다.',
        'error'
      );
    }
  }
};

const goBackToDiary = () => {
  router.push(`/garden-diary/${loginState.userNickname}`); // 스토어에서 유저 닉네임을 가져와 이동
};

// 페이지 로드 시 피드 상세 정보를 가져오기
onMounted(() => {
  fetchFeedDetail();
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

.detail-exit {
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
  border-radius: 10px;
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
  color: -webkit-linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* Chrome 10-25, Safari 5.1-6 */
  color: linear-gradient(
    to right,
    #8dc26f,
    #76b852
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
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
