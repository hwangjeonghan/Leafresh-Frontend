<template>
    <div class="login-form">
      <h2>로그인</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">이메일</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">비밀번호</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 이메일과 비밀번호 상태를 ref로 정의
  const email = ref('');
  const password = ref('');
  
  // 폼 제출 처리 함수
  const handleSubmit = () => {
    // 'login' 이벤트를 부모 컴포넌트에 전달하며 이메일과 비밀번호 정보를 함께 전송
    const credentials = { email: email.value, password: password.value };
    emit('login', credentials);
  };
  
  // emit 함수를 setup 내에서 사용하기 위해 정의
  const emit = defineEmits(['login']);
  </script>
  
  <style scoped>
  .login-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  </style>
  