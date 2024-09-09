// stores/userStore.js
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useUserstore = defineStore("useUserstore", () => {
  // 사용자 정보 상태
  const userId = ref(null);
  const userName = ref("");
  const userNickname = ref("");
  const email = ref("");
  const userPhoneNumber = ref("");
  const role = ref("");
  const imageUrl = ref("");
  const userReportCount = ref(0);
  
  // 로그인 여부
  const isLoggedIn = ref(false);

  // 사용자 정보를 받아와 상태를 업데이트하는 함수
  const fetchUserProfile = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 토큰을 헤더에 포함
        },
      });

      const userData = response.data;

      // 받아온 데이터를 상태에 저장
      userId.value = userData.userId;
      userName.value = userData.userName;
      userNickname.value = userData.userNickname;
      email.value = userData.userMailAdress;
      userPhoneNumber.value = userData.userPhoneNumber;
      role.value = userData.role.name;
      imageUrl.value = userData.imageUrl;
      userReportCount.value = userData.userReportCount;
      isLoggedIn.value = true; // 로그인 상태로 설정

    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
      isLoggedIn.value = false; // 오류 시 로그인 상태 false
    }
  };

  // 로그아웃 시 사용자 정보 초기화
  const clearUserProfile = () => {
    userId.value = null;
    userName.value = "";
    userNickname.value = "";
    email.value = "";
    userPhoneNumber.value = "";
    role.value = "";
    imageUrl.value = "";
    userStatus.value = "";
    userReportCount.value = 0;
    isLoggedIn.value = false;
  };

  const setLoginState = (state) => {
    isLoggedIn.value = state;
  };

  return {
    userId,
    userName,
    userNickname,
    email,
    userPhoneNumber,
    role,
    imageUrl,
    userReportCount,
    isLoggedIn,
    fetchUserProfile,
    clearUserProfile,
    setLoginState,
  };
});
