<template>
  <div class="signup-page">
    <div class="signup-container">
      <SignupForm @signup="signup" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import SignupForm from '../components/SignupForm.vue';  // SignupForm 컴포넌트 import
import axios from 'axios';  // axios import

const router = useRouter();  // router 사용 설정

// 회원가입 요청 처리 함수
const signup = async (userInfo) => {
  try {
    const response = await axios.post('http://localhost:8090/auth/signup', userInfo);  // 서버에 회원가입 요청 전송
    if (response.data.success) {
      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      alert('회원가입이 성공적으로 완료되었습니다.');
      router.push('/login');
    } else {
      alert('회원가입 실패: ' + response.data.message);
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('서버 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2d9bb;
}

.signup-container {
 
 
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
