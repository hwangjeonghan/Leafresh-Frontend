<template>
    <div class="signup-page">
      <div class="signup-container">
        <div class="signup-form">
          <h2>회원가입</h2>
          <form @submit.prevent="handleSubmit">
            <div class="input-group" :class="{ 'input-error': nameError }">
              <label for="name">이름</label>
              <input
                type="text"
                v-model="userName"
                placeholder="이름을 입력하세요"
                required="required"/>
              <span v-if="nameError" class="error-message">{{ nameError }}</span>
            </div>
            <div class="input-group" :class="{ 'input-error': nicknameError }">
              <label for="nickname">닉네임</label>
              <input
                type="text"
                v-model="userNickname"
                placeholder="닉네임을 입력하세요"
                required="required"/>
              <span v-if="nicknameError" class="error-message">{{ nicknameError }}</span>
            </div>
            <div class="input-group" :class="{ 'input-error': phoneNumberError }">
              <label for="phoneNumber">전화번호</label>
              <input
                type="text"
                v-model="userPhoneNumber"
                placeholder="전화번호를 입력하세요"
                required="required"/>
              <span v-if="phoneNumberError" class="error-message">{{ phoneNumberError }}</span>
            </div>
            <div class="input-group" :class="{ 'input-error': emailError }">
              <label for="email">이메일</label>
              <input
                type="email"
                v-model="userMailAdress"
                placeholder="이메일을 입력하세요"
                required="required"/>
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>
            <div class="input-group" :class="{ 'input-error': passwordError }">
              <label for="password">비밀번호</label>
              <input
                type="password"
                v-model="userPassword"
                placeholder="비밀번호를 입력하세요"
                required="required"/>
              <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
            </div>
            <div class="input-group" :class="{ 'input-error': confirmPasswordError }">
              <label for="confirmPassword">비밀번호 확인</label>
              <input
                type="password"
                v-model="confirmPassword"
                placeholder="비밀번호를 다시 입력하세요"
                required="required"/>
              <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
            </div>
            <div class="input-group">
              <label for="profileImage">프로필 이미지 업로드</label>
              <input type="file" @change="handleImageUpload" accept="image/*"/>
            </div>
            <button type="submit" class="submit-button">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const userName = ref('');
  const userNickname = ref('');
  const userPhoneNumber = ref('');
  const userMailAdress = ref('');
  const userPassword = ref('');
  const confirmPassword = ref('');
  const profileImage = ref(null);
  const imageUrl = ref('');
  
  const nameError = ref('');
  const nicknameError = ref('');
  const phoneNumberError = ref('');
  const emailError = ref('');
  const passwordError = ref('');
  const confirmPasswordError = ref('');
  
  const router = useRouter();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const handleImageUpload = (event) => {
    profileImage.value = event.target.files[0];
  };
  
  const validateInputs = () => {
    let isValid = true;
  
    if (userName.value.length > 40) {
      nameError.value = '이름은 최대 40자까지 입력할 수 있습니다.';
      isValid = false;
    } else {
      nameError.value = '';
    }
  
    if (userNickname.value.length > 15) {
      nicknameError.value = '닉네임은 최대 15자까지 입력할 수 있습니다.';
      isValid = false;
    } else {
      nicknameError.value = '';
    }
  
    const phoneNumberPattern = /^[0-9]{10,11}$/;
    if (!phoneNumberPattern.test(userPhoneNumber.value)) {
      phoneNumberError.value = '유효한 전화번호를 입력하세요.';
      isValid = false;
    } else {
      phoneNumberError.value = '';
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userMailAdress.value)) {
      emailError.value = '유효한 이메일 주소를 입력하세요.';
      isValid = false;
    } else {
      emailError.value = '';
    }
  
    if (userPassword.value.length < 6 || userPassword.value.length > 20) {
      passwordError.value = '비밀번호는 6자 이상, 20자 이하로 입력해야 합니다.';
      isValid = false;
    } else {
      passwordError.value = '';
    }
  
    if (userPassword.value !== confirmPassword.value) {
      confirmPasswordError.value = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    } else {
      confirmPasswordError.value = '';
    }
  
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }
  
    try {
      let uploadedImagePath = '';
  
      if (profileImage.value) {
        const formData = new FormData();
        formData.append('file', profileImage.value);
  
        const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim();
      }
  
      const userInfo = {
        name: userName.value,
        nickname: userNickname.value,
        phoneNumber: userPhoneNumber.value,
        email: userMailAdress.value,
        password: userPassword.value,
        imageUrl: uploadedImagePath,
      };
  
      await axios.post(`${API_BASE_URL}/auth/signup`, userInfo, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('회원가입이 성공적으로 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입에 실패했습니다.');
    }
  };
  </script>
  
  <style scoped>
  .signup-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: antiquewhite;
    overflow: auto;
  }
  
  .signup-container {
    background: #fff;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.8rem;
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
  
  .input-error input {
    border-color: red;
  }
  
  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.25rem;
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
  
  @media (max-width: 600px) {
    .signup-container {
      padding: 30px;
      max-width: 90%;
    }
  
    .submit-button {
      font-size: 1rem;
      padding: 10px;
    }
  }
  </style>
  