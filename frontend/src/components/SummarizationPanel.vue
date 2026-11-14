<template>
  <div v-if="chapter" class="summarization-panel">
    <header class="panel-header">
      <h2>AI summary of the chapter</h2>
      <div class="ai-scan">
        <button
          class="summarize-chapter"
          type="button"
          :disabled="loading"
          @click="summarizeChapter"
        >
          <span class="embed-chapter__step" aria-hidden="true">1</span>
          {{ loading ? 'Summarizing...' : 'Summarize' }}
        </button>
        <span class="ai-scan-next" aria-label="After summarizing, create an embedding">
          <span class="ai-scan-next__arrow" aria-hidden="true">→</span>
          <span>Then embed</span>
        </span>
        <button class="embed-chapter" type="button" :disabled="loading" @click="embedChapter">
          <span class="embed-chapter__step" aria-hidden="true">2</span>
          {{ loading ? 'Embedding...' : 'Embed summary' }}
        </button>
      </div>
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

const { loading, getChapterSummary, getSummaryEmbedding } = useAiScan()
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
    const generatedSummary = await getChapterSummary(props.chapter.chapter_content) //ai call

    //saving the updated summary to the db
    const result = await updateChapterSummary(props.chapter.chapter_id, generatedSummary)
    if (result.error) {
      throw new Error(result.error)
    }

    toast.add({
      severity: 'success',
      summary: 'Summary generated',
      detail: 'Chapter summary is ready.',
      life: 3000,
    })

    toast.add({
      severity: 'success',
      summary: 'Summary has been saved.',
      life: 3000,
    })

    //now the panel will show the latest summary
    summary.value = generatedSummary
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

async function embedChapter() {
  const chapter = props.chapter
  if (!chapter) return

  error.value = null
  const chapterSummary = chapter.chapter_content_summary?.trim()
  if (!chapterSummary) {
    error.value = 'Generate and save the chapter summary before embedding it.'
    toast.add({
      severity: 'error',
      summary: 'Embedding failed',
      detail: error.value,
      life: 5000,
    })
    return
  }

  try {
    await getSummaryEmbedding(chapter.chapter_id, chapterSummary)
    toast.add({
      severity: 'success',
      summary: 'Embedding saved',
      detail: 'The chapter summary embedding is ready.',
      life: 3000,
    })
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'Failed to embed this chapter summary.'
    toast.add({
      severity: 'error',
      summary: 'Embedding failed',
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

.ai-scan {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 7px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
}

.summarize-chapter,
.embed-chapter {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px 10px 10px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  color: #242629;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.summarize-chapter:not(:disabled):hover,
.embed-chapter:not(:disabled):hover {
  transform: translateY(-2px);
  background: #fff;
  box-shadow:
    0 9px 22px rgba(0, 0, 0, 0.22),
    0 0 18px rgba(255, 255, 255, 0.18);
}

.summarize-chapter:focus-visible,
.embed-chapter:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.ai-scan-next {
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.ai-scan-next__arrow {
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.1rem;
  line-height: 1;
}

.embed-chapter__step {
  display: grid;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 50%;
  background: rgba(36, 38, 41, 0.1);
  font-size: 0.74rem;
}

.summarize-chapter:disabled,
.embed-chapter:disabled {
  cursor: wait;
  opacity: 0.65;
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
    flex-wrap: wrap;
    padding: 10px 14px;
  }

  .ai-scan {
    width: 100%;
    justify-content: center;
    gap: 8px;
    padding: 6px;
  }

  .panel-header h2 {
    font-size: 0.9rem;
  }

  .summarize-chapter,
  .embed-chapter {
    padding: 9px 12px;
    font-size: 0.8rem;
  }

  .ai-scan-next {
    font-size: 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .summarize-chapter,
  .embed-chapter {
    transition: none;
  }
}
</style>
