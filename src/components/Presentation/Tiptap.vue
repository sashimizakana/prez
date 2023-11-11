<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = withDefaults(
  defineProps<{
    modelValue?: string,
    editable?: boolean,
  }>(),
  {
    editable: false,
  }
);

const emits = defineEmits<{
  "update:modelValue": [value: string],
  "keydown": [e: KeyboardEvent]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
  ],
  onUpdate({ editor }) {
    let html = editor.getHTML();
    html = html === "<p></p>" ? "" : html;
    if (html === props.modelValue) {
      return;
    }
    emits("update:modelValue", html)
  },
});

function keydown(e: KeyboardEvent) {
  emits("keydown", e);
}
onMounted(() => {
  editor.value!.commands.setContent(props.modelValue || "", false);
  editor.value!.setEditable(props.editable);
})
const editable = computed(() => props.editable);
watch(editable, (v) => {
  editor.value!.setEditable(v);
});
const modelValue = computed(() => props.modelValue);
watch(modelValue, (v) => {
  const isSame = editor.value!.getHTML() === v;
  if (isSame) {
    return;
  }
  editor.value!.commands.setContent(v || "", false);
});
</script>

<template>
  <editor-content :editor="editor" class="editor" @keydown="keydown" />
</template>

<style scoped>
.editor {
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
</style>

<style>
.ProseMirror {
  height: 100%;
  outline: none;
  font-size: 20pt;
  line-height: 1;
}

.ProseMirror *:first-child {
  margin-top: 0;
}
</style>