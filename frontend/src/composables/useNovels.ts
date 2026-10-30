import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export interface Novel {
  novel_id: string
  novel_name: string
  description?: string | null
}

const novels = ref<Novel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useNovels() {
  async function fetchNovels() {
    loading.value = true
    error.value = null

    try {
      const { data, error: queryError } = await supabase.from('novels').select('*')

      if (queryError) {
        console.error('Failed to fetch novels:', queryError.message)
        error.value = queryError.message
        novels.value = []
        return { data: null, error: queryError.message }
      }

      novels.value = data ?? []
      return { data: novels.value, error: null }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to fetch novels'
      console.error('Failed to fetch novels:', message)
      error.value = message
      novels.value = []
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  async function createNovel(novel: any) {
    loading.value = true
    error.value = null

    try {
      const { data, error: insertError } = await supabase
        .from('novels')
        .insert([novel])
        .select()
        .single()

      if (insertError) {
        console.error('Failed to create novel:', insertError.message)
        error.value = insertError.message
        return { data: null, error: insertError.message }
      }

      novels.value.push(data)
      return { data, error: null }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to create novel'
      console.error('Failed to create novel:', message)
      error.value = message
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  async function deleteNovel(novel_id: string) {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase.from('novels').delete().eq('novel_id', novel_id)

      if (deleteError) {
        console.error('Failed to delete novel:', deleteError.message)
        error.value = deleteError.message
        return { success: false, error: deleteError.message }
      }

      novels.value = novels.value.filter((novel) => novel.novel_id !== novel_id)
      return { success: true, error: null }
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Failed to delete novel'
      console.error('Failed to delete novel:', message)
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  return {
    fetchNovels,
    novels,
    loading,
    error,
  }
}
