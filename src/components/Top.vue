<script setup lang="ts">
import _ from "lodash";
import { computed, ref, Ref } from "vue";
import { useClientStore } from "@/store/client";
import { usePresentationStore, type Presentation } from "@/store/presentation";
import { useRouter } from "vue-router";
import PresentationNameDialog from "./Top/PresentationNameDialog.vue";
import LoginIcon from "./Top/LoginIcon.vue";
import ToolBar from "./Top/ToolBar.vue";
const presentationStore = usePresentationStore();
const presentations = computed(() => {
  return _.orderBy(presentationStore.presentations, ["id"], ["desc"]).slice(0, 5)
});
const presentation: Ref<Presentation | undefined> = ref();
const clientStore = useClientStore();
const authorized = computed(() => clientStore.authorized);
async function add() {
  presentation.value = { id: null, name: "" } as Presentation;
}
const currentPresentation = computed(() => presentationStore.currentPresentation);
async function edit() {
  presentation.value = currentPresentation.value;
}
const router = useRouter();
async function select(id: number) {
  router.push({ name: "presentation", params: { id: id.toString() } });
}
const name = computed(() => {
  return currentPresentation.value?.name || "PREZ"
});
</script>
<template>
  <div class="top">
    <div class="navigation">
      <div class="left">
        <el-dropdown trigger="click" @command="select">
          <el-button link><span class="label">{{ name }}</span></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="p in presentations" :command="p.id">{{ p.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="right">
        <template v-if="authorized">
          <el-button v-if="currentPresentation" link type="primary" @click="edit">
            <font-awesome-icon icon="pen" link />
          </el-button>
          <el-button @click="add" link type="primary">
            <font-awesome-icon icon="plus" link />
          </el-button>
        </template>
        <login-icon></login-icon>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
    <div class="tool" v-if="authorized">
      <tool-bar></tool-bar>
    </div>
    <presentation-name-dialog v-model="presentation"></presentation-name-dialog>
  </div>
</template>
<style scoped>
.top {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.navigation {
  height: 5rem;
  border-bottom: solid 1px var(--el-border-color);
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  justify-content: space-between;
}

.content {
  flex-grow: 1;
}

.tool {
  flex-shrink: 0;
  height: 2rem;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right button {
  margin: 0;
}

.label {
  font-size: 30pt;
}
</style>