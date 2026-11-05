import { ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { useAuth } from '@/composables/useAuth'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useChat(
  user_id: MaybeRefOrGetter<string | null>,
  novelId: MaybeRefOrGetter<string | null>,
) {
  const { session } = useAuth()
  const history = ref<ChatMessage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  function clearHistory() {
    history.value = []
    error.value = null
  }

  watch(
    () => toValue(novelId),
    () => clearHistory(),
  )

  async function sendMessage(query: string) {
    const message = query.trim()
    const currentNovelId = toValue(novelId)

    if (!currentNovelId) {
      error.value = 'Novel ID is missing'
      return null
    }

    if (!message) {
      error.value = 'Message cannot be empty'
      return null
    }

    const accessToken = session.value?.access_token
    if (!accessToken) {
      error.value = 'User is not authenticated'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${SERVER_URL}/novels/${encodeURIComponent(currentNovelId)}/chat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: message,
            history: history.value,
          }),
        },
      )

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.detail ?? `Request failed: ${response.status}`)
      }

      const result = await response.json()
      const agentResponse =
        typeof result === 'string'
          ? result
          : typeof result?.output === 'string'
            ? result.output
            : JSON.stringify(result)

      history.value.push(
        { role: 'user', content: message },
        { role: 'assistant', content: agentResponse },
      )

      return agentResponse
    } catch (caughtError) {
      error.value =
        caughtError instanceof Error ? caughtError.message : 'Failed to get agent response'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    history,
    loading,
    error,
    sendMessage,
    clearHistory,
  }
}
