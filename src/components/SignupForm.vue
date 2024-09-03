<template>
  <div class="signup-form">
    <h2>회원가입</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">이름</label>
        <input type="text" v-model="userName" required />
      </div>
      <div>
        <label for="nickname">닉네임</label>
        <input type="text" v-model="userNickname" required />
      </div>
      <div>
        <label for="phoneNumber">전화번호</label>
        <input type="text" v-model="userPhoneNumber" required />
      </div>
      <div>
        <label for="email">이메일</label>
        <input type="email" v-model="userMailAdress" required />
      </div>
      <div>
        <label for="password">비밀번호</label>
        <input type="password" v-model="userPassword" required />
      </div>
      <div>
        <label for="confirmPassword">비밀번호 확인</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
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
import axios from 'axios';
import { useRouter } from 'vue-router'; // Vue Router 사용

// 상태 관리
const userName = ref('');
const userNickname = ref('');
const userPhoneNumber = ref('');
const userMailAdress = ref('');
const userPassword = ref('');
const confirmPassword = ref('');
const profileImage = ref(null);
const imageUrl = ref('');

// Vue Router 사용을 위한 router 설정
const router = useRouter();

// 기본값 설정
const userStatus = 'ACTIVE';
const role = 'USER';

// API URL 설정
const API_BASE_URL = 'http://localhost:8080';

// 이미지 업로드 처리 함수
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = file;
  }
};

// 이미지 업로드 함수
const uploadProfileImage = async () => {
  if (!profileImage.value) return '';
  
  const formData = new FormData();
  formData.append('file', profileImage.value);

  try {
    const response = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const uploadedImagePath = response.data.split(': ')[1].trim(); // 경로만 추출
    console.log('이미지 업로드 성공:', uploadedImagePath);
    return uploadedImagePath;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    alert('이미지 업로드에 실패했습니다.');
    throw error; // 이미지 업로드 실패 시 예외 발생
  }
};

// 폼 제출 처리 함수
const handleSubmit = async () => {
  // 비밀번호 확인
  if (userPassword.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 전화번호 유효성 검사 및 형식화
  const formattedPhoneNumber = userPhoneNumber.value.replace(/[^0-9]/g, ''); // 숫자만 남김
  if (!/^\d+$/.test(formattedPhoneNumber)) {
    alert('유효한 전화번호를 입력하세요.');
    return;
  }

  // 이미지 업로드
  try {
    imageUrl.value = await uploadProfileImage();
  } catch (error) {
    return; // 이미지 업로드 실패 시 함수 종료
  }

  // 회원가입 정보 전송
  const userInfo = {
    name: userName.value,  // 필드명 수정
    nickname: userNickname.value,  // 필드명 수정
    phoneNumber: formattedPhoneNumber,  // 필드명 수정, 문자열로 처리
    email: userMailAdress.value,  // 필드명 수정
    password: userPassword.value,  // 필드명 수정
    imageUrl: imageUrl.value,
  };



  try {
    await axios.post(`${API_BASE_URL}/auth/signup`, userInfo);
    alert('회원가입이 성공적으로 완료되었습니다.');
    router.push('/login');  // 회원가입 성공 후 로그인 페이지로 이동
  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('회원가입에 실패했습니다.');
  }
};
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
