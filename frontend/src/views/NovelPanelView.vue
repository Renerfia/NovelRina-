<template>
  <main class="novel-panel-page">
    <BubbleToolMenu
      :novel-id="novel?.novel_id ?? null"
      @show-chat-panel="showChatPanel = true"
    />

    <button
      class="novel-back-button"
      type="button"
      aria-label="Back to novels"
      title="Back to novels"
      @click="backToNovels"
    >
      <ArrowLeft :stroke-width="2" />
    </button>

    <p v-if="novelLoading || chapterLoading">Loading...</p>

    <p v-else-if="novelError || chapterError">
      {{ novelError || chapterError }}
    </p>

    <div v-else class="novel-panel-layout">
      <ListChapterSideBar
        :chapters="chapters"
        :novel="novel"
        @selected_chapter="selected_chapter = $event"
      />

      <!-- Editor Panel -->
      <section class="chapter-editor-panel">
        <ChatPanel
          v-if="showChatPanel"
          :authorId="user?.id ?? null"
          :novelId="novel?.novel_id ?? null"
          @close="showChatPanel = false"
        />
        <SummarizationPanel :chapter="selected_chapter" />
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import ListChapterSideBar from '@/components/ListChapterSideBar.vue'
import { useNovels } from '@/composables/useNovels'
import { useChapter } from '@/composables/useChapter'
import type { Novel } from '@/composables/useNovels'
import SummarizationPanel from '@/components/SummarizationPanel.vue'
import type { Chapter } from '@/composables/useChapter'
import ChatPanel from '@/components/ChatPanel.vue'
import BubbleToolMenu from '@/components/BubbleToolMenu.vue'
import { useAuth } from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()
const novel = ref<Novel | null>(null)
const novelLoading = ref(false)
const novelError = ref<string | null>(null)
const selected_chapter = ref<Chapter | null>(null)
const showChatPanel = ref<boolean>(false)

const { user } = useAuth()
const { fetchNovel } = useNovels()
const { chapters, loading: chapterLoading, error: chapterError, fetchChapters } = useChapter()

function backToNovels() {
  void router.push({ name: 'novels' })
}

watch(
  () => route.params.id,
  async (novelId) => {
    if (typeof novelId !== 'string') return

    selected_chapter.value = null
    novelLoading.value = true
    const novelResult = await fetchNovel(novelId) //feteches the selected novel details
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
.novel-panel-page {
  position: relative;
  min-height: 100vh;
  padding: 20px;
  color: #f4efe6;
  background:
    radial-gradient(circle at 18% 12%, rgba(173, 132, 92, 0.14), transparent 28%),
    radial-gradient(circle at 82% 78%, rgba(91, 61, 42, 0.12), transparent 30%),
    linear-gradient(145deg, #171513 0%, #11100f 48%, #090909 100%);
}

.novel-back-button {
  position: absolute;
  z-index: 10;
  top: 30px;
  left: 230px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 244, 224, 0.24);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.09);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  cursor: pointer;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.novel-back-button svg {
  width: 20px;
  height: 20px;
}

.novel-back-button:hover {
  border-color: rgba(255, 244, 224, 0.42);
  background: rgba(255, 255, 255, 0.16);
  transform: translateX(-2px);
}

.novel-panel-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 40px);
  overflow: hidden;
  border: 1px solid rgba(214, 192, 160, 0.18);
  border-radius: 18px;
  background: rgba(20, 18, 16, 0.36);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 244, 224, 0.04);
}

.chapter-editor-panel {
  display: grid;
  place-items: center;
  padding: 20px;
  border-left: 1px solid rgba(214, 192, 160, 0.12);
  background: linear-gradient(145deg, rgba(31, 27, 23, 0.48), rgba(12, 12, 12, 0.62));
}


@media (max-width: 760px) {
  .novel-back-button {
    top: 22px;
    left: 170px;
    width: 40px;
    height: 40px;
  }

  .novel-panel-layout {
    grid-template-columns: 220px 1fr;
  }
}
</style>
