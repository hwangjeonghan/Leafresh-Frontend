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
import { ref, watch } from 'vue';
import axios from 'axios';
import { useUserstore } from "@/stores/users.js";
import { useRouter } from 'vue-router';

const userStore = useUserstore();  // Pinia store 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

// 모달 열기 상태 및 닫기 함수
const props = defineProps({
  isOpen: Boolean,
  closeModal: Function,
});

const newNickname = ref(userStore.userNickname);  // Pinia 상태에서 가져옴
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const newProfileImage = ref(null);
const newProfileTitle = ref(userStore.profileTitle);  // Pinia 상태에서 가져옴
const newProfileDescription = ref(userStore.profileDescription);  // Pinia 상태에서 가져옴
const passwordMismatch = ref(false);

// 모달이 열릴 때마다 초기값 설정
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      newNickname.value = userStore.userNickname;  // 닉네임 초기값 설정
      newProfileTitle.value = userStore.profileTitle;  // 프로필 제목 초기값 설정
      newProfileDescription.value = userStore.profileDescription;  // 프로필 설명 초기값 설정
      currentPassword.value = '';  // 비밀번호 필드는 빈 값으로 초기화
      newPassword.value = '';  // 새로운 비밀번호 필드는 빈 값으로 초기화
      confirmNewPassword.value = '';  // 비밀번호 확인 필드는 빈 값으로 초기화
      newProfileImage.value = null;  // 이미지 필드 초기화
    }
  }
);

const handleProfileUpdate = async () => {
  if (!currentPassword.value) {
    alert('현재 비밀번호를 입력해주세요.');
    return;
  }

  // 새로운 비밀번호와 확인 비밀번호가 일치하는지 확인
  if (newPassword.value && newPassword.value !== confirmNewPassword.value) {
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

    let newImageUrl = userStore.imageUrl;  // 기존 프로필 이미지 URL 사용

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
    const updatedUserInfo = {
      ...(newNickname.value && { newNickname: newNickname.value }),
      ...(newPassword.value && { newPassword: newPassword.value }),
      ...(newImageUrl !== userStore.imageUrl && { newImageUrl: newImageUrl }),
    };

    if (Object.keys(updatedUserInfo).length > 0) {  // 실제로 업데이트할 정보가 있는 경우에만 요청
      await axios.post(`${API_BASE_URL}/user/update`, updatedUserInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Pinia store에서 사용자 정보 업데이트
      userStore.userNickname = newNickname.value || userStore.userNickname;
      userStore.imageUrl = newImageUrl || userStore.imageUrl;
    }

    // 프로필 정보 업데이트 요청
    const updatedProfileInfo = {
      ...(newProfileTitle.value && { profileTitle: newProfileTitle.value }),
      ...(newProfileDescription.value && { profileDescription: newProfileDescription.value }),
    };

    if (Object.keys(updatedProfileInfo).length > 0) {  // 실제로 업데이트할 정보가 있는 경우에만 요청
      await axios.post(`${API_BASE_URL}/profile/modify`, updatedProfileInfo, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Pinia store에서 프로필 정보 업데이트
      userStore.profileTitle = newProfileTitle.value || userStore.profileTitle;
      userStore.profileDescription = newProfileDescription.value || userStore.profileDescription;
    }

    alert('프로필이 성공적으로 업데이트되었습니다.');
    props.closeModal();
    await userStore.fetchUserProfileDetails();  // 프로필 정보를 다시 불러와 업데이트
    router.push(`/garden-diary/${userStore.userNickname}`);
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
