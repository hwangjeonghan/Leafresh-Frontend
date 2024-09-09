import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router"; // 라우터 가져오기

export const useUserstore = defineStore("useUserstore", () => {
  const router = useRouter(); // 라우터 인스턴스 생성

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
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${API_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          },
        });

        const userData = response.data;

        // FTP 이미지 경로를 가져와 API를 통해 접근 가능한 URL로 변환
        const ftpImagePath = userData.imageUrl
          ? `${API_BASE_URL}/ftp/image?path=${encodeURIComponent(userData.imageUrl)}`
          : "";

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
    }
  };

  // 사용자 정보를 설정하는 함수 추가
  const setUserProfile = (profile) => {
    userId.value = profile.userId;
    userName.value = profile.userName;
    userNickname.value = profile.userNickname;
    email.value = profile.email;
    userPhoneNumber.value = profile.userPhoneNumber;
    role.value = profile.role;
    imageUrl.value = profile.imageUrl;  // 업데이트된 이미지 URL 사용
    userReportCount.value = profile.userReportCount;
  };

  // 로그아웃 메서드 정의
  const logout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("accessToken"); // 토큰을 로컬 스토리지에서 가져오기
      await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // 로컬 스토리지에서 accessToken과 refreshToken 모두 삭제
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoginState(false); // 로그인 상태 변경
      clearUserProfile(); // 사용자 정보 초기화
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
    setUserProfile,
    clearUserProfile,
    setLoginState,
    logout, // 로그아웃 함수 추가
  };
});
