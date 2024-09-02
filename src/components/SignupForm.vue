<template>
  <div class="signup-form">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">이름</label>
        <input type="text" v-model="name" required />
      </div>
      <div>
        <label for="email">이메일</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">비밀번호 확인</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <!-- 이미지 업로드 필드 추가 -->
      <div>
        <label for="profileImage">프로필 이미지 업로드</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; // axios 사용

// 상태 관리
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const profileImage = ref(null); // 업로드할 파일 상태 관리
const image_url = ref(''); // 업로드된 이미지 URL

// 이미지 업로드 처리 함수
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = file;
  }
};

// 폼 제출 처리 함수
const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 이미지 파일이 있는 경우 업로드
  if (profileImage.value) {
    const formData = new FormData();
    formData.append('file', profileImage.value);

    try {
      const response = await axios.post('http://localhost:8080/ftp/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // 서버에서 업로드된 이미지의 경로만 가져와서 image_url에 설정
      const uploadedImagePath = response.data.split(': ')[1]; // "파일 업로드 성공: 경로"에서 경로만 추출
      image_url.value = uploadedImagePath.trim(); // URL에서 공백 제거
      console.log('이미지 업로드 성공:', image_url.value);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
      return;
    }
  }

  // 회원가입 정보 전송
  const userInfo = { name: name.value, email: email.value, password: password.value, image_url: image_url.value };
  emit('signup', userInfo);
};

// emit 함수를 setup 내에서 사용하기 위해 정의
const emit = defineEmits(['signup']);
</script>

<style scoped>
.signup-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
