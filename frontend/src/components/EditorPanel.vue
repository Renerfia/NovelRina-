<template>
  <section class="editor-panel">
    <header class="editor-header">
      <div class="chapter-details">
        <h1 class="chapter-name">
          {{ props.selected_chapter?.chapter_name ?? 'No chapter selected' }}
        </h1>
        <small>Word count: {{ length }}</small>
      </div>
      <button
        class="save-button"
        type="button"
        aria-label="Save chapter"
        title="Save chapter"
        :disabled="!props.selected_chapter"
        @click="saveChapter"
      >
        <Save :size="18" aria-hidden="true" />
      </button>
    </header>

    <textarea
      v-model="texts"
      class="writing-area"
      name="writing-area"
      aria-label="Chapter content"
      placeholder="Start from here..."
      :disabled="!props.selected_chapter"
    />
  </section>
</template>

<script setup lang="ts">
import type { Chapter } from '@/composables/useChapter'
import { ref, computed, watch } from 'vue'
import { Save } from 'lucide-vue-next'

const props = defineProps<{ selected_chapter: Chapter | null }>()
const emit = defineEmits<{
  (event: 'update-chapter', chapter: Chapter): void
}>()

const texts = ref(props.selected_chapter?.chapter_content ?? '')
const length = computed(() => texts.value.length)

watch(
  () => props.selected_chapter,
  (chapter) => {
    texts.value = chapter?.chapter_content ?? ''
  },
)

function saveChapter() {
  const chapter = props.selected_chapter
  if (!chapter) return

  emit('update-chapter', { ...chapter, chapter_content: texts.value })
}
</script>

<style scoped>
.editor-panel {
  width: 100%;
  min-height: min(620px, calc(100vh - 80px));
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  padding: 18px;
  background: rgba(18, 17, 15, 0.94);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
}

.editor-header {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.chapter-details {
  min-width: 0;
}

.chapter-name {
  margin: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-reading);
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
}

.save-button {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  color: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 23%, rgba(255, 255, 255, 0.48), transparent 42%),
    rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.24),
    inset 0 1px 5px rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.save-button:not(:disabled):hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.9);
  background-color: rgba(255, 255, 255, 0.22);
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.save-button:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 3px;
}

.writing-area {
  width: 100%;
  min-height: 480px;
  resize: none;
  box-sizing: border-box;
  padding: 20px;
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  outline: none;
  background: rgba(255, 255, 255, 0.06);
  font-family: var(--font-reading);
  font-size: 1rem;
  line-height: 1.75;
}

.writing-area::placeholder {
  color: rgba(255, 255, 255, 0.45);
}

.writing-area:focus {
  border-color: rgba(255, 255, 255, 0.42);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
}

.writing-area:disabled {
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .editor-panel {
    min-height: calc(100vh - 120px);
    padding: 12px;
  }

  .writing-area {
    min-height: 400px;
    padding: 16px;
  }
}
</style>
