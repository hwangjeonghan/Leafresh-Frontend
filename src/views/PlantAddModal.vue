<template>
  <div v-if="isOpen" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>새 식물 등록</h2>
      <form @submit.prevent="addPlant">
        <!-- 이미지 업로드 섹션 -->
        <div class="image-upload">
          <label class="image-placeholder" for="image-input">사진 선택</label>
          <input
            type="file"
            id="image-input"
            @change="handleImageUpload"
            class="file-input"
          />
          <div v-if="imageUrl" class="image-container">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserstore } from "../stores/users";
import axios from "axios";

// userStore 불러오기
const userStore = useUserstore();
const userId = ref(userStore.userId);
const userNickname = ref(userStore.userNickname);


const props = defineProps(["isOpen", "closeModal"]);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const plantName = ref("");
const plantType = ref("");
const registrationDate = ref("");
const plantDescription = ref("");
const imageFile = ref(null);
const imageUrl = ref("");

const router = useRouter();

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
  }
};

const addPlant = async () => {

  console.log("UserId:", userId.value);
  console.log("UserNickname:", userNickname.value);


  if (!imageFile.value) {
    alert("이미지를 업로드해 주세요.");
    return;
  }

  const imageFormData = new FormData();
  imageFormData.append("file", imageFile.value);

  let uploadedImagePath;
  try {
    const imageUploadResponse = await axios.post(
      `${API_BASE_URL}/ftp/upload`,
      imageFormData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    uploadedImagePath = imageUploadResponse.data.uploadedFilePath.trim();
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    alert("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("plantName", plantName.value);
  formData.append("plantType", plantType.value);
  formData.append("registrationDate", registrationDate.value);
  formData.append("plantDescription", plantDescription.value);
  formData.append("imageUrl", uploadedImagePath);
  formData.append("userId", userId.value);
  formData.append("userNickname", userNickname.value);

  try {
    await axios.post(`${API_BASE_URL}/api/add`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    alert("식물등록에 성공하셨습니다"); // 성공 메시지 표시
    // router.push("/plant/detail"); // 등록 후 이동
    props.closeModal(); // 모달 닫기
  } catch (error) {
    console.error("식물 등록 실패:", error);
    alert("식물 등록에 실패했습니다. 다시 시도해 주세요.");
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
