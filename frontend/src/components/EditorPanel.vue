<template>
  <section class="editor-panel">
    <header class="editor-header">
      <h1 class="chapter-name">{{ selected_chapter.chapter_name }}</h1>
      <small>Word count:{{ length }}</small>
    </header>

    <textarea
      v-model="texts"
      class="writing-area"
      name="writing-area"
      aria-label="Chapter content"
      placeholder="Start from here..."
    />
  </section>
</template>

<script setup lang="ts">
import type { Chapter } from '@/composables/useChapter'
import { ref, computed } from 'vue'

//parent have to give it the selected chapter.
const selected_chapter = defineProps<Chapter>()

const texts = ref(selected_chapter.chapter_content)
const length = computed(() => texts.value.length)
</script>

<style scoped>
.editor-panel {
  width: min(720px, 100%);
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
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.chapter-name {
  margin: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-reading);
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 600;
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
