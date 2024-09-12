<template>
  <div class="login-page">
    <div class="login-container">
      <LoginForm @login="login" />
      <!-- 회원가입 버튼 추가 -->
      <div class="signup-container">
        <div class="signup-text">아직 계정이 없으신가요?</div>
        <!-- router-link를 사용하여 회원가입 페이지로 이동 -->
        <router-link to="/terms" class="signup-button">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"; // vue-router 사용을 위해 import
import LoginForm from "../components/LoginForm.vue"; // LoginForm 컴포넌트 import
import axios from "axios"; // axios import
import Swal from "sweetalert2"; // SweetAlert2 import

const router = useRouter(); // router 사용 설정

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Sweetalert2 토스트 설정 함수
const showToast = (message, icon = "warning") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
    customClass: {
      title: "custom-swal-title", // 제목의 커스텀 클래스를 지정
    },
  });
};

// login 메소드 정의
const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    ); // 서버에 로그인 요청 전송
    console.log("응답 데이터:", response.data); // 디버깅용 콘솔 출력

    // 응답 데이터에 accessToken과 refreshToken이 존재하는지 확인
    if (response.data.accessToken && response.data.refreshToken) {
      // 액세스 토큰과 리프레시 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      // 로그인 성공 시, 대시보드로 리다이렉트
      router.push("/").then(() => {
        location.reload(); // 페이지 새로고침
      });
    } else {
      showToast("로그인 실패: 유효한 토큰이 없습니다.", "error");
    }
  } catch (error) {
    console.error("로그인 오류:", error);
    showToast("로그인에 실패했습니다. 다시 시도해 주세요.", "error");
  }
};

// 액세스 토큰 재발급 함수
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      router.push("/login");
      return;
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/check-token`,
      { refreshToken },  // Refresh token 보내기
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    } else {
      showToast("세션이 만료되었습니다. 다시 로그인 해주세요.", "error");
      router.push("/login");
    }
  } catch (error) {
    console.error("토큰 재발급 오류:", error);
    showToast("세션이 만료되었습니다. 다시 로그인 해주세요.", "error");
    router.push("/login");
  }
};


// 액세스 토큰이 만료될 경우 자동으로 재발급 시도
const handleTokenExpiration = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    router.push("/login");
    return;
  }

  // 토큰이 만료된 경우
  if (!isValidToken(accessToken)) {
    await refreshAccessToken();
  }
};

// 페이지 로드 시 토큰 만료 여부를 확인하고 재발급 시도
handleTokenExpiration();

// 토큰 유효성 검사 함수
const isValidToken = (token) => {
  // 단순히 토큰의 유효 기간을 검증하는 로직을 구현할 수 있습니다.
  // 여기서는 예제로 토큰이 비어있지 않은지만 확인
  return token && token !== "";
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("@/assets/images/background.webp");
  background-size: cover; /* 이미지를 화면에 맞추어 늘리기 */
  background-position: center; /* 이미지를 화면 중앙에 위치시키기 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 설정 */
}

.login-container {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.signup-container {
  margin-top: 20px;
  text-align: center;
}

.signup-button {
  display: inline-block;
  margin-top: 10px;
  padding: 12px 30px;
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
  color: #fff;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  font-family: "GothicA1-Light";
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.signup-button:hover {
  background-color: #0b4f1e;
}

.signup-container p {
  margin-bottom: 10px;
  color: #333;
}
.signup-text {
  font-family: "GothicA1-Light";
  font-size: 16px;
  color: #000;
}
</style>
