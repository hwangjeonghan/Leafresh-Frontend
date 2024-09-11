import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

export const useUserstore = defineStore("useUserstore", () => {
  // 사용자 정보 상태
  const userId = ref(localStorage.getItem("userId") || null);
  const userName = ref("");
  const userNickname = ref("");
  const email = ref("");
  const userPhoneNumber = ref("");
  const role = ref("");
  const imageUrl = ref("");
  const userReportCount = ref(0);
  const profileTitle = ref(""); // 프로필 타이틀 추가
  const profileDescription = ref(""); // 프로필 설명 추가
  const token = ref(localStorage.getItem("accessToken") || null); // JWT 토큰 저장
  const router = useRouter(); // Pinia 스토어 내부에서 useRouter 사용

  // 로그인 여부
  const isLoggedIn = ref(!!token.value); // 토큰이 있으면 로그인 상태로 간주

  // API 기본 URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // 사용자 정보를 받아와 상태를 업데이트하는 함수
  const fetchUserProfile = async () => {
    updateToken(); // 토큰 다시 불러옴

    if (!token.value) {
      console.error("토큰이 존재하지 않습니다.");
      isLoggedIn.value = false;
      return;
    }

    try {
      // 사용자 기본 정보 가져오기
      const userResponse = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const userData = userResponse.data;

      // FTP 이미지 경로를 API를 통해 접근 가능한 URL로 변환
      const ftpImagePath = userData.imageUrl
        ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(userData.imageUrl)}`
        : "";

      // 프로필 정보 가져오기
      const profileResponse = await axios.get(`${API_BASE_URL}/profile/info`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      const profileData = profileResponse.data;

      // 받아온 데이터를 상태에 저장
      setUserProfile({
        userId: userData.userId,
        userName: userData.userName,
        userNickname: userData.userNickname,
        email: userData.userMailAdress,
        userPhoneNumber: userData.userPhoneNumber,
        role: userData.role.name,
        imageUrl: ftpImagePath,
        token: token.value,
        userReportCount: userData.userReportCount,
        profileTitle: profileData.profileTitle || "프로필 제목 없음",
        profileDescription: profileData.profileDescription || "프로필 설명 없음",
      });

      isLoggedIn.value = true; // 로그인 상태로 설정

    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
      isLoggedIn.value = false; // 오류 시 로그인 상태 false
      if (error.response && error.response.status === 401) {
        await logout();
      }
    }
  };

  // 사용자 정보를 설정하는 함수
  const setUserProfile = (profile) => {
    userId.value = profile.userId;
    userName.value = profile.userName;
    userNickname.value = profile.userNickname;
    email.value = profile.email;
    userPhoneNumber.value = profile.userPhoneNumber;
    role.value = profile.role;
    imageUrl.value = profile.imageUrl;
    userReportCount.value = profile.userReportCount;
    profileTitle.value = profile.profileTitle;
    profileDescription.value = profile.profileDescription;
    token.value = profile.token;

    // 로컬 스토리지에 토큰 저장
    saveToken(profile.token);
  };

  // 토큰 저장 및 업데이트 함수
  const saveToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    } else {
      localStorage.removeItem("accessToken");
    }
    token.value = newToken;
  };

  const updateToken = () => {
    token.value = localStorage.getItem("accessToken");
  };

  // 로그아웃 메서드
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearUserProfile();
      setLoginState(false);
      alert("로그아웃 되었습니다.")
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("서버 오류가 발생했습니다.");
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
    userReportCount.value = 0;
    profileTitle.value = "";
    profileDescription.value = "";
    token.value = null;
    isLoggedIn.value = false;
  };

  // 로그인 상태 설정 함수
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
    profileTitle,
    profileDescription,
    isLoggedIn,
    fetchUserProfile,
    setUserProfile,
    clearUserProfile,
    setLoginState,
    logout,
  };
}, {
  persist: {
    enabled: true, // 로컬 스토리지에 상태 저장 활성화
    strategies: [
      {
        key: 'user-store', // 로컬 스토리지에 저장될 키
        storage: localStorage, // 로컬 스토리지를 사용
      },
    ],
  },
});
