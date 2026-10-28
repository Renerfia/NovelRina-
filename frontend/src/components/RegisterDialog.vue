<template>
  <Dialog
    :visible="true"
    modal
    :dismissable-mask="false"
    :closable="false"
    :draggable="false"
    class="auth-dialog"
    :breakpoints="{ '480px': '94vw' }"
  >
    <template #header>
      <div class="auth-brand-header">
        <img class="auth-logo" src="@/assets/logo.png" alt="NovelRina logo" />
        <div class="auth-heading">
          <span>Create your account</span>
          <small>Start writing worlds of your own</small>
        </div>
      </div>
      <button class="auth-close" type="button" aria-label="Close" @click="closeDialog">×</button>
    </template>

    <form class="auth-form" @submit.prevent="register">
      <label for="register-email">Email</label>
      <input
        id="register-email"
        v-model="email"
        class="auth-input"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        required
      />

      <label for="register-password">Password</label>
      <input
        id="register-password"
        v-model="password"
        class="auth-input"
        type="password"
        autocomplete="new-password"
        placeholder="At least 6 characters"
        minlength="6"
        required
      />

      <label for="register-confirm-password">Confirm password</label>
      <input
        id="register-confirm-password"
        v-model="confirmPassword"
        class="auth-input"
        type="password"
        autocomplete="new-password"
        placeholder="Repeat your password"
        minlength="6"
        required
      />

      <p v-if="message" class="auth-message" role="status">{{ message }}</p>

      <button class="auth-submit" type="submit" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Sign Up' }}
      </button>
    </form>

    <button class="auth-switch" type="button" @click="switchToLogin">
      Already have an account? Sign in
    </button>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'switch-login'): void
}>()

const { signUpWithEmail } = useAuth()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref('')
const loading = ref(false)

function closeDialog() {
  emit('close')
}

function switchToLogin() {
  emit('switch-login')
}

async function register() {
  if (password.value !== confirmPassword.value) {
    message.value = 'The passwords do not match.'
    return
  }

  loading.value = true
  message.value = ''

  const { data, error } = await signUpWithEmail(email.value.trim(), password.value)

  loading.value = false

  if (error) {
    message.value = error.message
    return
  }

  if (data.session) {
    password.value = ''
    confirmPassword.value = ''
    emit('close')
    return
  }

  message.value = 'Account created. Check your email to confirm your registration.'
  password.value = ''
  confirmPassword.value = ''
}
</script>

<style scoped>
.auth-brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.auth-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 50%;
  background: rgba(36, 38, 41, 0.18);
  color: #ffffff;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
}

.auth-heading {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.auth-heading span {
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 700;
}

.auth-heading small {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.82rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.auth-form label {
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
}

.auth-input {
  width: 100%;
  margin-bottom: 6px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 4px;
  outline: none;
  background: rgba(36, 38, 41, 0.18);
  box-shadow: 0 2px 8px rgba(36, 38, 41, 0.08);
  color: #ffffff;
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.auth-input::placeholder {
  color: rgba(255, 255, 255, 0.62);
}

.auth-input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);
}

.auth-message {
  margin: 2px 0 4px;
  color: #ffffff;
  font-size: 0.82rem;
}

.auth-submit {
  margin-top: 4px;
  padding: 11px 16px;
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 999px;
  background: rgba(36, 38, 41, 0.82);
  box-shadow:
    0 0 10px rgba(255, 255, 255, 0.38),
    0 8px 18px rgba(36, 38, 41, 0.12);
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    0 0 14px var(--color-glow),
    0 10px 20px rgba(36, 38, 41, 0.14);
}

.auth-submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.auth-switch {
  width: 100%;
  margin-top: 14px;
  padding: 8px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
}

.auth-switch:hover {
  color: #ffffff;
}

:deep(.auth-dialog.p-dialog) {
  width: min(420px, 92vw);
  border: 1px solid rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  background: rgba(102, 105, 109, 0.92);
  box-shadow:
    0 0 12px var(--color-glow),
    0 18px 44px rgba(36, 38, 41, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

:deep(.auth-dialog .p-dialog-header) {
  position: relative;
  padding: 20px 22px 8px;
  border: 0;
  border-radius: 12px 12px 0 0;
  background: transparent;
}

:deep(.auth-dialog .p-dialog-content) {
  padding: 12px 22px 20px;
  border-radius: 0 0 12px 12px;
  background: transparent;
}

:deep(.auth-dialog .p-dialog-header-icon) {
  color: #ffffff;
}

@media (max-width: 480px) {
  :deep(.auth-dialog.p-dialog) {
    width: 94vw;
    margin: 12px;
  }

  :deep(.auth-dialog .p-dialog-header) {
    padding: 16px 16px 7px;
  }

  :deep(.auth-dialog .p-dialog-content) {
    padding: 10px 16px 16px;
  }
}
</style>
