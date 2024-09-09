<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router"; // Vue Router import
import { useUserstore } from "@/stores/users.js"; // Pinia 스토어 import
import axios from "axios"; // axios import

const router = useRouter(); // router 인스턴스 사용 설정
const loginState = useUserstore(); // Pinia 스토어에서 로그인된 유저 정보 가져오기
const userNickname = loginState.userNickname;
const myObject = ref([]); // 피드 데이터를 저장할 상태

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 환경 변수에서 API 기본 경로 가져오기

// 유저 닉네임으로 피드를 가져오는 함수
const fetchUserFeeds = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // 저장된 액세스 토큰 가져오기

    // API 호출을 통해 유저의 닉네임으로 피드 데이터를 가져옴
    const response = await axios.get(`${API_BASE_URL}/feeds/user/${loginState.userNickname}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
      },
    });
    
    if (response.data && response.data.length > 0) {
      myObject.value = response.data; // 가져온 데이터를 myObject에 저장
    } else {
      console.log("유저의 피드가 없습니다."); // 피드가 없을 때 메시지 출력
    }
  } catch (error) {
    // 네트워크 오류나 API 호출 오류만 출력
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 로그인 다시 필요", error);
      // 필요시 재로그인 로직 추가
    }
  }
};

// 페이지가 로드될 때 피드 데이터를 가져옴
onMounted(() => {
  fetchUserFeeds();
});

// 피드 추가 페이지로 이동
const goToFeedAdd = () => {
  router.push("/garden-diary/feed-add"); // 피드 추가 페이지로 이동
};

// 피드 상세 페이지로 이동, username을 Pinia에서 가져옴
const goToFeedDetail = (id) => {
  const username = loginState.userNickname; // Pinia에서 로그인된 유저의 username 가져오기
  router.push(`/garden-diary/feed-detail/${username}/${id}`); // username과 id를 함께 전달
};
</script>

<template>
  <div class="p-3 m-0 border-0 bd-example m-0 border-0">
    <!-- 유저 피드가 있을 경우 목록을 출력 -->
    <ul v-if="myObject.length > 0" style="list-style-type: none; padding: 0">
      <li
        v-for="(card, index) in myObject"
        :key="card.feedId"
        @click="goToFeedDetail(card.feedId)"
        style="display: inline-block; margin: 10px; padding: 10px; width: 18rem"
      >
        <div class="card" style="width: 100%">
          <a>
            <!-- 이미지가 없으면 기본 이미지를 표시 -->
            <img
              :src="card.feedImage || 'https://via.placeholder.com/150'"
              alt="feed image"
              class="card-img-top"
              style="
                width: 100%;
                height: 100%;
                aspect-ratio: 1;
                object-fit: cover;
                background-color: #f0f0f0;
              "
            />
          </a>
        </div>
      </li>
    </ul>

    <!-- 피드가 없을 때 표시할 메시지 -->
    <div v-else>
      <p>유저의 피드가 없습니다.</p>
    </div>

    <!-- 피드 추가 버튼 -->
    <div style="text-align: center; margin-top: 20px">
      <button @click="goToFeedAdd" class="btn btn-primary">피드 추가</button>
    </div>
  </div>
</template>



