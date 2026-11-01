<template>
  <main class="novel-details-page">
    <p v-if="novelLoading || chapterLoading">Loading...</p>

    <p v-else-if="novelError || chapterError">
      {{ novelError || chapterError }}
    </p>

    <div v-else class="novel-details-layout">
      <ListChapterSideBar :chapters="chapters" :novel="novel" />

      <section class="chapter-content">
        <p>Select a chapter from the list.</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ListChapterSideBar from '@/components/ListChapterSideBar.vue'
import { useNovels } from '@/composables/useNovels'
import { useChapter } from '@/composables/useChapter'
import type { Novel } from '@/composables/useNovels'

const route = useRoute()
const novel = ref<Novel | null>(null)
const novelLoading = ref(false)
const novelError = ref<string | null>(null)

const { fetchNovel } = useNovels()
const { chapters, loading: chapterLoading, error: chapterError, fetchChapters } = useChapter()

watch(
  () => route.params.id,
  async (novelId) => {
    if (typeof novelId !== 'string') return

    novelLoading.value = true
    const novelResult = await fetchNovel(novelId)
    novelLoading.value = false

    if (novelResult.data) {
      novel.value = novelResult.data
      novelError.value = null
    } else {
      novel.value = null
      novelError.value = novelResult.error
    }

    await fetchChapters(novelId)
  },
  { immediate: true },
)
</script>

<style scoped>
.novel-details-page {
  min-height: 100vh;
  padding: 20px;
  color: var(--color-text-primary);
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.16), transparent 22%),
    linear-gradient(145deg, #242424 0%, #141414 35%, #090909 65%, #000000 100%);
}

.novel-details-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 40px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 18px;
  background: transparent;
  box-shadow: 0 18px 38px rgba(36, 38, 41, 0.12);
}

.chapter-content {
  display: grid;
  place-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.08);
}

@media (max-width: 760px) {
  .novel-details-layout {
    grid-template-columns: 220px 1fr;
  }
}
</style>
