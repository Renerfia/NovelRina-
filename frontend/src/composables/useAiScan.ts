import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const loading = ref<boolean>(false)

export function useAiScan() {
  const { session } = useAuth()

  async function getChapterSummary(chapter_content: string) {
    const accessToken = session.value?.access_token
    if (!accessToken) {
      throw new Error('You must be signed in to summarize a chapter.')
    }

    loading.value = true

    try {
      const response = await fetch(`${SERVER_URL}/get-summary`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_content }),
      })

      const result = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(result?.detail ?? `Summary request failed: ${response.status}`)
      }
      if (typeof result?.summary !== 'string') {
        throw new Error('The summary service returned an invalid response.')
      }

      return result.summary as string
    } finally {
      loading.value = false
    }
  }

  async function getSummaryEmbedding(
    chapter_id: string,
    chapter_content_summary: string,
  ): Promise<void> {
    const accessToken = session.value?.access_token
    if (!accessToken) {
      throw new Error('You must be signed in to get a summary embedding.')
    }

    loading.value = true

    try {
      const response = await fetch(`${SERVER_URL}/get-summary-embedding`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_id, chapter_content_summary }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.detail ?? `Embedding request failed: ${response.status}`)
      }
    } finally {
      loading.value = false
    }
  }

  return {
    getChapterSummary,
    getSummaryEmbedding,
    loading,
  }
}
