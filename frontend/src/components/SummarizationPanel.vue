<template>
  <div v-if="chapter" class="summarization-panel">
    <header class="panel-header">
      <h2>AI summary of the chapter</h2>
    </header>

    <article class="ai-summarization">
      <h1>{{ chapter.chapter_name }}</h1>
      <p>{{ chapter.chapter_content }}</p>
    </article>
  </div>

  <p v-else class="empty-message">Select a chapter to view its summary.</p>
</template>

<script setup lang="ts">
import type { Chapter } from '@/composables/useChapter'
defineProps<{
  chapter: Chapter | null
}>()
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  min-height: 64px;
  margin-bottom: 12px;
  padding: 0 22px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.panel-header h2 {
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.ai-summarization {
  min-height: 180px;
  padding: 22px;
  overflow-wrap: anywhere;
  color: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.07));
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(22px) saturate(130%);
  -webkit-backdrop-filter: blur(22px) saturate(130%);
}

.ai-summarization h1 {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
}

.ai-summarization p {
  margin: 0;
  line-height: 1.75;
  white-space: pre-wrap;
}

.empty-message {
  color: rgba(255, 255, 255, 0.78);
}
</style>
