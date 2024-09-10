<template>
    <div class="profile-container">
        <!-- 프로필 이미지와 사용자 정보 -->
        <div class="profile-header">
            <div class="profile-image-container">
                <img :src="profileImage" alt="Profile Image" class="profile-image"/>
            </div>
            <div class="profile-info">
                <div class="profile-header-row">
                    <h2 class="profile-username">{{ username }}</h2>
                    <button class="follow-button">👤+</button>
                </div>
                <div class="profile-stats">
                    <span>반려식물
                        {{ followerPlants }}개</span>
                    <span>판매식물
                        {{ salePlants }}개</span>
                    <span>팔로워
                        {{ followers }}명</span>
                </div>
                <div class="profile-bio">
                    <p class="bio-title">{{ bioTitle }}</p>
                    <p class="bio-description">{{ bioDescription }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup="setup">
    import {ref, onMounted} from 'vue';
    import axios from 'axios';
    import {useRouter} from 'vue-router';

    const profileImage = ref('https://via.placeholder.com/150'); // 프로필 이미지 URL
    const username = ref('the_leafresh'); // 사용자 이름
    const followerPlants = ref(17); // 반려식물 개수
    const salePlants = ref(5); // 판매식물 개수
    const followers = ref('1만'); // 팔로워 수
    const bioTitle = ref('자연을 사랑하는 식집사'); // 프로필 제목
    const bioDescription = ref('식물 관련 정보를 함께 나눠요!\n희귀식물 00 아가들 분양중..'); // 프로필 설명

    const router = useRouter();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    onMounted(async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/check`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (!response.data.exists) {
      alert('프로필이 존재하지 않습니다. 프로필을 먼저 등록해주세요.');
      router.push('/profile/registration'); // 프로필 등록 페이지로 이동
    }
  } catch (error) {
    console.error('프로필 확인 오류:', error);
    alert('프로필을 확인하는 중 오류가 발생했습니다.');
    router.push('/login'); // 오류 발생 시 로그인 페이지로 이동
  }
});
</script>

<style scoped="scoped">
    .profile-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px;
        max-width: 1200px;
        /* 최대 너비를 더 크게 설정 */
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
        /* 이미지 크기 증가 */
        height: 200px;
        /* 이미지 크기 증가 */
        border-radius: 50%;
        background-color: #ddd;
    }

    .profile-info {
        padding-left: 30px;
        /* 좌측 간격 증가 */
    }

    .profile-header-row {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        /* 아래쪽 간격 추가 */
        padding-bottom: 10px;
    }

    .profile-username {
        font-size: 32px;
        /* 글자 크기 증가 */
        font-weight: bold;
    }

    .follow-button {
        padding: 8px 15px;
        /* 버튼 크기 증가 */
        margin-left: 30px;
        /* 왼쪽 간격 증가 */
        border: none;
        background-color: #e0e0e0;
        border-radius: 8px;
        /* 버튼 둥글기 증가 */
        cursor: pointer;
        font-size: 18px;
        /* 글자 크기 증가 */
    }

    .follow-button:hover {
        background-color: #d4d4d4;
    }

    .profile-stats {
        margin: 15px 0;
        /* 위아래 간격 증가 */
        font-size: 20px;
        /* 글자 크기 증가 */
        display: flex;
        padding-bottom: 20px;
        gap: 30px;
        /* 요소 간격 증가 */
    }

    .profile-bio {
        margin-top: 15px;
        /* 위쪽 간격 증가 */
        font-size: 18px;
        /* 글자 크기 증가 */
    }

    .bio-title {
        font-weight: bold;
        font-size: 20px;
        /* 글자 크기 증가 */
        padding-bottom: 10px;
    }

    .bio-description {
        white-space: pre-line;
        color: #666;
        font-size: 18px;
        /* 글자 크기 증가 */
    }
</style>
