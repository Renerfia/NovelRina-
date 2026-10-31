<template>
  <div class="novels-page">
    <header class="novels-header">
      <TopBar />
    </header>

    <main class="novels-main">
      <div class="novels-heading">
        <p>Your library</p>
        <h2>Novels</h2>
      </div>

      <button class="create" type="button" @click="showCreateDialog = true">Create Novel</button>

      <CreateNovel
        :visible="showCreateDialog"
        @close="showCreateDialog = false"
        @new-novel="handleCreateNovel"
      />

      <p v-if="loading" class="novels-status">Loading novels…</p>
      <p v-else-if="error" class="novels-status novels-status--error">{{ error }}</p>
      <p v-else-if="novels.length === 0" class="novels-status">No novels found yet.</p>
      <section v-else class="novels-grid" aria-label="Novel library">
        <NovelCard v-for="novel in novels" :key="novel.novel_id" :novel="novel" @open="openNovel" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import NovelCard from '@/components/NovelCard.vue'
import CreateNovel from '@/components/CreateNovel.vue'
import { useNovels } from '@/composables/useNovels'
import { useRoute } from 'vue-router'

const router = useRouter()

const { novels, loading, error, fetchNovels, createNovel } = useNovels()
const showCreateDialog = ref(false)

async function handleCreateNovel(novel: { novel_name: string; description: string }) {
  const result = await createNovel(novel)

  if (!result.error) {
    showCreateDialog.value = false
  }
}

function openNovel(novelId: string) {
  void router.push({
    name: 'novel-details',
    params: { id: novelId },
  })
}

onMounted(() => {
  void fetchNovels()
})
</script>

<style scoped>
.novels-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  padding: 20px;
  color: var(--color-text-primary);
  background: var(--color-page-bg);
}

.novels-header {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto 20px;
}

.novels-main {
  position: relative;
  width: 100%;
  max-width: 1240px;
  min-height: calc(100vh - 116px);
  margin: 0 auto;
  padding: 34px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 24px;
  background: rgba(212, 214, 217, 0.38);
  box-shadow:
    0 0 8px var(--color-glow),
    0 0 22px rgba(255, 255, 255, 0.55),
    0 16px 38px rgba(36, 38, 41, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.novels-heading {
  margin-bottom: 24px;
}

.novels-heading p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.novels-heading h2 {
  margin-top: 2px;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
}

.create {
  position: absolute;
  right: 34px;
  bottom: 34px;
  border: 1px solid rgba(36, 38, 41, 0.08);
  border-radius: 999px;
  background: var(--color-snow-white);
  box-shadow: 0 4px 14px rgba(36, 38, 41, 0.12);
  color: var(--color-text-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 12px 18px;
}

.create:hover {
  background: #ffffff;
  box-shadow: 0 0 12px var(--color-glow);
  transform: translateY(-1px);
}

.novels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
  gap: 24px;
}

.novels-status {
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px;
  background: rgba(255, 250, 250, 0.48);
  color: var(--color-text-muted);
  text-align: center;
}

.novels-status--error {
  color: #8a3b3b;
}

@media (max-width: 780px) {
  .novels-page {
    padding: 12px;
  }

  .novels-header {
    margin-bottom: 12px;
  }

  .novels-main {
    min-height: calc(100vh - 94px);
    padding: 18px;
    border-radius: 20px;
  }

  .novels-grid {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .create {
    right: 18px;
    bottom: 18px;
  }
}
</style>
