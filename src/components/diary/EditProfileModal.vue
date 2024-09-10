<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 class="modal-title">프로필 수정</h2>
      <div class="input-group">
        <label for="newNickname">새로운 닉네임:</label>
        <input type="text" id="newNickname" v-model="newNickname" class="input-field" />
      </div>
      <div class="input-group">
        <label for="currentPassword">현재 비밀번호:</label>
        <input type="password" id="currentPassword" v-model="currentPassword" class="input-field" />
      </div>
      <div class="input-group">
        <label for="newPassword">새로운 비밀번호:</label>
        <input type="password" id="newPassword" v-model="newPassword" class="input-field" />
      </div>
      <div class="input-group">
        <label for="confirmNewPassword">새로운 비밀번호 확인:</label>
        <input type="password" id="confirmNewPassword" v-model="confirmNewPassword" class="input-field" />
      </div>
      <div v-if="passwordMismatch" class="error-message">비밀번호가 일치하지 않습니다.</div>
      <div class="input-group">
        <label for="newProfileImage">새로운 프로필 이미지:</label>
        <input type="file" id="newProfileImage" @change="handleImageUpload" class="input-field" />
      </div>
      <!-- 프로필 타이틀 필드 추가 -->
      <div class="input-group">
        <label for="newProfileTitle">프로필 제목:</label>
        <input type="text" id="newProfileTitle" v-model="newProfileTitle" class="input-field" />
      </div>
      <!-- 프로필 설명 필드 추가 -->
      <div class="input-group">
        <label for="newProfileDescription">프로필 설명:</label>
        <textarea id="newProfileDescription" v-model="newProfileDescription" class="input-field"></textarea>
      </div>
      <button class="submit-button" @click="handleProfileUpdate">업데이트</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserstore } from "@/stores/users.js";

const userStore = useUserstore();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  isOpen: Boolean,
  closeModal: Function,
  fetchUserProfile: Function,
  currentUsername: String,
  currentProfileImage: String,
});

const newNickname = ref(props.currentUsername);
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const newProfileImage = ref(null);
const newProfileTitle = ref('');  // 프로필 타이틀 상태 추가
const newProfileDescription = ref('');  // 프로필 설명 상태 추가
const passwordMismatch = ref(false);

const handleProfileUpdate = async () => {
  if (!currentPassword.value) {
    alert('현재 비밀번호를 입력해주세요.');
    return;
  }

  // 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
  if (newPassword.value !== confirmNewPassword.value) {
    passwordMismatch.value = true;
    return;
  } else {
    passwordMismatch.value = false;
  }

  try {
    // 비밀번호 검증
    const verifyResponse = await axios.post(`${API_BASE_URL}/user/verify-password`, {
      password: currentPassword.value
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!verifyResponse.data.success) {
      alert('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    let newImageUrl = props.currentProfileImage;  // 기존 프로필 이미지 URL 사용

    // 새로운 이미지가 업로드된 경우
    if (newProfileImage.value) {
      const formData = new FormData();
      formData.append('file', newProfileImage.value);

      // 이미지 업로드
      const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // JSON 응답에서 업로드된 파일 경로를 가져옴
      newImageUrl = imageUploadResponse.data.uploadedFilePath.trim();
    }

    // 사용자 정보 업데이트 요청
    await axios.post(`${API_BASE_URL}/user/update`, {
      newNickname: newNickname.value,
      newPassword: newPassword.value ? newPassword.value : undefined,  // 빈 문자열이면 undefined
      newImageUrl: newImageUrl,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // 프로필 정보 업데이트 요청
    await axios.post(`${API_BASE_URL}/profile/modify`, {  // 여기를 수정하여 ProfileController에 요청합니다.
      profileTitle: newProfileTitle.value,  // 추가된 프로필 타이틀 필드
      profileDescription: newProfileDescription.value,  // 추가된 프로필 설명 필드
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    // Pinia store에서 프로필 정보 업데이트
    userStore.setUserProfile({
      ...userStore, // 기존 프로필 정보 복사
      userNickname: newNickname.value,
      imageUrl: newImageUrl,
      profileTitle: newProfileTitle.value,
      profileDescription: newProfileDescription.value
    });

    alert('프로필이 성공적으로 업데이트되었습니다.');
    props.closeModal();
    props.fetchUserProfile();
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    alert('프로필 업데이트 중 오류가 발생했습니다.');
  }
};

const handleImageUpload = (event) => {
  newProfileImage.value = event.target.files[0];
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  transition: color 0.3s;
}

.close:hover {
  color: #333;
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #1ab546;
  outline: none;
}

.error-message {
  color: red;
  margin-bottom: 15px;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #1ab546;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #148838;
}
</style>
