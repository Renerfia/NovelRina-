<template>
  <article class="novel-card">
    <Card class="novel-card__surface" @click="$emit('open', novel.novel_id)">
      <template #header>
        <div class="novel-card__art" aria-hidden="true">
          <div class="novel-card__glow"></div>
          <Book class="novel-card__icon" :stroke-width="1.5" />
        </div>
      </template>

      <template #title>
        <h3 class="novel-card__title">{{ novel.novel_name }}</h3>
      </template>

      <template #content>
        <p class="novel-card__description">
          {{ novel.description || 'A new story waiting to be discovered.' }}
        </p>
      </template>
    </Card>
  </article>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import { Book } from 'lucide-vue-next'
import { emit } from 'process'

interface Novel {
  novel_id: String
  novel_name: string
  description?: string | null
}

defineProps<{
  novel: Novel
}>()

defineEmits<{
  open: [novelId: string]
}>()
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
