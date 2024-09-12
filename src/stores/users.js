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
  const imageUrl = ref("");
  const userReportCount = ref(0);
  const profileTitle = ref(""); // 프로필 타이틀 추가
  const profileDescription = ref(""); // 프로필 설명 추가
  const token = ref(''); // JWT 토큰 저장

  // 로그인 여부
  const isLoggedIn = ref(false);

  // 사용자 정보를 받아와 상태를 업데이트하는 함수
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
        const ftpImagePath = userData.imageUrl
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(userData.imageUrl)}`
          : "";

        // 프로필 정보 가져오기
        const profileResponse = await axios.get(`${API_BASE_URL}/profile/info`, {
          headers: {
            Authorization: `Bearer ${token.value}`, // 토큰을 헤더에 포함
          },
        });

        const profileData = profileResponse.data; // ProfileDTO로 반환된 데이터

        // 받아온 데이터를 상태에 저장
        setUserProfile({
          userId: userData.userId,
          userName: userData.userName,
          userNickname: userData.userNickname,
          email: userData.userMailAdress,
          userPhoneNumber: userData.userPhoneNumber,
          role: userData.role.name,
          imageUrl: ftpImagePath,
          userReportCount: userData.userReportCount,
          profileTitle: profileData.profileTitle || "프로필 제목 없음", // 프로필 타이틀 설정
          profileDescription: profileData.profileDescription || "프로필 설명 없음", // 프로필 설명 설정
        });

        isLoggedIn.value = true; // 로그인 상태로 설정

      } catch (error) {
        console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        isLoggedIn.value = false; // 오류 시 로그인 상태 false

        // 401 오류가 발생하면 로그아웃 처리
        if (error.response && error.response.status === 401) {
          await logout();
        }
      }
    } else {
      console.error("토큰이 존재하지 않습니다.");
      isLoggedIn.value = false;
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
    profileTitle.value = profile.profileTitle; // 프로필 타이틀 설정
    profileDescription.value = profile.profileDescription; // 프로필 설명 설정
  };

  // 로그아웃 메서드
  const logout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const localToken = localStorage.getItem("accessToken");
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${localToken}` },
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
    userId.value = null;
    userName.value = "";
    userNickname.value = "";
    email.value = "";
    userPhoneNumber.value = "";
    role.value = "";
    imageUrl.value = "";
    userReportCount.value = 0;
    profileTitle.value = ""; // 프로필 타이틀 초기화
    profileDescription.value = ""; // 프로필 설명 초기화
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
    profileTitle, // 프로필 타이틀 추가
    profileDescription, // 프로필 설명 추가
    isLoggedIn,
    fetchUserProfile,
    setUserProfile,
    clearUserProfile,
    setLoginState,
    logout,
  };
});