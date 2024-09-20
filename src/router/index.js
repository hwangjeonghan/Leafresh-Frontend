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
      path: "/garden-diary/:userNickname", // 유저 이름 경로 포함
      name: "GardenDiary",
      component: GardenDiary,
      props: true // username을 prop으로 전달
    },
    {
      path: "/garden-diary/feed-add", // 유저 이름 경로 포함
      name: "FeedAdded", // 여기서 FeedAdded를 사용하도록 수정
      component: FeedAdded,
    },
    {
      path: "/garden-diary/feed-detail/:userNickname/:id", // 유저 이름 및 피드 ID 포함
      name: "FeedDetail",
      component: FeedDetail,
      props: true,
    },
    {
      path: "/garden-diary/feed-modify/:userNickname/:id",
      name: "FeedFix",
      component: FeedFix,
      props: true,
    },
    {
      path: "/garden-diary/diary-detail/:userNickname/:id", // 유저 이름 및 피드 ID 포함
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
      meta: { requiresAuth: false } // 인증 필요 없음
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

router.beforeEach((to, from, next) => {
  const userStore = useUserstore(); 
  const accessToken = localStorage.getItem('accessToken');
  
  if (to.name === 'Signup' || to.name === 'TermsAgreement') {
    next(); // 회원가입 및 약관 페이지는 토큰 확인 없이 진행
  } else {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !accessToken) {
      next('/login');
    } else if (accessToken) {
      userStore.fetchUserProfile()
        .then(() => next())
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          next('/login');
        });
    } else {
      next();
    }
  }
});



export default router;
