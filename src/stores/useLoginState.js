// useLoginState.js
import { ref, watch } from 'vue';

export const isLoggedIn = ref(false);

// 로그인 상태를 설정하는 함수
export const setLoginState = (state) => {
  isLoggedIn.value = state;
};

// isLoggedIn 상태를 감시하여 상태 변화 시 로직 실행
watch(isLoggedIn, (newValue, oldValue) => {
  console.log('로그인 상태 변경:', oldValue, '->', newValue);
  // 상태 변경에 따른 추가 로직을 여기에 작성
  // 예: 상태 변경에 따라 다른 데이터를 가져오거나 리다이렉트 수행
});
