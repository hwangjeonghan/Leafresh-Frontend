<template>
  <div class="postAdd-page">
    <div class="postAdd-container">
      <div class="post-form">
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <label for="category">카테고리</label>
            <select v-model="post.marketCategory">
              <option disabled value="">카테고리를 선택하세요.</option>
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select>
          </div>
          <div class="input-group">
            <label for="title">제목</label>
            <input type="text" v-model="post.marketTitle" />
          </div>
          <div class="input-group">
            <label for="content">내용</label>
            <textarea v-model="post.marketContent"></textarea>
          </div>
          <div class="input-group">
            <label for="image">사진</label>
            <input type="file" @change="handleImageUpload" />
          </div>
          <div class="input-group">
            <label for="visibleScope">공개범위</label>
            <select v-model="post.marketVisibleScope">
              <option disabled value="">게시글 공개범위를 선택하세요.</option>
              <option v-for="visibleScope in scopes" :key="visibleScope">{{ visibleScope }}</option>
            </select>
          </div>
          <button type="submit" class="submit-button">수정완료</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import axios from 'axios';

const router = useRouter(); 
const route = useRoute();
const post = reactive({ 
    marketCategory: '', 
    marketTitle: '', 
    marketContent: '', 
    marketImage: null, existingImagePath: '',
    marketVisibleScope: null,
    marketStatus: true
});
const categories = ['실내 소형 식물', '실내 대형 식물', '야외 정원용 식물'];
const scopes = {
  'MARKET_PUBLIC': '전체공개',
  'MARKET_ONLY_FOLLOWER': '내 팔로워에게만 공개'};

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const postImage = ref(null);

const postId = route.params.id;

const fetchPostData = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/market/detail/${postId}`,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    Object.assign(post, response.data.post);
    post.existingImagePath = response.data.post.marketImage; // 기존에 있던 이미지 경로
    post.marketVisibleScope = scopes[response.data.post.marketVisibleScope];

    console.log('데이터 잘 가져오는지: ', response.data.post);

  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    post.value = { marketCategory: '', marketTitle: '', marketContent: '', marketImage: null, marketVisibleScope: null, existingImagePath: '' };
  }
};

onMounted(() => {
  fetchPostData();
});

const isFormValid = computed(() => {
  return post.marketCategory && post.marketTitle && post.marketContent && post.marketVisibleScope;
});
  
const handleImageUpload = (event) => {
  postImage.value = event.target.files[0];
};
  
const findScopeEnum = (visibleScopeLabel) => {
  return Object.keys(scopes).find(key => scopes[key] === visibleScopeLabel);
};

const submitForm = async () => {
  console.log('폼 제출 핸들러 응답');
  console.log('유효성 : ', isFormValid.value);
  
  if (isFormValid.value) {
    try {
        let uploadedImagePath = post.existingImagePath; // 기존 이미지 경로

        if (postImage.value) { // 새로 등록한 이미지가 있으면
            const formData = new FormData();
            formData.append('file', postImage.value);

            // 이미지 업로드
            const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            });

            uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim();
        }
   
      const formData = new FormData();
      formData.append('category', post.marketCategory);
      formData.append('title', post.marketTitle);
      formData.append('content', post.marketContent);
      formData.append('image', uploadedImagePath);
      console.log('status 잘 나오는지: ', post.marketStatus);
      formData.append('status', post.marketStatus);
      console.log('status 등록 전 상태 : ', post.marketStatus);
      console.log('이미지 경로 잘 나오는지', uploadedImagePath);

      const selectedScopeEnum = findScopeEnum(post.marketVisibleScope);
      formData.append('visibleScope', selectedScopeEnum);
  
      const token = localStorage.getItem('accessToken'); // 스토리지에 저장되어 있는 로그인 된 사용자의 토큰을 가져옴
      console.log('토큰 : ', token); // 토큰확인
  
      const response = await axios.put(`${API_BASE_URL}/market/modify/${postId}`, formData, {
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
  
      console.log('성공:', response.data);
      alert('게시글이 수정되었습니다.'); // 게시글이 수정되면 alert를 띄워줌
      router.push('/market'); // 게시글이 수정되고 나면 /market로 리다이렉트 시켜줌
    } catch (error) {
      console.error('오류:', error);
      alert('게시글 수정 중 오류가 발생했습니다.');
    }
  } else {
    alert('입력이 완료되지 않았습니다.');
  } 
};
</script>

<style scoped>
.postAdd-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: auto;
  background-color: #f9fff8;
}
  
.postAdd-container {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
  
.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}
  
.input-group textarea {
  width: 100%;
  height: 250px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: none;
}
  
.input-group input:focus,
.input-group select:focus,
.input-group textarea:focus {
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
  background-color: #ff822f;
  border: none;
  color: white;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
  
.submit-button:hover {
  background-color: #c76524;
  transform: translateY(-2px);
}
  
.submit-button:active {
  transform: translateY(0);
}
  
@media (max-width: 600px) {
  .postAdd-container {
    padding: 30px;
    max-width: 90%;
  }
  
  .submit-button {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>
