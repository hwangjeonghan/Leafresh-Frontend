<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>새 식물 등록</h2>
      <form @submit.prevent="addPlant">
        <!-- 이미지 업로드 섹션 -->
        <div class="image-upload">
          <label for="image-input">
            <div class="image-placeholder" v-if="!imageFile">
              <span>이미지 추가</span>
            </div>
            <input
              type="file"
              id="image-input"
              @change="onImageChange"
              accept="image/*"
              class="file-input"
            />
          </label>
          <div v-if="imageUrl">
            <img :src="imageUrl" alt="이미지 미리보기" class="image-preview" />
          </div>
        </div>

        <!-- 식물 이름 입력 -->
        <div class="input-field">
          <label for="plant-name">식물이름</label>
          <input
            type="text"
            id="plant-name"
            v-model="plantName"
            placeholder="식물의 이름을 입력하세요"
            required
          />
        </div>

        <!-- 식물 종류 입력 -->
        <div class="input-field">
          <label for="plant-type">식물종류</label>
          <input
            type="text"
            id="plant-type"
            v-model="plantType"
            placeholder="식물의 종류를 입력하세요"
            required
          />
        </div>

        <!-- 등록일 입력 -->
        <div class="input-field">
          <label for="registration-date">등록일</label>
          <input
            type="date"
            id="registration-date"
            v-model="registrationDate"
            required
          />
        </div>

        <!-- 식물 설명 입력 -->
        <div class="input-field">
          <label for="plant-description">식물 설명</label>
          <textarea
            id="plant-description"
            v-model="plantDescription"
            placeholder="식물의 설명을 입력하세요"
            required
          ></textarea>
        </div>

        <!-- 등록 버튼 -->
        <button type="submit" class="submit-button">등록하기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// props에서 isOpen, closeModal 받기
const props = defineProps(['isOpen', 'closeModal']);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 상태 변수
const plantName = ref('');
const plantType = ref('');
const registrationDate = ref('');
const plantDescription = ref('');
const imageFile = ref(null); // 이미지 파일
const imageUrl = ref(''); // 이미지 URL

// 라우터 객체 사용
const router = useRouter();

// 이미지 파일 선택 처리
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};



// 식물 등록 함수
const addPlant = async () => {
  const formData = new FormData();
  formData.append('plantName', plantName.value);
  formData.append('plantType', plantType.value);
  formData.append('registrationDate', registrationDate.value);
  formData.append('plantDescription', plantDescription.value);

  // 이미지가 선택된 경우, 먼저 이미지 업로드
  if (imageFile.value) {
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile.value);

    try {
      // 이미지 업로드
      const imageUploadResponse = await axios.post(`${API_BASE_URL}/ftp/upload`, imageFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // JSON 응답에서 업로드된 파일 경로를 가져옴
      const uploadedFilePath = imageUploadResponse.data.uploadedFilePath.trim();

      
      formData.append('imageFilePath', uploadedFilePath); // 서버에서 사용하는 이미지 경로 필드
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
      return; // 이미지 업로드 실패 시 식물 등록을 중단
    }
  }

  try {
    // 식물 데이터 등록
    const response = await axios.post(`${API_BASE_URL}/api/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    console.log('식물 등록 성공:', response.data);
    router.push('/PlantDetail'); // 등록 후 이동
    closeModal(); // 모달 닫기
  } catch (error) {
    console.error('식물 등록 실패:', error);
    alert('식물 등록에 실패했습니다. 다시 시도해 주세요.');
  }
};

</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.close {
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.image-upload {
  text-align: center;
  margin-bottom: 20px;
}

.image-placeholder {
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-preview {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.file-input {
  display: none;
}

.input-field {
  margin-bottom: 15px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea {
  resize: vertical;
  height: 100px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
