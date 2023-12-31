<script setup lang="ts">
import dayjs from "dayjs";
import { ref, computed } from "vue";
import { usePresentationStore } from "@/store/presentation";
import { useRoute, useRouter } from "vue-router";
import { useClientStore } from "@/store/client";

const route = useRoute();
const router = useRouter();
const presentationStore = usePresentationStore();
const now = ref(dayjs());
const date = computed(() => now.value.format("YYYY年MM月DD日(ddd) HH:mm:ss"));
setInterval(() => {
  now.value = dayjs();
}, 1000);
const editing = computed(() => presentationStore.editing);
const total = computed(() => presentationStore.currentPages || 1);
const cursor = computed(() => presentationStore.cursor);
const page = computed(() => parseInt(route.query.page as string || "0", 10) + 1)
function removePage() {
  presentationStore.removePage(page.value - 1);
}
function toggleCursor() {
  presentationStore.setCursor(!cursor.value);
}
function toggleFullscreen() {
  presentationStore.setFullscreen(!presentationStore.fullscreen);
}
function toggleEditing() {
  presentationStore.setEditing(!editing.value);
}
const currentPresentation = computed(() => presentationStore.currentPresentation);
const clientStore = useClientStore();
const authorized = computed(() => clientStore.authorized);
function move(offset: number) {
  router.push({
    query: {
      page: page.value + offset - 1
    }
  });
}
</script>
<template>
  <div class="tool-bar" v-if="currentPresentation">
    <div class="left">
      <div class="pages">
        {{ page }} / {{ total }}
      </div>
      <div class="buttons">
        <el-button type="primary" link @click="move(-1)" :disabled="page === 1">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </el-button>
        <el-button type="primary" link @click="move(1)" :disabled="page === total">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </el-button>
        <el-button :type="cursor ? 'danger' : 'primary'" link @click="toggleCursor">
          <font-awesome-icon :icon="['fas', 'arrow-pointer']" />
        </el-button>
        <el-button :type="editing ? 'danger' : 'primary'" link @click="toggleEditing()" v-if="authorized">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
        </el-button>
        <el-button type="primary" link>
          <font-awesome-icon :icon="['fas', 'expand']" @click="toggleFullscreen()" />
        </el-button>
        <el-button type="primary" link @click="removePage()" v-if="authorized">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </el-button>
      </div>
    </div>
    <div class="date">
      {{ date }}
    </div>
  </div>
</template>
<style scoped>
.tool-bar {
  height: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  background-color: var(--el-color-primary-light-8);
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.buttons .el-button {
  margin: 0;
  font-size: 14pt;
}
</style>