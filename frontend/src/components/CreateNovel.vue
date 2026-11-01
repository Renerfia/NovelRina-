<template>
  <Dialog
    :visible="visible"
    modal
    dismissable-mask
    :draggable="false"
    :closable="false"
    class="create-novel-dialog"
    :breakpoints="{ '480px': '94vw' }"
    @update:visible="emit('close')"
  >
    <template #header>
      <div class="dialog-heading">
        <span>Create a new novel</span>
        <small>Give your story a name and begin its journey.</small>
      </div>
      <button class="dialog-close" type="button" aria-label="Close" @click="emit('close')">
        ×
      </button>
    </template>

    <form class="create-novel-form" @submit.prevent="submit">
      <label for="novel-name">Novel name</label>
      <input
        id="novel-name"
        v-model="newNovel.novel_name"
        type="text"
        autocomplete="off"
        placeholder="Enter novel name"
        required
        autofocus
      />

      <label for="novel-description">Description</label>
      <textarea
        id="novel-description"
        v-model="newNovel.description"
        rows="5"
        placeholder="Write a short description"
      />

      <button class="create-novel-submit" type="submit">Create Novel</button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import Dialog from 'primevue/dialog'

interface Novel {
  novel_name: string
  description: string
}

const props = defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  close: []
  newNovel: [novel: Novel]
}>()

const newNovel = reactive<Novel>({
  novel_name: '',
  description: '',
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible) {
      newNovel.novel_name = ''
      newNovel.description = ''
    }
  },
)

function submit() {
  emit('newNovel', newNovel)
}
</script>

<style scoped>
.dialog-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dialog-heading span {
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 700;
}

.dialog-heading small {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.dialog-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: rgba(255, 250, 250, 0.9);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.create-novel-form {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.create-novel-form label {
  margin-top: 4px;
  color: var(--color-text-primary);
  font-size: 0.82rem;
  font-weight: 700;
}

.create-novel-form input,
.create-novel-form textarea {
  width: 100%;
  border: 1px solid rgba(36, 38, 41, 0.12);
  border-radius: 10px;
  outline: none;
  background: rgba(255, 250, 250, 0.72);
  box-shadow: 0 2px 8px rgba(36, 38, 41, 0.06);
  color: var(--color-text-primary);
  font: inherit;
  padding: 12px 14px;
  resize: vertical;
}

.create-novel-form input::placeholder,
.create-novel-form textarea::placeholder {
  color: var(--color-text-muted);
}

.create-novel-form input:focus,
.create-novel-form textarea:focus {
  border-color: rgba(36, 38, 41, 0.38);
  box-shadow: 0 0 0 3px var(--color-glow);
}

.create-novel-submit {
  margin-top: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(36, 38, 41, 0.08);
  border-radius: 999px;
  background: var(--color-text-primary);
  box-shadow: 0 6px 16px rgba(36, 38, 41, 0.16);
  color: var(--color-snow-white);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.create-novel-submit:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 12px var(--color-glow),
    0 8px 18px rgba(36, 38, 41, 0.18);
}

:deep(.create-novel-dialog.p-dialog) {
  width: min(480px, 92vw);
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 16px;
  background: rgba(212, 214, 217, 0.94);
  box-shadow:
    0 0 12px var(--color-glow),
    0 18px 44px rgba(36, 38, 41, 0.24);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

:deep(.create-novel-dialog .p-dialog-header) {
  position: relative;
  padding: 20px 22px 8px;
  border: 0;
  background: transparent;
}

:deep(.create-novel-dialog .p-dialog-content) {
  padding: 12px 22px 22px;
  border: 0;
  background: transparent;
}

@media (max-width: 480px) {
  :deep(.create-novel-dialog.p-dialog) {
    margin: 12px;
  }

  :deep(.create-novel-dialog .p-dialog-header) {
    padding: 16px 16px 7px;
  }

  :deep(.create-novel-dialog .p-dialog-content) {
    padding: 10px 16px 16px;
  }
}
</style>
