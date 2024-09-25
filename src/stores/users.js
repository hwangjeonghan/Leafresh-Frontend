import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';

export const useUserstore = defineStore("useUserstore", () => {
  const router = useRouter(); // 라우터 설정 추가

  // 사용자 정보 상태
  const userId = ref(null);
  const userName = ref("");
  const userNickname = ref("");
  const email = ref("");
  const userPhoneNumber = ref("");
  const role = ref("");
  const imageUrl = ref(""); // 이미지 URL 상태
  const userReportCount = ref(0);
  const profileTitle = ref(""); // 프로필 타이틀
  const profileDescription = ref(""); // 프로필 설명
  const token = ref(localStorage.getItem("accessToken") || ''); // 로컬 스토리지에서 토큰을 초기화

  // 로그인 상태 변수 추가
  const isLoggedIn = ref(false); // 로그인 상태 관리
  const usersInfo = ref(false); // 사용자 정보가 존재하는지 여부
  const profileExists = ref(false); // 프로필이 존재하는지 여부\
  
  const fetchUserProfile = async () => {
    const localToken = localStorage.getItem("accessToken");
    if (localToken) {
      token.value = localToken; // 토큰을 Pinia 상태에 저장
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        // 사용자 기본 정보 가져오기
        const userResponse = await axios.get(`${API_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token.value}`, // 토큰을 헤더에 포함
          },
        });

        const userData = userResponse.data;

        // FTP 이미지 경로를 가져와 API를 통해 접근 가능한 URL로 변환
        let ftpImagePath = "";
        if (userData.imageUrl) {
          // 이미지 데이터를 axios로 가져오기
          const imageResponse = await axios.get(`${API_BASE_URL}/ftp/image`, {
            params: { path: userData.imageUrl },
            headers: {
              Authorization: `Bearer ${token.value}`, // 토큰을 헤더에 포함
            },
            responseType: 'blob', // 이미지 데이터를 blob 형태로 가져옴
          });

          // Blob URL 생성
          ftpImagePath = URL.createObjectURL(imageResponse.data);
        }

        setUserProfile({
          userId: userData.userId,
          userName: userData.userName,
          userNickname: userData.userNickname,
          email: userData.userMailAdress,
          userPhoneNumber: userData.userPhoneNumber,
          role: userData.role.name,
          imageUrl: ftpImagePath, // 이미지 URL 업데이트
          userReportCount: userData.userReportCount,
        });

        isLoggedIn.value = true; // 로그인 상태로 설정
        usersInfo.value = true; // 사용자 정보가 존재함

      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        isLoggedIn.value = false; // 오류 시 로그인 상태 false
        usersInfo.value = false; // 사용자 정보가 없음

        // 401 오류가 발생하면 로그아웃 처리
        if (error.response && error.response.status === 401) {
          await logout();
        }
      }
    } else {
      console.error("토큰이 존재하지 않습니다.");
      isLoggedIn.value = false;
      usersInfo.value = false; // 토큰이 없을 때 사용자 정보 없음
    }
  };

  // 프로필 정보를 불러오는 함수 (원예일지 클릭 시 사용)
  const fetchUserProfileDetails = async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const profileResponse = await axios.get(`${API_BASE_URL}/profile/info`, {
        headers: {
          Authorization: `Bearer ${token.value}`, // 토큰을 헤더에 포함
        },
      });

      const profileData = profileResponse.data; // ProfileDTO로 반환된 데이터
      profileExists.value = true; // 프로필이 존재함

    } catch (profileError) {
      if (profileError.response && profileError.response.status === 404) {
        profileExists.value = false; // 프로필이 없음
      } else {
        console.error('프로필 정보 가져오기 오류:', profileError);
      }
    }
  };

  // 사용자 정보를 설정하는 함수
  const setUserProfile = (profile) => {
    userId.value = profile.userId || userId.value;
    userName.value = profile.userName || userName.value;
    userNickname.value = profile.userNickname || userNickname.value;
    email.value = profile.email || email.value;
    userPhoneNumber.value = profile.userPhoneNumber || userPhoneNumber.value;
    role.value = profile.role || role.value;
    imageUrl.value = profile.imageUrl || imageUrl.value;
    userReportCount.value = profile.userReportCount || userReportCount.value;
  };

  // 로그아웃 메서드
  const logout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token.value}` },
        }
      );
      // 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      clearUserProfile(); // 사용자 정보 초기화
      setLoginState(false); // 로그인 상태 변경
      router.push('/login');
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // 로그아웃 시 사용자 정보 초기화
  const clearUserProfile = () => {
    console.log("Clearing user profile...");
    userId.value = null;
    userName.value = "";
    userNickname.value = "";
    email.value = "";
    userPhoneNumber.value = "";
    role.value = "";
    imageUrl.value = ""; // 이미지 URL 초기화
    userReportCount.value = 0;
    profileTitle.value = ""; // 프로필 타이틀 초기화
    profileDescription.value = ""; // 프로필 설명 초기화
    isLoggedIn.value = false;
    usersInfo.value = false; // 사용자 기본 정보 존재 여부 초기화
    profileExists.value = false; // 프로필 존재 여부 초기화
  };

  // 로그인 상태 설정 함수
  const setLoginState = (state) => {
    console.log("Setting login state:", state);
    isLoggedIn.value = state;
  };

  return {
    userId,
    userName,
    userNickname,
    email,
    userPhoneNumber,
    role,
    token,
    imageUrl,
    userReportCount,
    profileTitle,
    profileDescription,
    isLoggedIn,
    usersInfo, // 사용자 기본 정보 존재 여부
    profileExists, // 프로필 정보 존재 여부
    fetchUserProfile,
    fetchUserProfileDetails,
    setUserProfile,
    clearUserProfile,
    setLoginState,
    logout,
  };
});
