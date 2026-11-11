import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Chapter } from '@/composables/useChapter'

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:8000'

const loading = ref<boolean>(false)
const chapter = ref<Chapter | null>(null)

export async function useAiScan() {
  //check if summary already exists for the chapter content
  const chapter_content_summary = chapter.value?.chapter_content_summary
  if (chapter_content_summary) {
    console.log('Summary already exists for this chapter content.')
    return chapter_content_summary
  }

  async function getChapterSummary(chapter_content: string) {
    loading.value = true

    try {
      const response = await fetch(`${SERVER_URL}/ai/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter_content }),
      })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching chapter summary:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function updateChapterSummary(chapter_id: string, summary: string) {
    loading.value = true

    try {
      const { data, error } = await supabase
        .from('chapters')
        .update({ chapter_content_summary: summary })
        .eq('chapter_id', chapter_id)
        .select()

      if (error) {
        console.error('Error updating chapter summary:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating chapter summary:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    getChapterSummary,
    updateChapterSummary,
    loading,
  }
}
