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
              <input type="file" @change="onFileChange" />
            </div>
            <button type="submit" class="submit-button">수정완료</button>
          </form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';  // vue-router 사용을 위해 import
import axios from 'axios';
  
const router = useRouter(); 
const route = useRoute();
const post = reactive({ marketCategory: '', marketTitle: '', marketContent: '', marketImage: null });
const categories = ['실내 소형 식물', '실내 대형 식물', '야외 정원용 식물'];

// 환경 변수에서 API URL 가져오기
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const postImage = ref(null);

const postId = route.params.id;

watch(post, (newPost) => {
  if (newPost.marketCategory) {
    console.log('데이터가 로드되었습니다:', newPost);
  }
}, { immediate: true });

// db에 저장된 데이터 불러옴
const fetchPostData = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/market/detail/${postId}`,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    Object.assign(post, response.data.post);

  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    post.value = { marketCategory: '', marketTitle: '', marketContent: '', marketImage: null };
  }
};

onMounted(() => {
  fetchPostData();
});
  
const isFormValid = computed(() => {
  return post.value.marketCategory && post.value.marketTitle && post.value.marketContent && postImage.value;
});
  
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    postImage.value = file;
  }
};
  
// 이미지 업로드 함수
const uploadPostImage = async () => {
  if (!postImage.value) return '';
  
  const formData = new FormData();
  formData.append('file', postImage.value);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/ftp/upload`, formData);
  
    console.log('서버 응답: ', response.data);
  
    const uploadedImagePath = response.data.split(': ')[1].trim(); // 백엔드에서 받은 파일 경로
    console.log('이미지 업로드 성공:', uploadedImagePath);
  
    return uploadedImagePath;
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    alert('이미지 업로드에 실패했습니다.');
    throw error; // 이미지 업로드 실패 시 예외 발생
  }
};
  
const submitForm = async () => {
  console.log('폼 제출 핸들러 응답');
  console.log('유효성 : ', isFormValid.value);
  
  if (isFormValid.value) {
    try {
      const uploadedImagePath = await uploadPostImage(); // 이미지 업로드 후 경로 받아옴
        
      if (!uploadedImagePath) {
        throw new Error('이미지 업로드 경로를 받지 못했습니다.');
      }
  
      const formData = new FormData();
      formData.append('category', post.value.marketCategory);
      formData.append('title', post.value.marketTitle);
      formData.append('content', post.value.marketContent);
      formData.append('image', uploadedImagePath);
      console.log('이미지 경로 잘 나오는지', uploadedImagePath);
  
      const token = localStorage.getItem('accessToken'); // 스토리지에 저장되어 있는 로그인 된 사용자의 토큰을 가져옴
      console.log('토큰 : ', token); // 토큰확인
  
    const response = await fetch(`${API_BASE_URL}/market/addpost`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
      }
  
      const result = await response.json();
      console.log('성공:', result);
      alert('게시글이 등록되었습니다.'); // 게시글이 등록되면 alert를 띄워줌
      router.push('/market'); // 게시글이 등록되고 나면 /market로 리다이렉트 시켜줌
    } catch (error) {
      console.error('오류:', error);
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

