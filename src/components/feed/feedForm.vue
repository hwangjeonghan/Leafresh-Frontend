<template>
  <form @submit.prevent="submitFeed">
    <div class="input-group">
      <label for="feedContent" class="feedContents">피드 내용</label>
      <textarea v-model="feedContent" placeholder="피드 내용을 입력하세요" required class="feedContent"></textarea>
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

const feedContent = ref('');
const feedImage = ref(null);

// 이미지 업로드 처리 함수
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    feedImage.value = file;
  }
};

// 피드 등록 폼 제출 처리 함수
const submitFeed = () => {
  if (!feedContent.value || !feedImage.value) {
    alert('모든 필드를 채워주세요.');
    return;
  }

  const feedData = {
    content: feedContent.value,
    image: feedImage.value,
  };
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
