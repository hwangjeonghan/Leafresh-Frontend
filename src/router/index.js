import { createRouter, createWebHistory } from "vue-router";
import Community from "@/views/Community.vue";
import GardenDiary from "@/views/GardenDiary.vue";
import LoginView from "@/views/LoginView.vue"; // 로그인 페이지 import
import SignupView from "@/views/SignupView.vue"; // 회원가입 페이지 import
import MarketAddPost from "@/views/MarketAddPost.vue";
import Market from "@/views/Market.vue";
import FeedAdd from "@/views/FeedAdded.vue"; // 피드 추가 페이지 import
import MarketDetail from "@/views/MarketDetail.vue";
import FeedDetail from "@/views/FeedDetail.vue";
import Chat from "@/views/Chat.vue";
import MarketEdit from "@/views/MarketEdit.vue";
import ProfileRegistration from "@/views/ProfileRegistration.vue";
import LeafreshInfo from "@/views/LeafreshInfo.vue";

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
      path: "/garden-diary/:username", // 유저 이름 경로 포함
      name: "GardenDiary",
      component: GardenDiary,
    },
    {
      path: "/garden-diary/feed-add", // 유저 이름 경로 포함
      name: "FeedAdd",
      component: FeedAdd,
    },
    {
      path: "/garden-diary/feed-detail/:username/:id", // 유저 이름 및 피드 ID 포함
      name: "FeedDetail",
      component: FeedDetail,
      props: true,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView, // 로그인 페이지
      meta: { transition: "fade" },
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignupView, // 회원가입 페이지
      meta: { transition: "fade" },
    },
    {
      path: "/market/addpost",
      name: "Addpost",
      component: MarketAddPost, // 분양 게시글 등록 페이지
    },
    {
      path: "/market/detail/:id",
      name: "MarketPostDetail",
      component: MarketDetail, // 분양 게시글 조회 페이지
    },
    {
      path: "/market/modify/:id",
      name: "MarketEdit",
      component: MarketEdit, // 분양 게시글 수정 페이지
    },
    {
      path: "/chat/:id",
      name: "Chat",
      component: Chat,
      props: true, // 경로 파라미터를 props로 컴포넌트에 전달
    },
    {
      path: "/profile/registration",
      name: "ProfileRegistration",
      component: ProfileRegistration,
    },
    {
      path: "/leafresh/info",
      name: "LeafreshInfo",
      component: LeafreshInfo,
    },
  ],
});

export default router;
