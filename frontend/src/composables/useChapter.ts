import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

/** Describes one row returned from the chapters table. */
export interface Chapter {
  chapter_id: string
  chapter_name: string
  chapter_content: string
  chapter_content_summary: string | null
  novel_id: string
}

// These refs are shared by every useChapter() instance in the application.
const chapters = ref<Chapter[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const status_msg = ref<string | null>(null)

export function useChapter() {
  /** Fetch all chapters that belong to one novel. */
  async function fetchChapters(novelId: string) {
    // Show that a request is running and clear an error from a previous request.
    loading.value = true
    error.value = null
    status_msg.value = 'Fetching chapters...'

    try {
      // Query only the chapter fields used by the application.
      const { data, error: queryError } = await supabase
        .from('chapters')
        .select('chapter_id, chapter_name, chapter_content, chapter_content_summary, novel_id')
        .eq('novel_id', novelId)

      if (queryError) {
        // Database errors are returned to the caller and saved for the UI.
        error.value = queryError.message
        chapters.value = []
        return { data: null, error: queryError.message }
      }

      chapters.value = data ?? []
      status_msg.value = 'Found your all chapters!'
      return { data: chapters.value, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to fetch chapters'

      error.value = message
      chapters.value = []
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  /** Create a new chapter and add the returned row to the shared list. */
  async function createChapter(novelId: string, title: string, content: string) {
    loading.value = true
    error.value = null
    status_msg.value = 'Creating chapter...'

    try {
      // Insert positional arguments into their matching database columns.
      const { data, error: insertError } = await supabase
        .from('chapters')
        .insert([{ novel_id: novelId, chapter_name: title, chapter_content: content }])
        .select('chapter_id, chapter_name, chapter_content, chapter_content_summary, novel_id')
        .single()

      if (insertError) {
        error.value = insertError.message
        return { data: null, error: insertError.message }
      }

      // Keep the local state in sync without fetching all chapters again.
      chapters.value.push(data)
      status_msg.value = 'Chapter created successfully!'
      return { data, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to create chapter'

      error.value = message
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  /** Update a chapter only when it belongs to the supplied novel. */
  async function updateChapter(novelId: string, chapterId: string, title: string, content: string) {
    loading.value = true
    error.value = null
    status_msg.value = 'Updating chapter...'

    try {
      console.log('Updating chapter:', { novelId, chapterId, title, content })
      // Require both IDs so a chapter from another novel cannot be modified.
      const { data, error: updateError } = await supabase
        .from('chapters')
        .update({ chapter_name: title, chapter_content: content })
        .eq('novel_id', novelId)
        .eq('chapter_id', chapterId)
        .select('chapter_id, chapter_name, chapter_content, chapter_content_summary, novel_id')
        .single()

      if (updateError) {
        error.value = updateError.message
        return { data: null, error: updateError.message }
      }

      chapters.value = chapters.value.map((chapter) =>
        chapter.chapter_id === chapterId && chapter.novel_id === novelId ? data : chapter,
      )

      console.log('Chapter updated successfully:', data)
      status_msg.value = 'Chapter updated successfully!'

      return { data, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to update chapter'

      error.value = message
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  /** Save a chapter summary and keep the shared chapter list in sync. */
  async function updateChapterSummary(chapterId: string, summary: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('chapters')
        .update({ chapter_content_summary: summary })
        .eq('chapter_id', chapterId)
        .select('chapter_id, chapter_name, chapter_content, chapter_content_summary, novel_id')
        .single()

      if (updateError) {
        error.value = updateError.message
        return { data: null, error: updateError.message }
      }

      chapters.value = chapters.value.map((chapter) =>
        chapter.chapter_id === chapterId ? data : chapter,
      )

      return { data, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to save chapter summary'

      error.value = message
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  /** Delete a chapter only when it belongs to the supplied novel. */
  async function deleteChapter(novelId: string, chapterId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: deleteError } = await supabase
        .from('chapters')
        .delete()
        .eq('novel_id', novelId)
        .eq('chapter_id', chapterId)
        .select('chapter_id, chapter_name, chapter_content, novel_id')
        .single()

      if (deleteError) {
        error.value = deleteError.message
        return { success: false, error: deleteError.message }
      }

      if (!data) {
        const message = 'Chapter does not belong to the supplied novel'
        error.value = message
        return { success: false, error: message }
      }

      chapters.value = chapters.value.filter(
        (chapter) => !(chapter.chapter_id === chapterId && chapter.novel_id === novelId),
      )

      return { success: true, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to delete chapter'

      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function getNovelDetails(novelId: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: queryError } = await supabase
        .from('novels')
        .select('*')
        .eq('novel_id', novelId)
        .single()

      if (queryError) {
        error.value = queryError.message
        return { data: null, error: queryError.message }
      }

      return { data, error: null }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : 'Failed to fetch novel details'

      error.value = message
      return { data: null, error: message }
    } finally {
      loading.value = false
    }
  }

  // Expose state for templates and functions for components to call.
  return {
    chapters,
    loading,
    status_msg,
    error,
    fetchChapters,
    createChapter,
    updateChapter,
    updateChapterSummary,
    deleteChapter,
    getNovelDetails,
  }
}
