<template>
    <form @submit.prevent="updateFeed">
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
        <input type="file" @change="handleFileUpload" accept="image/*" />
      </div>
      <button type="submit" class="submit-button">피드 수정</button>
    </form>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useUserstore } from '@/stores/users';

const feedContent = ref('');
const feedImage = ref(null);
const previousImageUrl = ref(''); // 이전 이미지 URL을 저장
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const loginState = useUserstore();
const route = useRoute();
const router = useRouter();

// 이미지 업로드 처리 함수
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    feedImage.value = file;
  }
};

// 이미지 업로드 함수
const uploadImageToFTP = async () => {
  if (!feedImage.value) return ''; // 새 이미지가 없으면 빈 문자열 반환

  const formData = new FormData();
  formData.append('file', feedImage.value);

  try {
    const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim(); // 경로만 추출
    return uploadedImagePath;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    throw new Error('이미지 업로드 실패');
  }
};

// 피드 데이터 로드
const loadFeedData = async () => {
  const feedId = route.params.id; // URL에서 피드 ID를 가져옴
  try {
    const response = await axios.get(`${API_BASE_URL}/feeds/${feedId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const feedData = response.data;
    feedContent.value = feedData.feedContent;
    previousImageUrl.value = feedData.feedImage; // 기존 이미지 URL 저장
  } catch (error) {
    console.error('피드 데이터를 불러오는 중 오류 발생:', error);
  }
};

// 피드 수정 함수
const updateFeed = async () => {
  const feedId = route.params.id; // 수정할 피드 ID
  try {
    // 새로운 이미지가 있으면 업로드, 없으면 기존 이미지 URL 유지
    const updatedImageUrl = feedImage.value ? await uploadImageToFTP() : previousImageUrl.value;

    const updatedFeedData = {
      feedContent: feedContent.value,
      feedImage: updatedImageUrl, // 수정된 이미지 URL 또는 기존 이미지 URL
    };

    const response = await axios.put(`${API_BASE_URL}/feeds/${feedId}`, updatedFeedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      alert('피드가 성공적으로 수정되었습니다.');
      router.push(`/garden-diary/${loginState.userNickname}`); // 수정 후 피드 목록으로 이동
    }
  } catch (error) {
    console.error('피드 수정 중 오류 발생:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

// 페이지 로드 시 피드 데이터 불러오기
onMounted(() => {
  loadFeedData();
});
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
