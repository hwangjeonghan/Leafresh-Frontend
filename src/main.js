import "bootstrap/dist/css/bootstrap.min.css"; // 부트스트랩 CSS 추가
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 부트스트랩 JavaScript 추가

import "./assets/css/reset.css";
import "./assets/css/leafresh_fonts.css";
import "./assets/css/leafresh_scroll.css";
import "./assets/css/sweetalert2.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // Pinia Persist 플러그인 추가

import App from "./App.vue";
import router from "./router";
import axios from "axios";

const app = createApp(App);

app.config.globalProperties.$axios = axios;

const pinia = createPinia(); // Pinia 인스턴스 생성
pinia.use(piniaPluginPersistedstate); // 플러그인 등록

app.use(ElementPlus);
app.use(pinia); // Pinia 사용
app.use(router); // 라우터 사용

app.mount("#app"); // 애플리케이션 마운트
