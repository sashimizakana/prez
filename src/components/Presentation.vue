<script setup lang="ts">
import _ from "lodash";
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePresentationStore } from "@/store/presentation";
import Tiptap from "./Presentation/Tiptap.vue";
const presentationStore = usePresentationStore();
const route = useRoute();
const router = useRouter();
const page = computed(() => route.query.page ? parseInt(route.query.page as string, 10) : 0);
const presentation = computed(() => presentationStore.currentPresentation);

const debounceUpdate = _.debounce(async (data: any) => {
  await presentationStore.update(data);
}, 1000, { maxWait: 5000 });

const content = computed({
  get() {
    const contents = presentation.value?.data?.contents;
    return contents ? contents[page.value] : "";
  },
  set(value) {
    const data = presentation.value?.data || {};
    const contents = data.contents || [];
    contents[page.value] = value;
    presentationStore.setData({
      ...data,
      contents
    });
    debounceUpdate(data)
  }
});

const currentId = computed(() => route.params.id);
watch(currentId, (now, prev) => {
  debounceUpdate.flush();
  if (now != prev) {
    presentationStore.setCurrentId(now ? parseInt(now as string, 10) : null);
  }
}, {
  immediate: true
});

const pageId = computed(() => route.query.page);
watch(pageId, () => {
  debounceUpdate.flush();
});

const editing = computed(() => presentationStore.editing);
watch(content, (value) => {
  if (!value) {
    presentationStore.setEditing(true);
  }
});

type Shortcuts = {
  [K in string]?: () => void;
};
const shortcuts: Shortcuts = {
  "e": () => presentationStore.setEditing(!editing.value),
  "Delete": () => presentationStore.removePage(page.value),
  "ArrowLeft": () => {
    if (page.value > 0) {
      const query = {
        ...route.query,
        page: (page.value - 1).toString()
      };
      router.push({ query });
    }
  },
  "ArrowRight": () => {
    const query = {
      ...route.query,
      page: (page.value + 1).toString()
    };
    router.push({ query });
  }
}

function keydown(e: KeyboardEvent) {
  if (e.ctrlKey) {
    const shortcut = shortcuts[e.key];
    if (shortcut) {
      shortcut();
      e.preventDefault();
    }
  }
}

const fullscreen = computed(() => presentationStore.fullscreen);
watch(fullscreen, (value) => {
  if (value) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

</script>
<template>
  <div class="presentation" ref="el">
    <Tiptap v-model="content" :editable="editing" @keydown="keydown"></Tiptap>
  </div>
</template>

<style scoped>
.presentation {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>