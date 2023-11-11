<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { watch, Ref, ref, computed } from 'vue';
import { usePresentationStore } from './store/presentation';
const { isLoading } = useAuth0();
const initialized: Ref<boolean> = ref(false);
const presentationStore = usePresentationStore();
watch(isLoading, async (value) => {
  if (!value) {
    await presentationStore.fetch();
    initialized.value = true;
  }
});

const mousePosition = ref({ x: 0, y: 0 });
const cursor = computed(() => presentationStore.cursor);
function move(e: MouseEvent) {
  if (!cursor.value) {
    return;
  }
  mousePosition.value = {
    x: e.clientX,
    y: e.clientY
  };
}
const cursorStyle = computed(() => {
  return {
    left: `${mousePosition.value.x}px`,
    top: `${mousePosition.value.y}px`
  }
});

</script>

<template>
  <div class="app" v-if="initialized" @mousemove="move" :class="{ cursor }">
    <router-view />
    <div class="arrow" v-if="cursor" :style="cursorStyle">
      <font-awesome-icon :icon="['fas', 'arrow-pointer']" />
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
}

.app.cursor {
  cursor: none;
}

.arrow {
  position: fixed;
  font-size: 40pt;
  pointer-events: none;
  z-index: 1000;
}
</style>
