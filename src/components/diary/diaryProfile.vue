<template>
  <div class="profile-container">
    <!-- 프로필 이미지와 사용자 정보 -->
    <div class="profile-header" v-if="profileExists">
      <div class="profile-image-container">
        <img :src="profileImage" alt="Profile Image" class="profile-image" />
      </div>
      <div class="profile-info">
        <div class="profile-header-row">
          <h2 class="profile-username">{{ username }}</h2>
          <button class="edit-button" @click="handleFollow" title="팔로잉">
            <span class="material-icons">person_add</span>
          </button>
          <button class="edit-button" @click="openEditModal" title="프로필 수정">
            <span class="material-icons">manage_accounts</span>
          </button>
          <button class="edit-button" @click="goToFeedAdd" title="피드 추가">
            <span class="material-icons">edit_note</span>
          </button>
          <button class="edit-button" @click="openPlantAddModal" title="식물 등록">
            <span class="material-icons">add_circle_outline</span>
          </button>

        </div>
        <div class="profile-stats">
          <span>반려식물 {{ followerPlants }}개</span>
          <span>판매식물 {{ salePlants }}개</span>
          <span>팔로워 {{ followers }}명</span>
        </div>
        <div class="profile-bio">
          <p class="profile-title">{{ profileTitle }}</p>
          <p class="profile-description">{{ profileDescription }}</p>
        </div>
      </div>
    </div>

    <!-- 프로필 수정 모달 컴포넌트 -->
    <EditProfileModal
      :isOpen="isEditModalOpen"
      :closeModal="closeEditModal"
      :fetchUserProfile="fetchUserProfile"
      :currentUsername="username"
      :currentProfileImage="profileImage"
    />

    <!-- 식물 등록 모달 컴포넌트 -->
    <PlantAddModal
      :isOpen="isPlantAddModalOpen"
      :closeModal="closePlantAddModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserstore } from "@/stores/users.js";
import EditProfileModal from './EditProfileModal.vue'; // 모달 컴포넌트 가져오기
import PlantAddModal from '@/views/PlantAddModal.vue'; // 식물 등록 모달 가져오기

const userStore = useUserstore();
const profileExists = ref(true);
const profileImage = ref(userStore.imageUrl || 'https://via.placeholder.com/150'); // Pinia 상태에서 가져옴
const username = ref(userStore.userNickname || 'Unknown User'); // Pinia 상태에서 가져옴
const followerPlants = ref(17);
const salePlants = ref(5);
const followers = ref('1만');
const profileTitle = ref(userStore.profileTitle || '자연을 사랑하는 식집사'); // Pinia 상태에서 가져옴
const profileDescription = ref(userStore.profileDescription || '식물 관련 정보를 함께 나눠요!\n희귀식물 00 아가들 분양중..'); // Pinia 상태에서 가져옴

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 모달 상태
const isEditModalOpen = ref(false);
const isPlantAddModalOpen = ref(false);

// 프로필 수정 모달 열기
const openEditModal = () => {
  isEditModalOpen.value = true;
};

// 프로필 수정 모달 닫기
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// 식물 등록 모달 열기
const openPlantAddModal = () => {
  isPlantAddModalOpen.value = true;
};

// 식물 등록 모달 닫기
const closePlantAddModal = () => {
  isPlantAddModalOpen.value = false;
};

// 사용자 프로필 정보 가져오기
const fetchUserProfile = async () => {
  await userStore.fetchUserProfile();
};

const goToFeedAdd = () => {
  router.push("/garden-diary/feed-add"); // 피드 추가 페이지로 이동
};


// 사용자 정보 변경 감지 및 반영
watch(
  () => userStore.userNickname,
  (newNickname) => {
    if (newNickname) {
      username.value = newNickname;
    }
  },
  { immediate: true }
);

watch(
  () => userStore.imageUrl,
  (newImageUrl) => {
    profileImage.value = newImageUrl || 'https://via.placeholder.com/150';
  },
  { immediate: true }
);

// 프로필 타이틀 변경 감지 및 반영
watch(
  () => userStore.profileTitle,
  (newProfileTitle) => {
    profileTitle.value = newProfileTitle || '프로필 제목 없음';
  },
  { immediate: true }
);

// 프로필 설명 변경 감지 및 반영
watch(
  () => userStore.profileDescription,
  (newProfileDescription) => {
    profileDescription.value = newProfileDescription || '프로필 설명 없음';
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchUserProfile();
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    const profileData = response.data;
    userStore.setUserProfile({ // Pinia store 업데이트
      ...userStore,
      profileTitle: profileData.profileTitle || '프로필 제목 없음',
      profileDescription: profileData.profileDescription || '프로필 설명 없음',
    });
  } catch (error) {
    console.error('프로필 정보 가져오기 오류:', error);
    if (error.response && error.response.status === 404) {
      alert('프로필이 존재하지 않습니다. 프로필을 먼저 등록해주세요.');
      router.push('/profile/registration');
    } else {
      alert('프로필을 가져오는 중 오류가 발생했습니다.');
      router.push('/login');
    }
  }
});
</script>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
}

.profile-header {
  display: flex;
  align-items: center;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ddd;
}

.profile-info {
  padding-left: 30px;
}

.profile-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
}

.profile-username {
  font-size: 32px;
  font-weight: bold;
  margin-right: 10px;
}

.follow-button {
  padding: 8px 15px;
  margin-left: 30px;
  border: none;
  background-color: #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
}

.follow-button:hover {
  background-color: #d4d4d4;
}

.profile-stats {
  margin: 15px 0;
  font-size: 20px;
  display: flex;
  padding-bottom: 20px;
  gap: 30px;
}

.profile-bio {
  margin-top: 15px;
  font-size: 18px;
}

.profile-title {
  font-weight: bold;
  font-size: 20px;
  padding-bottom: 10px;
}

.profile-description {
  white-space: pre-line;
  color: #666;
  font-size: 18px;
}

.edit-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #1ab546;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.edit-button:hover {
  background-color: #148838;
}
</style>
