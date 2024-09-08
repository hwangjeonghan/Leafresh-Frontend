import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginState = defineStore("loginState", () => {
  const isLoggedIn = ref(false);
  const username = ref("");
  const imageUrl = ref("");

  const setLoginState = (state) => {
    isLoggedIn.value = state;
  };

  const setUserProfile = (userData) => {
    username.value = userData.username;
    imageUrl.value = userData.imageUrl;
  };

  const clearUserProfile = () => {
    username.value = "";
    imageUrl.value = "";
  };

  return {
    isLoggedIn,
    username,
    imageUrl,
    setLoginState,
    setUserProfile,
    clearUserProfile,
  };
});
