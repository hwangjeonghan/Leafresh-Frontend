
<script setup>
import { onMounted, watch } from 'vue'; // watch 추가
import { useRouter } from 'vue-router'; // vue-router 사용
import axios from 'axios'; // axios 사용
import { isLoggedIn, setLoginState } from '../../stores/useLoginState.js'; // 로그인 상태 전역 관리

const router = useRouter(); // router 사용 설정

// 로그아웃 메서드 정의
const logout = async () => {
  try {
    // 로그아웃 API 호출
    await axios.post('http://localhost:8080/auth/logout');
    // 로그아웃 성공 시, 토큰 제거 및 상태 업데이트
    localStorage.removeItem('accessToken');
    setLoginState(false); // 전역 상태로 관리되는 로그인 상태 변경
    // 로그인 페이지로 리다이렉트
    router.push('/login');
  } catch (error) {
    console.error('로그아웃 오류:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

// 페이지 로드 시 토큰 확인하여 로그인 상태 설정
onMounted(() => {
  if (localStorage.getItem('accessToken')) {
    setLoginState(true);
  }
});

// isLoggedIn 상태를 감시하여 UI 업데이트
watch(isLoggedIn, (newValue) => {
  console.log('로그인 상태 변경:', newValue);
  // 로그인 상태 변경 시 추가적인 로직을 여기에 작성할 수 있습니다.
});
</script>



<template>
  <div class="header_container">
    <div class="header_text_container col">
      <div class="header_item">
        <router-link to="/" class="header_title point">Leafresh</router-link>
      </div>
      <div class="header_item header_profile">프로필 아이콘</div>
      <div class="header_item col">

        <router-link to="/community" class="header_navigator point">커뮤니티</router-link>
        <router-link to="/plant-share" class="header_navigator point">식물분양</router-link>
        <router-link to="/garden-diary" class="header_navigator point">원예일지</router-link>
      </div>
      <div class="header_item">
        <!-- 로그인 상태에 따라 로그인/로그아웃 버튼 표시 -->
        <router-link v-if="!isLoggedIn" to="/login" class="header_menu point">로그인</router-link>
        <button v-else @click="logout" class="header_menu point">로그아웃</button>

        <router-link to="/community" class="header_navigator point"
          >커뮤니티</router-link
        >
        <router-link to="/plant-share" class="header_navigator point"
          >식물분양</router-link
        >
        <router-link to="/garden-diary" class="header_navigator point"
          >원예일지</router-link
        >
      </div>
      <div class="header_item">
        <div class="header_menu point">로그인</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
}
.col {
  flex-direction: column;
}
.row {
  flex-direction: row;
}
.point {
  cursor: pointer;
}

.header_container {
  height: 100dvh;
  width: 320px;
  display: flex;
  justify-content: center;
  background: linear-gradient(0deg, #1ab546, #0b4f1e);
}

.header_text_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header_item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header_title {
  font-family: "ghanachoco";
  font-size: 32px;
  color: #fff;
}

.header_profile {
  font-family: "ghanachoco";
  color: #fff;
}

.header_navigator {
  font-family: "ghanachoco";
  font-size: 18px;
  color: #fff;
  margin: 30px;
}

.header_navigator:hover {
  color: #a68b6a;
}

.router-link-active {
  color: #a68b6a;
}

.header_menu {
  font-family: "ghanachoco";
  font-size: 18px;
  color: #fff;

  background: none;
  border: none;
  cursor: pointer;

}

.header_menu:hover {
  color: #a68b6a;
}
</style>
