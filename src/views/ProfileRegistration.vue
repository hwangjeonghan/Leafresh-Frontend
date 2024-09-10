<template>
  <div class="profile-page">
    <div class="profile-container">
      <h2>프로필 등록</h2>
      <form @submit.prevent="handleProfileSubmit">
        <div class="input-group" :class="{ 'input-error': profileTitleError }">
          <label for="profileTitle">프로필 제목</label>
          <input type="text" v-model="profileTitle" placeholder="프로필 제목을 적어주세요" required />
          <span v-if="profileTitleError" class="error-message">{{ profileTitleError }}</span>
        </div>
        <div class="input-group" :class="{ 'input-error': profileDescriptionError }">
          <label for="profileDescription">프로필 설명</label>
          <input type="text" v-model="profileDescription" placeholder="프로필 설명을 적어주세요" required />
          <span v-if="profileDescriptionError" class="error-message">{{ profileDescriptionError }}</span>
        </div>
        <button type="submit" class="submit-button">등록</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserstore } from '@/stores/users.js';

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const profileTitle = ref('');
const profileDescription = ref('');
const profileTitleError = ref('');
const profileDescriptionError = ref('');
const loginState = useUserstore();

// 프로필 정보 제출 처리 함수
const handleProfileSubmit = async () => {
  if (!validateProfileInputs()) return;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/profile/add`,
      {
        profileTitle: profileTitle.value,
        profileDescription: profileDescription.value,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );
    alert('프로필이 성공적으로 등록되었습니다.');
    router.push('/garden-diary/${loginState.userNickname}'); // 프로필 등록 후 원예 일지로 이동
  } catch (error) {
    console.error('프로필 등록 오류:', error);
    alert('프로필 등록에 실패했습니다.');
  }
};

// 유효성 검사 함수
const validateProfileInputs = () => {
  let isValid = true;

  if (profileTitle.value.length > 10) {
    profileTitleError.value = '프로필 제목은 10자까지 입력할 수 있습니다.';
    isValid = false;
  } else {
    profileTitleError.value = '';
  }

  if (profileDescription.value.length > 20) {
    profileDescriptionError.value = '프로필 설명은 20자까지 입력할 수 있습니다.';
    isValid = false;
  } else {
    profileDescriptionError.value = '';
  }

  return isValid;
};
</script>

<style scoped="scoped">
    .profile-page {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f2f2f2;
    }

    .profile-container {
        background: #fff;
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
        text-align: center;
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
</style>

