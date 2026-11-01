<template>
  <aside class="chapter-sidebar">
    <header class="sidebar-header">
      <h2>{{ novel?.novel_name || 'Novel' }}</h2>
      <p class="novel-description">
        {{ novel?.description || 'No description available.' }}
      </p>
    </header>

    <p v-if="chapters.length === 0" class="empty-message">No chapters found.</p>

    <ul v-else class="chapter-list">
      <li v-for="chapter in chapters" :key="chapter.chapter_id">
        <button class="chapter-button" type="button">
          {{ chapter.chapter_name }}
        </button>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { Chapter } from '@/composables/useChapter'
import type { Novel } from '@/composables/useNovels'

defineProps<{
  chapters: Chapter[]
  novel: Novel | null
}>()
</script>

<style scoped>
.sidebar-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.novel-description {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.72);
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
}

.chapter-sidebar {
  padding: 20px;
  color: #ffffff;
  border-right: 1px solid rgba(255, 255, 255, 0.52);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset -12px 0 28px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.chapter-sidebar h2 {
  margin-bottom: 18px;
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
}

.chapter-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chapter-button {
  width: 100%;
  padding: 10px 12px;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.chapter-button:hover {
  border-color: rgba(255, 255, 255, 0.58);
  background: rgba(255, 255, 255, 0.18);
}

.empty-message {
  color: rgba(255, 255, 255, 0.78);
}
</style>
