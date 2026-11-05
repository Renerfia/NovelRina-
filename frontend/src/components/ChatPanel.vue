<template>
  <div class="chat-panel">
    <header class="chat-header">
      <h2>Novel assistant</h2>
      <button type="button" aria-label="Close chat" @click="emit('close')">×</button>
    </header>

    <div class="messages" aria-live="polite">
      <p v-if="history.length === 0" class="empty-message">Ask a question about this novel.</p>

      <div v-for="(message, index) in history" :key="index" :class="['message', message.role]">
        {{ message.content }}
      </div>

      <p v-if="loading" class="loading-message">Agent is thinking...</p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>

    <form class="chat-form" @submit.prevent="submit">
      <input
        v-model="query"
        type="text"
        placeholder="Ask about this novel..."
        :disabled="loading || !props.novelId"
        aria-label="Chat message"
      />
      <button type="submit" :disabled="!canSend">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChat } from '@/composables/useChat'

const props = defineProps<{
  authorId: string | null
  novelId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const query = ref('')
const { history, loading, error, sendMessage } = useChat(props.authorId, props.novelId)

const canSend = computed(
  () => Boolean(props.novelId) && Boolean(query.value.trim()) && !loading.value,
)

async function submit() {
  if (!canSend.value) return

  const message = query.value
  query.value = ''
  await sendMessage(message)
}
</script>

<style scoped>
.chat-panel {
  width: min(720px, 100%);
  height: min(620px, calc(100vh - 80px));
  display: grid;
  grid-template-rows: auto 1fr auto;
  color: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 18px;
  background: rgba(18, 17, 15, 0.94);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.chat-header {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.chat-header h2 {
  margin: 0;
  font-size: 1rem;
}

.chat-header button {
  width: 34px;
  height: 34px;
  color: inherit;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
}

.message {
  max-width: 82%;
  margin: 0;
  padding: 10px 12px;
  line-height: 1.5;
  border-radius: 14px;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.message.user {
  align-self: flex-end;
  background: rgba(173, 132, 92, 0.35);
}

.message.assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.09);
}

.empty-message,
.loading-message {
  margin: auto;
  color: rgba(255, 255, 255, 0.65);
}

.error-message {
  margin: 0;
  color: #ffaaa5;
}

.chat-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.chat-form input {
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
}

.chat-form button {
  padding: 0 16px;
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(173, 132, 92, 0.45);
  cursor: pointer;
}

.chat-form button:disabled,
.chat-form input:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
</style>
