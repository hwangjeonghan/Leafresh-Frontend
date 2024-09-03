<template>
  <div>
    <LoginForm @login="login" />
    <!-- 회원가입 버튼 추가 -->
    <div class="signup-container">
      <p>계정이 없으신가요?</p>
      <!-- router-link를 사용하여 회원가입 페이지로 이동 -->
      <router-link to="/signup" class="signup-button">회원가입</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'; // vue-router 사용을 위해 import
import LoginForm from '../components/LoginForm.vue'; // LoginForm 컴포넌트 import
import axios from 'axios'; // axios import

const router = useRouter(); // router 사용 설정

// login 메소드 정의
const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', credentials); // 서버에 로그인 요청 전송
    console.log('응답 데이터:', response.data); // 디버깅용 콘솔 출력

    // 응답 데이터에 accessToken이 존재하는지 확인
    if (response.data.accessToken) {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.data.accessToken);
      // 로그인 성공 시, 대시보드로 리다이렉트
      router.push('/');
    } else {
      alert('로그인 실패: 유효한 토큰이 없습니다.');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

// 보호된 API 요청 예시 (추가된 제안)
const fetchProtectedData = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 토큰 가져오기

    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인 해주세요.');
      router.push('/login'); // 토큰이 없으면 로그인 페이지로 이동
      return;
    }

    // 보호된 API에 요청을 보낼 때, Authorization 헤더에 토큰 포함
    const response = await axios.get('http://localhost:8080/protected-endpoint', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('보호된 데이터 응답:', response.data); // 응답 데이터 출력
  } catch (error) {
    console.error('보호된 데이터 요청 오류:', error);
    alert('데이터를 불러오는 중 오류가 발생했습니다.');
  }
};

// 필요 시 다른 곳에서 fetchProtectedData 메소드를 호출하여 보호된 데이터 가져오기
// 예: fetchProtectedData();
</script>

<style scoped>
.signup-container {
  margin-top: 20px;
  text-align: center;
}

.signup-button {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #1ab546;
  color: #fff;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
}

.signup-button:hover {
  background-color: #0b4f1e;
}
</style>
