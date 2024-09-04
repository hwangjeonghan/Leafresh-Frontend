<template>
  <div class="login-form">
    <h2>로그인</h2>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" v-model="email" placeholder="이메일을 입력하세요" required />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" v-model="password" placeholder="비밀번호를 입력하세요" required />
      </div>
      <button type="submit" class="submit-button">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// emit 함수를 setup 내에서 사용하기 위해 정의
const emit = defineEmits(['login']);

// 이메일과 비밀번호 상태를 ref로 정의
const email = ref('');
const password = ref('');

// 폼 제출 처리 함수
const handleSubmit = () => {
  // 'login' 이벤트를 부모 컴포넌트에 전달하며 이메일과 비밀번호 정보를 함께 전송
  const credentials = { email: email.value, password: password.value };
  emit('login', credentials);
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
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
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
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
  background-color: #1ab546;
  border: none;
  color: white;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #148838;
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
}
</style>
