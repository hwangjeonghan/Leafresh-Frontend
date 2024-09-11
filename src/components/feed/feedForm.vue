<template>
  <form @submit.prevent="submitFeed">
    <div class="input-group">
      <label for="feedContent" class="feedContents">피드 내용</label>
      <textarea
        v-model="feedContent"
        placeholder="피드 내용을 입력하세요"
        required
        class="feedContent"
      ></textarea>
    </div>
    <div class="input-group">
      <label for="feedImage">피드 이미지 업로드</label>
      <input type="file" @change="handleFileUpload" accept="image/*" required />
    </div>
    <button type="submit" class="submit-button">피드 등록</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserstore } from '@/stores/users'; // Pinia 스토어에서 유저 정보를 가져오기

// 피드 데이터 상태
const feedContent = ref('');
const feedImage = ref(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // API URL
const loginState = useUserstore(); // 로그인된 유저 정보 가져오기

// 이미지 업로드 처리 함수
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    feedImage.value = file;
  }
};

// 이미지 업로드 함수
const uploadImageToFTP = async () => {

  if (!feedImage.value) return '';

  const formData = new FormData();
  formData.append('file', feedImage.value);

  try {
    let uploadedImagePath = "";

    const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim(); // 경로만 추출
    return uploadedImagePath;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    throw new Error('이미지 업로드 실패');
  }
};

// 피드 등록 함수
const submitFeed = async () => {
  if (!feedContent.value || !feedImage.value) {
    alert('모든 필드를 채워주세요.');
    return;
  }

  try {
    // 이미지 FTP 서버에 업로드
    const uploadedImageUrl = await uploadImageToFTP();

    // 피드 데이터 준비
    const feedData = {
      feedContent: feedContent.value,
      feedImage: uploadedImageUrl, // 업로드된 이미지 URL
      userId: loginState.userId, // 유저 ID 추가
      userName: loginState.userName, // 유저 이름 추가
      userNickname: loginState.userNickname, // 유저 닉네임 추가
    };

    // 로컬 스토리지에서 JWT 토큰 가져오기
    const token = localStorage.getItem('accessToken'); // 로컬 스토리지에서 'token' 키로 토큰을 가져옴
    console.log(token);

    // 피드 데이터를 백엔드에 전송 (JSON 형식)
    const response = await axios.post(`${API_BASE_URL}/feeds`, feedData, {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 추가
        'Content-Type': 'application/json',
      },
    });
    console.log(token);

    if (response.status === 200) {
      alert('피드가 성공적으로 등록되었습니다.');
    } else {
      alert('피드 등록 실패: ' + response.data.message);
    }
  } catch (error) {
    console.error('피드 등록 오류:', error);
    alert('서버 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  font-family: "GothicA1-Light";
  font-size: 24px;
  color: #A68B6A;
  display: block;
  margin-bottom: 20px;
}

.input-group textarea,
.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: "GothicA1-Light";
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-group textarea:focus,
.input-group input:focus {
  border-color: #1ab546; /* 포커스 시 테두리 색상 변경 */
  box-shadow: 0 0 0 4px rgba(28, 140, 11, 0.2); /* 포커스 시 추가 효과 */
  outline: none; /* 기본 아웃라인 제거 */
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #1C8C0B;
  border: none;
  font-family: "GothicA1-Light";
  color: white;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-button:hover {
  background-color: #18720a;
  transform: translateY(-2px);
}

.submit-button:active {
  transform: translateY(0);
}

.feedContent {
  height: 500px;
  overflow-y: scroll;
  resize: none; /* 높이 조절 막기 */
}

.feedContents {
  font-family: "GothicA1-Light";
  font-size: 18px;
  color: #000;
}
</style>
