<template>
  <div class="postAdd-page">
    <h1>분양 보내기</h1>
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
  
          <button type="submit" class="submit-button">등록</button>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';  // vue-router 사용을 위해 import

  export default {
    setup() {
      const router = useRouter(); 

      const post = ref({ marketCategory: '', marketTitle: '', marketContent: '', marketImage: null });
      const categories = ['실내 소형 식물', '실내 대형 식물', '야외 정원용 식물'];
  
      const isFormValid = computed(() => {
        return post.value.marketCategory && post.value.marketTitle && post.value.marketContent && post.value.marketImage;
      });
  
      const onFileChange = (event) => {
        post.value.marketImage = event.target.files[0];
      };
  
      const submitForm = async () => {
        console.log('폼 제출 핸들러 응답');
        console.log('유효성 : ', isFormValid.value);

        if (isFormValid.value) {
          const formData = new FormData();
          formData.append('category', post.value.marketCategory);
          formData.append('title', post.value.marketTitle);
          formData.append('content', post.value.marketContent);
          formData.append('image', post.value.marketImage);
  
          const tokentest = localStorage.getItem('accessToken'); // 스토리지에 저장되어 있는 로그인 된 사용자의 토큰을 가져옴
          console.log('토큰 : ', tokentest); // 토큰확인

          try {
            const response = await fetch('http://localhost:8080/market/addpost', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': 'Bearer ' + tokentest,
              }
            });
  
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`서버 응답 오류 : ${errorData.message || '알수없는 오류'}`);
            }
  
            const result = await response.json();
            console.log('성공:', result);
            alert('게시글이 등록되었습니다.'); // 게시글이 등록되면 alert를 띄워줌
            router.push('/plant-share'); // 게시글이 등록되고 나면 /plant-share로 리다이렉트 시켜줌
          } catch (error) {
            console.error('오류:', error);
          }
        } else {
          alert('입력이 완료되지 않았습니다.');
        }
      };
  
      return {
        post,
        categories,
        isFormValid,
        onFileChange,
        submitForm,
      }
    }
}
</script>

<style scoped>
.postAdd-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: auto; /* 화면을 벗어나면 스크롤 활성화 */
}

.postAdd-container {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  max-height: 90vh; /* 컨테이너의 최대 높이를 설정 */
  overflow-y: auto; /* 수직 스크롤 활성화 */
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