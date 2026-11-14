<template>
  <Dialog
    :visible="true"
    modal
    dismissable-mask
    :draggable="false"
    :closable="false"
    class="update-novel-dialog"
    :breakpoints="{ '480px': '94vw' }"
    @update:visible="emit('close')"
  >
    <template #header>
      <div class="dialog-heading">
        <span>Update novel</span>
        <small>Keep your story details fresh and polished.</small>
      </div>
      <button class="dialog-close" type="button" aria-label="Close" @click="emit('close')">
        ×
      </button>
    </template>

    <form class="update-novel-form" @submit.prevent="updateNovelHandler">
      <label for="update-novel-name">Novel name</label>
      <input
        id="update-novel-name"
        v-model="updateNovelName"
        type="text"
        autocomplete="off"
        placeholder="Enter novel name"
        required
        autofocus
      />

      <label for="update-novel-description">Description</label>
      <textarea
        id="update-novel-description"
        v-model="updateNovelDescription"
        rows="5"
        placeholder="Write a short description"
      />

      <button class="update-novel-submit" type="submit" :disabled="loading">
        {{ message }}
      </button>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { useNovels } from '@/composables/useNovels'
import { ref } from 'vue'
import { useToast } from 'primevue'
import Dialog from 'primevue/dialog'

const props = defineProps<{
  novel_id: string
  novel_name: string
  description: string
}>()

const emit = defineEmits<{
  close: []
}>()

const updateNovelName = ref<string>(props.novel_name)
const updateNovelDescription = ref<string>(props.description)

const message = ref('Update')

const toast = useToast()

const { loading, updateNovel } = useNovels()

async function updateNovelHandler() {
  message.value = 'Updating...'

  const { error } = await updateNovel(
    props.novel_id,
    updateNovelName.value,
    updateNovelDescription.value,
  )

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Novel update failed',
      detail: error,
      life: 5000,
    })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Novel updated',
      detail: 'Your novel has been updated.',
      life: 3000,
    })
    emit('close')
  }

  message.value = 'Update'
}
</script>

<style scoped>
.dialog-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dialog-heading span {
  color: #000;
  font-size: 1.25rem;
  font-weight: 700;
}

.dialog-heading small {
  color: #000;
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
  background: #fff;
  color: #000;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.update-novel-form {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.update-novel-form label {
  margin-top: 4px;
  color: #000;
  font-size: 0.82rem;
  font-weight: 700;
}

.update-novel-form input,
.update-novel-form textarea {
  width: 100%;
  border: 1px solid rgba(36, 38, 41, 0.12);
  border-radius: 10px;
  outline: none;
  background: #fff;
  box-shadow: 0 2px 8px rgba(36, 38, 41, 0.06);
  color: #000;
  font: inherit;
  padding: 12px 14px;
  resize: vertical;
}

.update-novel-form input::placeholder,
.update-novel-form textarea::placeholder {
  color: rgba(0, 0, 0, 0.62);
}

.update-novel-form input:focus,
.update-novel-form textarea:focus {
  border-color: rgba(36, 38, 41, 0.38);
  box-shadow: 0 0 0 3px var(--color-glow);
}

.update-novel-submit {
  margin-top: 8px;
  padding: 12px 16px;
  border: 1px solid rgba(36, 38, 41, 0.08);
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(36, 38, 41, 0.16);
  color: #000;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.update-novel-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 12px var(--color-glow),
    0 8px 18px rgba(36, 38, 41, 0.18);
}

.update-novel-submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

:global(.update-novel-dialog.p-dialog) {
  width: min(480px, 92vw);
  border: 1px solid rgba(36, 38, 41, 0.12);
  border-radius: 16px;
  background: #fff;
  color: #000;
  box-shadow:
    0 0 12px var(--color-glow),
    0 18px 44px rgba(36, 38, 41, 0.24);
}

:global(.update-novel-dialog .p-dialog-header) {
  position: relative;
  padding: 20px 22px 8px;
  border: 0;
  background: #fff;
  color: #000;
}

:global(.update-novel-dialog .p-dialog-content) {
  padding: 12px 22px 22px;
  border: 0;
  background: #fff;
  color: #000;
}

@media (max-width: 480px) {
  :global(.update-novel-dialog.p-dialog) {
    margin: 12px;
  }

  :global(.update-novel-dialog .p-dialog-header) {
    padding: 16px 16px 7px;
  }

  :global(.update-novel-dialog .p-dialog-content) {
    padding: 10px 16px 16px;
  }
}
</style>
