<template>
  <article v-if="selected_chapter" class="chapter-dashboard">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Chapter dashboard</p>
        <h1>{{ selected_chapter.chapter_name }}</h1>
      </div>
      <span class="status-pill">Selected</span>
    </header>

    <div class="dashboard-grid">
      <section class="content-card">
        <div class="card-heading">
          <h2>Chapter content</h2>
        </div>
        <div class="chapter-content-wrapper">
          <p class="chapter-content">{{ selected_chapter.chapter_content }}</p>
        </div>
      </section>

      <aside class="details-card">
        <h2>Details</h2>
        <dl>
          <div>
            <dt>Chapter ID</dt>
            <dd>{{ selected_chapter.chapter_id }}</dd>
          </div>
          <div>
            <dt>Novel ID</dt>
            <dd>{{ selected_chapter.novel_id }}</dd>
          </div>
        </dl>
      </aside>
    </div>
  </article>

  <div v-else class="dashboard-empty">
    <div class="empty-icon" aria-hidden="true">Aa</div>
    <h1>Select a chapter</h1>
    <p>Choose a chapter from the sidebar to open its dashboard.</p>
  </div>
</template>

<script setup lang="ts">
import type { Chapter } from '@/composables/useChapter'

defineProps<{
  selected_chapter: Chapter | null
}>()
</script>

<style scoped>
.chapter-dashboard {
  width: min(960px, 100%);
  display: grid;
  gap: 18px;
}

.dashboard-header {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(18px);
}

.dashboard-header h1,
.dashboard-empty h1 {
  margin: 4px 0 0;
  color: #fff;
  font-family: var(--font-reading);
}

.eyebrow {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-family: var(--font-ui);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.status-pill {
  flex: none;
  padding: 7px 11px;
  color: #e7d4b8;
  border: 1px solid rgba(231, 212, 184, 0.32);
  border-radius: 999px;
  background: rgba(231, 212, 184, 0.08);
  font-size: 0.78rem;
  font-weight: 700;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(220px, 0.75fr);
  gap: 18px;
}

.content-card,
.details-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.055));
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
}

.content-card {
  min-height: 440px;
  padding: 22px;
}

.card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.content-card h2,
.details-card h2 {
  margin: 0;
  color: #fff;
  font-family: var(--font-ui);
  font-size: 1rem;
}

.chapter-content-wrapper {
  height: 310px;
  margin-top: 18px;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  background: rgba(8, 8, 8, 0.24);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.35) transparent;
}

.chapter-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.chapter-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.chapter-content-wrapper::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
}

.chapter-content {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-family: var(--font-reading);
  font-size: 1rem;
  line-height: 1.85;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.details-card {
  align-self: start;
  padding: 22px;
}

.details-card dl {
  display: grid;
  gap: 14px;
  margin: 16px 0 0;
}

.details-card dl div {
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.details-card dt {
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.details-card dd {
  margin: 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 0.82rem;
  overflow-wrap: anywhere;
}

.dashboard-empty {
  width: min(520px, 100%);
  display: grid;
  justify-items: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  display: grid;
  width: 72px;
  height: 72px;
  margin-bottom: 12px;
  place-items: center;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.08);
  font-family: var(--font-reading);
  font-size: 1.35rem;
}

.dashboard-empty p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.62);
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .details-card {
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 760px) {
  .dashboard-header {
    min-height: 72px;
    padding: 14px 16px;
  }

  .content-card,
  .details-card {
    padding: 16px;
  }

  .content-card {
    min-height: 320px;
  }
}
</style>
