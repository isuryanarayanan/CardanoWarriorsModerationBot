import { createApp } from "vue";
import App from "./App.vue";

import store from "./store/index";
import router from "./router/index";

import "./styles/main.scss";
import "vue-material-design-icons/styles.css";

createApp(App).use(router).use(store).mount("#app");
