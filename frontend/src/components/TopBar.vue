<template>
  <div class="top-bar">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo" />
    </div>
    <div class="novelrina">
      <h1>NovelRina</h1>
    </div>

    <div v-if="!isLoggedIn" class="uis">
      <button class="signIn">SignIn</button>
      <button class="signup">SignUp</button>
    </div>
    <div v-else class="user">
      <button class="email">{{ user }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { isLoggedIn, user, loading, signInWithEmail, signOut } = useAuth()
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-surface-gray), #cdd0d4);
  box-shadow:
    0 0 8px var(--color-glow),
    0 0 22px rgba(255, 255, 255, 0.55),
    0 8px 20px rgba(36, 38, 41, 0.1);
}

.logo img {
  display: block;
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.novelrina h1 {
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: 0.01em;
}

.uis {
  display: flex;
  gap: 10px;
  margin-left: auto;
}

.top-bar button,
.user .email {
  border: 1px solid rgba(36, 38, 41, 0.08);
  border-radius: 999px;
  background: var(--color-snow-white);
  box-shadow: 0 2px 8px rgba(36, 38, 41, 0.08);
  color: var(--color-text-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  padding: 9px 16px;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.top-bar button:hover,
.user .email:hover {
  background: #ffffff;
  box-shadow: 0 0 10px var(--color-glow);
  transform: translateY(-1px);
}

.user {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.user .email {
  color: var(--color-text-muted);
}

@media (max-width: 480px) {
  .top-bar {
    gap: 10px;
    padding: 12px;
  }

  .logo img {
    width: 36px;
    height: 36px;
  }

  .novelrina h1 {
    font-size: 1.05rem;
  }

  .top-bar button {
    padding: 8px 12px;
  }
}
</style>
