<script setup lang="ts">
import { ref, Ref, computed, watch } from "vue";
import { usePresentationStore, Presentation } from "@/store/presentation";
import { ElMessage } from "element-plus";
export interface Props {
  modelValue?: Presentation;
}
const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);
const isNew = computed(() => !props.modelValue?.id);
const dialogVisible = computed({
  get() {
    return !!props.modelValue
  },
  set(value) {
    if (!value) {
      emits("update:modelValue", null);
    }
  }
});
const name: Ref<string> = ref("");
const presentationStore = usePresentationStore();
async function save() {
  if (isNew.value) {
    await presentationStore.create({ id: null, name: name.value, data: {} });
  } else {
    await presentationStore.save({ id: props.modelValue!.id, name: name.value }, true);
  }
  ElMessage("Saved");
  dialogVisible.value = false;
}
watch(dialogVisible, (value) => {
  if (value) {
    name.value = props.modelValue?.name || "";
  }
});
</script>
<template>
  <el-dialog v-model="dialogVisible" title="Presentation" width="30%" draggable>
    <el-input placeholder="Name" v-model="name"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="save">
          Save
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
