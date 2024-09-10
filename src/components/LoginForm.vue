<template>
  <div class="login-form">
    <div class="login-title">Leafresh</div>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="text" v-model="email" placeholder="이메일을 입력하세요" />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input
          type="password"
          v-model="password"
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      <button type="submit" class="submit-button">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2"; // Sweetalert2 라이브러리 임포트

// emit 함수를 setup 내에서 사용하기 위해 정의
const emit = defineEmits(["login"]);

// 이메일과 비밀번호 상태를 ref로 정의
const email = ref("");
const password = ref("");

// Sweetalert2 토스트 설정
const showToast = (message) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "warning",
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

// 이메일 유효성 검사 함수
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 폼 제출 처리 함수
const handleSubmit = () => {
  if (!email.value) {
    showToast("이메일을 입력해주세요.");
    return;
  }

  if (!isValidEmail(email.value)) {
    showToast("유효한 이메일 형식을 입력해주세요.");
    return;
  }

  if (!password.value) {
    showToast("비밀번호를 입력해주세요.");
    return;
  }

  // 'login' 이벤트를 부모 컴포넌트에 전달하며 이메일과 비밀번호 정보를 함께 전송
  const credentials = { email: email.value, password: password.value };
  emit("login", credentials);
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  padding: 10px;
  text-align: center;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  font-family: "ghanachoco";
  font-size: 16px;
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
  display: block;
  margin-bottom: 0.8rem;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px !important;
  font-family: "GothicA1-Light";
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group input:focus {
  border-color: #1ab546;
  box-shadow: 0 0 0 4px rgba(26, 181, 70, 0.2);
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 12px;
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
  border: none;
  color: white;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
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
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
}

.login-title {
  font-family: "ghanachoco";
  font-size: 24px;
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
  margin-bottom: 30px;
}
</style>
