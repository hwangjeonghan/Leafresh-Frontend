import "bootstrap/dist/css/bootstrap.min.css";  // 부트스트랩 CSS 추가
import "bootstrap/dist/js/bootstrap.bundle.min.js";  // 부트스트랩 JavaScript 추가

import "./assets/css/reset.css";
import "./assets/css/leafresh_fonts.css";
import "./assets/css/leafresh_scroll.css"
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import axios from "axios";

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(createPinia());
app.use(router);

app.mount("#app");
