<template>
  <div v-if="chapter" class="summarization-panel">
    <header class="panel-header">
      <h2>AI summary of the chapter</h2>
      <button class="summarize-chapter" type="button" :disabled="loading" @click="summarizeChapter">
        {{ loading ? 'Summarizing...' : 'Summarize' }}
      </button>
    </header>

    <article class="ai-summarization">
      <h1>{{ chapter.chapter_name }}</h1>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-else-if="summary">{{ summary }}</p>
      <p v-else>No summary yet. Select Summarize to generate one.</p>
    </article>
  </div>

  <p v-else class="empty-message">Chapter Summary Not Found</p>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Chapter } from '@/composables/useChapter'
import { useChapter } from '@/composables/useChapter'
import { useAiScan } from '@/composables/useAiScan'
import { useToast } from 'primevue'

const { loading, getChapterSummary } = useAiScan()
const { updateChapterSummary } = useChapter()
const props = defineProps<{
  chapter: Chapter | null
}>()
const summary = ref('')
const error = ref<string | null>(null)
const toast = useToast()

watch(
  () => [props.chapter?.chapter_id, props.chapter?.chapter_content_summary] as const,
  ([, chapterSummary]) => {
    summary.value = chapterSummary ?? ''
    error.value = null
  },
  { immediate: true },
)

async function summarizeChapter() {
  if (!props.chapter) return

  error.value = null
  try {
    const generatedSummary = await getChapterSummary(props.chapter.chapter_content)
    const result = await updateChapterSummary(props.chapter.chapter_id, generatedSummary)
    if (result.error) {
      throw new Error(result.error)
    }
    summary.value = generatedSummary
    toast.add({
      severity: 'success',
      summary: 'Summary generated',
      detail: 'Chapter summary is ready.',
      life: 3000,
    })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'Failed to summarize this chapter.'
    toast.add({
      severity: 'error',
      summary: 'Summary failed',
      detail: error.value,
      life: 5000,
    })
  }
}
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
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
  min-width: 0;
  margin: 0;
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--font-ui);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.summarize-chapter {
  flex: 0 0 auto;
  margin-left: auto;
  padding: 10px 18px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  background:
    radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.5), transparent 42%),
    rgba(255, 255, 255, 0.2);
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.18),
    0 0 16px rgba(255, 255, 255, 0.12),
    inset 0 1px 5px rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.summarize-chapter:not(:disabled):hover {
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 9px 22px rgba(0, 0, 0, 0.22),
    0 0 20px rgba(255, 255, 255, 0.2),
    inset 0 1px 5px rgba(255, 255, 255, 0.52);
}

.summarize-chapter:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
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

.error-message {
  color: #ffb4ab;
}

.summarize-chapter:disabled {
  cursor: wait;
  opacity: 0.65;
}

@media (max-width: 480px) {
  .panel-header {
    gap: 10px;
    padding: 0 14px;
  }

  .panel-header h2 {
    font-size: 0.9rem;
  }

  .summarize-chapter {
    padding: 9px 12px;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .summarize-chapter {
    transition: none;
  }
}
</style>
