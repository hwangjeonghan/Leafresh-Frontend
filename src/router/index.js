import { createRouter, createWebHistory } from "vue-router";
import Community from "@/views/Community.vue";
import GardenDiary from "@/views/GardenDiary.vue";
import LoginView from "@/views/LoginView.vue"; // 로그인 페이지 import
import SignupView from "@/views/SignupView.vue"; // 회원가입 페이지 import
import MarketAddPost from "@/views/MarketAddPost.vue";
import Market from "@/views/Market.vue";
import FeedAdd from "@/views/FeedAdded.vue"; // 피드 추가 페이지 import
import MarketDetail from "@/views/MarketDetail.vue";
import Chat from '@/views/chat.vue';

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
      path: "/market",
      name: "Market",
      component: Market, // 식물분양 페이지
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
    {
      path: "/market/addpost",
      name: "Addpost",
      component: MarketAddPost, // 분양 게시글 등록 페이지
    },
    {
      path: "/garden-diary/feed-add",
      name: "FeedAdd",
      component: FeedAdd, // 피드 추가 페이지
    },
    {
      path: "/market/detail/:id",
      name: "MarketPostDetail",
      component: MarketDetail, // 분양 게시글 조회 페이지
    },
    {
      path: '/chat/:id',
      name: 'Chat',
      component: Chat,
      props: true, // 경로 파라미터를 props로 컴포넌트에 전달
    },
  ],
});

export default router;
