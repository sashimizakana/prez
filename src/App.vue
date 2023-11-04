<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios';
const { loginWithRedirect, user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
function login() {
  loginWithRedirect({
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE
    }
  });
}
async function check() {
  const token = await getAccessTokenSilently({
    cacheMode: "on",
    authorizationParams: {
      audience: import.meta.env.VITE_AUTH0_AUDIENCE
    }
  });
  const response = await axios.get('/api/auth', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
</script>

<template>
  <div class="app">
    {{ isLoading }}
    <div v-if="isAuthenticated">
      {{ user }}
      <button @click="check">Check</button>
    </div>
    <button v-else @click="login">Login</button>
  </div>
</template>

<style scoped></style>
