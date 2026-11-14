<template>
  <article class="novel-card">
    <Card class="novel-card__surface" @click="emit('open', props.novel.novel_id)">
      <template #header>
        <div class="novel-card__art" aria-hidden="true">
          <div class="novel-card__glow"></div>
          <Book class="novel-card__icon" :stroke-width="1.5" />
        </div>
        <!-- novel card menu -->
        <button class="menu" aria-label="Novel options" @click.stop="toggleMenu">
          <Ellipsis :size="20" />
        </button>
        <Menu ref="menu" :model="options" popup></Menu>
      </template>

      <template #title>
        <h3 class="novel-card__title">{{ props.novel.novel_name }}</h3>
      </template>

      <template #content>
        <p class="novel-card__description">
          {{ props.novel.description || 'A new story waiting to be discovered.' }}
        </p>
      </template>
    </Card>
  </article>

  <UpdateNovelModal
    v-if="showUpdateNovelModal"
    :novel_id="props.novel.novel_id"
    :novel_name="props.novel.novel_name"
    :description="props.novel.description ?? ''"
    @close="showUpdateNovelModal = false"
  />
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { Book, Ellipsis } from 'lucide-vue-next'
import Menu from 'primevue/menu'
import { ref } from 'vue'
import { useNovels } from '@/composables/useNovels'
import { useToast } from 'primevue'
import UpdateNovelModal from './UpdateNovelModal.vue'

interface Novel {
  novel_id: string
  novel_name: string
  description?: string | null
}

const props = defineProps<{
  novel: Novel
}>()

const emit = defineEmits<{
  open: [novelId: string]
}>()

const { deleteNovel } = useNovels()

const toast = useToast()
const menu = ref()
const options = ref([
  {
    label: 'Edit',
    icon: 'lucide-pencil',
    command: updateNovelHandler,
  },
  {
    label: 'Delete',
    icon: 'lucide-trash-2',
    command: deleteNovelHandler,
  },
])

const showUpdateNovelModal = ref<boolean>(false)
function updateNovelHandler() {
  showUpdateNovelModal.value = true
}

async function deleteNovelHandler() {
  const result = await deleteNovel(props.novel.novel_id)

  if (result.error) {
    toast.add({
      severity: 'error',
      summary: 'Delete failed',
      detail: result.error,
      life: 5000,
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Novel deleted',
    detail: `"${props.novel.novel_name}" was deleted.`,
    life: 3000,
  })
}

function toggleMenu(event: Event) {
  menu.value.toggle(event)
}
</script>

<style scoped>
.novel-card {
  width: 100%;
  max-width: 320px;
}

.novel-card__surface {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  background: rgba(255, 250, 250, 0.58);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.72),
    0 12px 28px rgba(36, 38, 41, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background-color 0.22s ease;
}

.novel-card__surface:hover {
  transform: translateY(-5px);
  background: rgba(255, 250, 250, 0.74);
  box-shadow:
    0 0 14px var(--color-glow),
    0 18px 32px rgba(36, 38, 41, 0.14);
}

.novel-card__surface :deep(.p-card-header) {
  position: relative;
}

.menu {
  position: absolute;
  z-index: 1;
  top: 12px;
  right: 12px;
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.78);
  color: var(--color-text-primary);
  cursor: pointer;
}

.menu:hover {
  background: var(--color-snow-white);
}

:global(.p-menu-item-icon.lucide-pencil),
:global(.p-menu-item-icon.lucide-trash-2) {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}

:global(.p-menu-item-icon.lucide-pencil) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.623l4.353-1.32a2 2 0 0 0 .83-.5z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.623l4.353-1.32a2 2 0 0 0 .83-.5z'/%3E%3Cpath d='m15 5 4 4'/%3E%3C/svg%3E");
}

:global(.p-menu-item-icon.lucide-trash-2) {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M8 6V4h8v2'/%3E%3Cpath d='m19 6-1 14H6L5 6'/%3E%3Cpath d='M10 11v6'/%3E%3Cpath d='M14 11v6'/%3E%3C/svg%3E");
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'/%3E%3Cpath d='M8 6V4h8v2'/%3E%3Cpath d='m19 6-1 14H6L5 6'/%3E%3Cpath d='M10 11v6'/%3E%3Cpath d='M14 11v6'/%3E%3C/svg%3E");
}

.novel-card__art {
  position: relative;
  display: grid;
  place-items: center;
  height: 170px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.82);
  background:
    radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.95), transparent 28%),
    linear-gradient(145deg, var(--color-surface-gray), var(--color-snow-white));
}

.novel-card__art::before,
.novel-card__art::after {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  content: '';
  filter: blur(20px);
  opacity: 0.55;
}

.novel-card__art::before {
  top: -78px;
  right: -48px;
  background: var(--color-glow);
}

.novel-card__art::after {
  bottom: -92px;
  left: -44px;
  background: rgba(36, 38, 41, 0.12);
}

.novel-card__glow {
  position: absolute;
  width: 92px;
  height: 92px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  box-shadow:
    0 0 18px var(--color-glow),
    inset 0 0 18px rgba(255, 255, 255, 0.76);
}

.novel-card__icon {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  color: var(--color-text-primary);
}

.novel-card__surface :deep(.p-card-body) {
  padding: 20px 22px 22px;
}

.novel-card__surface :deep(.p-card-caption) {
  gap: 10px;
}

.novel-card__title {
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: 1.08rem;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.novel-card__description {
  display: -webkit-box;
  min-height: 3em;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (prefers-reduced-motion: reduce) {
  .novel-card__surface {
    transition: none;
  }
}
</style>
