import { createAuth0 } from "@auth0/auth0-vue";
import { createApp } from "vue";
import { createPinia } from "pinia";

import "./style.css";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

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