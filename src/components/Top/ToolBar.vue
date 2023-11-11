<script setup lang="ts">
import dayjs from "dayjs";
import { ref, computed } from "vue";
import { usePresentationStore } from "@/store/presentation";
import { useRoute } from "vue-router";

const route = useRoute();
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
</script>
<template>
  <div class="tool-bar">
    <div class="left">
      <div class="pages">
        {{ page }} / {{ total }}
      </div>
      <div class="buttons">
        <el-button :type="cursor ? 'danger' : 'primary'" link @click="toggleCursor">
          <font-awesome-icon :icon="['fas', 'arrow-pointer']" />
        </el-button>
        <el-button :type="editing ? 'danger' : 'primary'" link @click="toggleEditing()">
          <font-awesome-icon :icon="['fas', 'pen-to-square']" />
        </el-button>
        <el-button type="primary" link>
          <font-awesome-icon :icon="['fas', 'expand']" @click="toggleFullscreen()" />
        </el-button>
        <el-button type="primary" link @click="removePage()">
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