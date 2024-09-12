import { createRouter, createWebHistory } from "vue-router";
import Community from "@/views/Community.vue";
import GardenDiary from "@/views/GardenDiary.vue";
import LoginView from "@/views/LoginView.vue"; // 로그인 페이지 import
import SignupView from "@/views/SignupView.vue"; // 회원가입 페이지 import
import MarketAddPost from "@/views/MarketAddPost.vue";
import Market from "@/views/Market.vue";
import FeedAdded from "@/views/FeedAdded.vue"; // 피드 추가 페이지 import
import FeedFix from "@/views/FeedFix.vue";
import MarketDetail from "@/views/MarketDetail.vue";
import FeedDetail from "@/views/FeedDetail.vue";
import Chat from "@/views/Chat.vue";
import MarketEdit from "@/views/MarketEdit.vue";
import ProfileRegistration from "@/views/ProfileRegistration.vue";
import LeafreshInfo from "@/views/LeafreshInfo.vue";
import TermsAgreementView from "@/views/TermsAgreementView.vue";
import DiaryDetail from "@/views/DiaryDetail.vue";
import PlantAddModal from "@/views/PlantAddModal.vue";
import { useUserstore } from "@/stores/users";  // 정확한 경로로 설정

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
      name: "FeedAdded", // 여기서 FeedAdded를 사용하도록 수정
      component: FeedAdded,
    },
    {
      path: "/garden-diary/feed-detail/:username/:id", // 유저 이름 및 피드 ID 포함
      name: "FeedDetail",
      component: FeedDetail,
      props: true,
    },
    {
      path: "/garden-diary/feed-modify/:username/:id",
      name: "FeedFix",
      component: FeedFix,
      props: true,
    },
    {
      path: "/garden-diary/diary-detail/:username/:id", // 유저 이름 및 피드 ID 포함
      name: "DiaryDetail",
      component: DiaryDetail,
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
    },
    {
      path: "/terms",
      name: "TermsAgreement",
      component: TermsAgreementView, // 약관 동의 페이지
      meta: { transition: "fade" },
    },
    {
      path: "/market/addpost",
      name: "MarketAddPost",
      component: MarketAddPost, // 분양 게시글 등록 페이지
    },
    {
      path: "/market/detail/:id",
      name: "MarketDetail",
      component: MarketDetail, // 분양 게시글 조회 페이지
      props: true,
    },
    {
      path: "/market/modify/:id",
      name: "MarketEdit",
      component: MarketEdit, // 분양 게시글 수정 페이지
      props: true,
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
      path: "/plant/add-modal",
      name: "PlantAddModal",
      component: PlantAddModal,
    },
    {
      path: "/leafresh/info",
      name: "LeafreshInfo",
      component: LeafreshInfo,
      meta: { transition: "fade" },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserstore(); // Pinia store에서 user 정보를 가져옴
  const accessToken = localStorage.getItem('accessToken');
  
  // 로그인 필수 경로를 체크함
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !accessToken) {
    next('/login');
  } else if (accessToken) {
    try {
      await userStore.fetchUserProfile(); // 사용자 정보를 다시 불러와 토큰 유효성을 확인
      next();
    } catch (error) {
      console.error('토큰이 유효하지 않아 리다이렉트됩니다.');
      localStorage.removeItem('accessToken'); // 잘못된 토큰 제거
      localStorage.removeItem('refreshToken');
      next('/login'); // 로그인 화면으로 리다이렉트
    }
  } else {
    next();
  }
});


export default router;
