import { createRouter, createWebHistory } from "vue-router";
import Community from "@/views/Community.vue";
import PlantShare from "@/views/PlantShare.vue";
import GardenDiary from "@/views/GardenDiary.vue";
import LoginView from "@/views/LoginView.vue"; // 로그인 페이지 import
import SignupView from "@/views/SignupView.vue"; // 회원가입 페이지 import

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/community", // 기본 경로를 커뮤니티 페이지로 리다이렉트
    },
    {
      path: "/community",
      name: "Community",
      component: Community, // 커뮤니티 페이지
    },
    {
      path: "/plant-share",
      name: "PlantShare",
      component: PlantShare, // 식물분양 페이지
    },
    {
      path: "/garden-diary",
      name: "GardenDiary",
      component: GardenDiary, // 원예일지 페이지
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView, // 로그인 페이지
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignupView, // 회원가입 페이지
    },
  ],
});

export default router;
