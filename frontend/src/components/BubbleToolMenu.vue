<template>
  <div class="bubble-tool-root" :class="{ 'is-open': showMenu }">
    <Transition name="tool-menu">
      <menu v-if="showMenu" class="tool-menu" aria-label="Tool menu">
        <li class="tool-menu-item">
          <button class="tool-menu-button" type="button" @click="showDashbaordPanel">
            Chapter Dashboard
          </button>
        </li>

        <li class="tool-menu-item">
          <button
            class="tool-menu-button"
            type="button"
            :disabled="!props.novelId"
            @click="showEditorPanel"
          >
            Editor Panel
          </button>
        </li>

        <li class="tool-menu-item">
          <button
            class="tool-menu-button"
            type="button"
            :disabled="!props.novelId"
            @click="showChatPanel"
          >
            AI Assistant
          </button>
        </li>

        <li class="tool-menu-item">
          <button
            class="tool-menu-button"
            type="button"
            :disabled="!props.novelId"
            @click="showSummaryPanel"
          >
            View Chapter Summary
          </button>
        </li>
      </menu>
    </Transition>

    <!-- close button -->
    <button
      class="bubble-tool-button"
      type="button"
      :aria-label="showMenu ? 'Close tool menu' : 'Open tool menu'"
      :aria-expanded="showMenu"
      @click="toggleMenu"
    >
      Tools
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ novelId?: string | null }>()
const showMenu = ref(false)
const emits = defineEmits<{
  (event: 'close'): void
  (event: 'showChatPanel'): void
  (event: 'showSummaryPanel'): void
  (event: 'showDashboardPanel'): void
  (event: 'showEditorPanel'): void
}>()

function toggleMenu() {
  showMenu.value = !showMenu.value
}

//for chat
function showChatPanel() {
  if (!props.novelId) return
  emits('showChatPanel')
  showMenu.value = false
}

//for chapter summary
function showSummaryPanel() {
  if (!props.novelId) return
  emits('showSummaryPanel')
  showMenu.value = false
}

//for dashboard
function showDashbaordPanel() {
  emits('showDashboardPanel')
  showMenu.value = false
}

function showEditorPanel() {
  emits('showEditorPanel')
  showMenu.value = false
}
</script>

<style scoped>
.bubble-tool-root {
  position: fixed;
  z-index: 40;
  top: 50%;
  right: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateY(-50%);
}

.bubble-tool-button {
  position: relative;
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  place-items: center;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 23%, rgba(255, 255, 255, 0.92) 0 7%, transparent 20%),
    radial-gradient(circle at 68% 78%, rgba(255, 255, 255, 0.12), transparent 38%),
    rgba(255, 255, 255, 0.22);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.22),
    0 0 22px rgba(255, 255, 255, 0.22),
    inset 0 2px 7px rgba(255, 255, 255, 0.72),
    inset 0 -5px 12px rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  font-size: 0;
  cursor: pointer;
  animation: bubble-float 3.6s ease-in-out infinite;
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.bubble-tool-button::before {
  width: 20px;
  height: 24px;
  border: 1.5px solid rgba(255, 255, 255, 0.98);
  border-radius: 52% 48% 58% 42% / 62% 62% 38% 38%;
  transform: rotate(45deg);
  box-shadow:
    inset 2px 2px 5px rgba(255, 255, 255, 0.42),
    0 0 8px rgba(255, 255, 255, 0.24);
  content: '';
}

.bubble-tool-button::after {
  position: absolute;
  width: 17px;
  height: 17px;
  opacity: 0;
  transform: rotate(-45deg) scale(0.5);
  transition: 0.25s ease;
  content: '';
}

.bubble-tool-button:hover {
  border-color: white;
  background-color: rgba(255, 255, 255, 0.34);
}

.bubble-tool-root.is-open .bubble-tool-button {
  transform: rotate(90deg) scale(0.94);
  animation: none;
}

.bubble-tool-root.is-open .bubble-tool-button::before {
  opacity: 0;
  transform: scale(0.5) rotate(45deg);
}

.bubble-tool-root.is-open .bubble-tool-button::after {
  opacity: 1;
  transform: rotate(0deg) scale(1);
  border-top: 2px solid white;
  border-right: 2px solid white;
}

.tool-menu {
  width: 220px;
  margin: 0;
  padding: 12px;
  list-style: none;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow:
    0 18px 44px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.tool-menu-item + .tool-menu-item {
  margin-top: 8px;
}

.tool-menu-button {
  width: 100%;
  min-height: 46px;
  padding: 9px 12px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: 0.2s ease;
}

.tool-menu-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.tool-menu-button:not(:disabled):hover {
  border-color: rgba(255, 255, 255, 0.78);
  background: rgba(255, 255, 255, 0.24);
}

.tool-menu-enter-active,
.tool-menu-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.tool-menu-enter-from,
.tool-menu-leave-to {
  opacity: 0;
  transform: translateX(18px) scale(0.96);
}

@keyframes bubble-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@media (max-width: 760px) {
  .bubble-tool-root {
    right: 12px;
  }

  .bubble-tool-button {
    width: 52px;
    height: 52px;
    flex-basis: 52px;
  }

  .tool-menu {
    width: min(210px, calc(100vw - 82px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .bubble-tool-button,
  .tool-menu-enter-active,
  .tool-menu-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
