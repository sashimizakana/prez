<script setup lang="ts">
import { watch } from "vue";
import { useClientStore } from "@/store/client";
import { useAuth0 } from '@auth0/auth0-vue';
const { isAuthenticated, loginWithRedirect, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
const clientStore = useClientStore();
console.log(import.meta.env.VITE_AUTH0_AUDIENCE);
async function login() {
  loginWithRedirect({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin
    }
  });
}
async function getToken() {
  let token;
  try {
    token = await getAccessTokenSilently({
      cacheMode: "on",
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }
    });
  }
  catch (err) {
    console.error(err);
    token = await getAccessTokenWithPopup({
      cacheMode: "on",
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }
    });
  }
  if (!token) {
    throw new Error("Failed to get token");
  }
  clientStore.setToken(token);
}
watch(isAuthenticated, async (value) => {
  if (value) {
    await getToken();
  }
}, {
  immediate: true
});
</script>
<template>
  <el-button v-if="!isAuthenticated" link @click="login" type="primary" class="login">
    &nbsp;
  </el-button>
</template>
<style scoped>
.login {
  width: 120px;
}
</style>