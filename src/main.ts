import { createAuth0 } from "@auth0/auth0-vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

library.add(fas, fab, far);

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "./style.css";

const pinia = createPinia();
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  })
);

app.mount("#app");
