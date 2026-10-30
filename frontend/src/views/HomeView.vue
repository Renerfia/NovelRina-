<template>
  <div class="home-page">
    <header class="home-header">
      <TopBar @open-login="openLogin" @open-register="openRegister" />
    </header>

    <main class="home-main">
      <section class="story-grid" aria-label="NovelRina introduction">
        <Card class="bubble-card card-one">
          <template #title>01 — A Quiet Beginning</template>
          <template #content>“Somewhere between a thought and a dream, a story begins.”</template>
          <template #footer>— A writer's whisper</template>
        </Card>

        <Card class="bubble-card card-two">
          <template #title>02 — Little Worlds</template>
          <template #content
            >“You can build entire worlds without ever leaving your room.”</template
          >
          <template #footer>— The daydreamer</template>
        </Card>

        <div class="main-button-wrap">
          <button class="main-button" type="button" @click="redirectToNovelsView">
            <span>Ready to write?</span>
          </button>
        </div>

        <Card class="bubble-card card-three">
          <template #title>03 — Growing Stories</template>
          <template #content>“Every unfinished page is a little promise to tomorrow.”</template>
          <template #footer>— A gentle reminder</template>
        </Card>

        <Card class="bubble-card card-four">
          <template #title>04 — Somewhere Else</template>
          <template #content
            >“Let the world grow quiet. There are lives waiting inside your words.”</template
          >
          <template #footer>— Between the lines</template>
        </Card>
      </section>

      <footer class="home-footer">
        <div class="brand">
          <span>NovelRina</span>
          <p>Made by Renerfia</p>
        </div>

        <hr />

        <small>© 2026 NovelRina. Made for the love of stories.</small>
      </footer>
    </main>

    <LoginDialog
      v-if="activeAuthDialog === 'login'"
      @close="activeAuthDialog = null"
      @switch-register="activeAuthDialog = 'register'"
    />
    <RegisterDialog
      v-if="activeAuthDialog === 'register'"
      @close="activeAuthDialog = null"
      @switch-login="activeAuthDialog = 'login'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopBar from '@/components/TopBar.vue'
import LoginDialog from '@/components/LoginDialog.vue'
import RegisterDialog from '@/components/RegisterDialog.vue'
import Card from 'primevue/card'
import router from '@/router'

const activeAuthDialog = ref<'login' | 'register' | null>(null)

function openLogin() {
  activeAuthDialog.value = 'login'
}

function openRegister() {
  activeAuthDialog.value = 'register'
}

function redirectToNovelsView() {
  router.push('/novels')
}
</script>

<style scoped>
.home-page {
  --home-background-image: none;

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  padding: 20px;
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-page-bg);
}

.home-page::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  content: '';
  background-color: var(--color-page-bg);
  background-image: var(--home-background-image);
  background-position: center;
  background-size: cover;
}

.home-page::after {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: '';
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.36), transparent 48%), rgba(232, 233, 235, 0.58);
  backdrop-filter: blur(4px);
}

.home-header {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto 20px;
}

.home-main {
  position: relative;
  z-index: 1;
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

.story-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) 150px minmax(220px, 1fr);
  grid-template-rows: repeat(2, minmax(190px, auto));
  gap: 28px 36px;
  align-items: center;
  width: 100%;
  max-width: 980px;
  min-height: 470px;
  margin: 0 auto;
}

.bubble-card {
  width: 100%;
  max-width: 330px;
  justify-self: center;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 30px;
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

.bubble-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 250, 250, 0.72);
  box-shadow:
    0 0 14px var(--color-glow),
    0 18px 32px rgba(36, 38, 41, 0.14);
}

.bubble-card :deep(.p-card-body) {
  padding: 22px;
}

.bubble-card :deep(.p-card-title) {
  margin-bottom: 12px;
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 650;
  line-height: 1.35;
}

.bubble-card :deep(.p-card-content) {
  color: var(--color-text-primary);
  font-size: 0.95rem;
  line-height: 1.75;
}

.bubble-card :deep(.p-card-footer) {
  margin-top: 14px;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 600;
}

.card-one {
  grid-column: 1;
  grid-row: 1;
}

.card-two {
  grid-column: 3;
  grid-row: 1;
}

.card-three {
  grid-column: 1;
  grid-row: 2;
}

.card-four {
  grid-column: 3;
  grid-row: 2;
}

.main-button-wrap {
  grid-column: 2;
  grid-row: 1 / 3;
  display: grid;
  place-items: center;
}

.main-button {
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 50%;
  background: linear-gradient(145deg, #ffffff, var(--color-surface-gray));
  box-shadow:
    0 0 12px var(--color-glow),
    0 14px 28px rgba(36, 38, 41, 0.16),
    inset 0 0 18px rgba(255, 255, 255, 0.72);
  color: var(--color-text-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.main-button:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 0 18px var(--color-glow),
    0 18px 34px rgba(36, 38, 41, 0.18),
    inset 0 0 18px rgba(255, 255, 255, 0.82);
}

.main-button:focus-visible {
  outline: 3px solid rgba(36, 38, 41, 0.25);
  outline-offset: 5px;
}

.home-footer {
  max-width: 980px;
  margin: 24px auto 0;
  color: var(--color-text-muted);
  text-align: center;
}

.brand {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
}

.brand span {
  color: var(--color-text-primary);
  font-size: 0.95rem;
  font-weight: 700;
}

.brand p,
.home-footer small {
  font-size: 0.78rem;
}

.home-footer hr {
  height: 1px;
  margin: 10px 0;
  border: 0;
  background: rgba(255, 255, 255, 0.82);
}

@media (max-width: 780px) {
  .home-page {
    padding: 12px;
  }

  .home-header {
    margin-bottom: 12px;
  }

  .home-main {
    min-height: calc(100vh - 94px);
    padding: 18px;
    border-radius: 20px;
  }

  .story-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 16px;
    min-height: 0;
  }

  .bubble-card,
  .card-one,
  .card-two,
  .card-three,
  .card-four {
    grid-column: auto;
    grid-row: auto;
    max-width: 520px;
  }

  .bubble-card :deep(.p-card-body) {
    padding: 18px;
  }

  .main-button-wrap {
    grid-column: auto;
    grid-row: auto;
    margin: 8px 0;
  }

  .main-button {
    width: 116px;
    height: 116px;
  }

  .brand {
    flex-direction: column;
    gap: 2px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bubble-card,
  .main-button {
    transition: none;
  }
}
</style>
