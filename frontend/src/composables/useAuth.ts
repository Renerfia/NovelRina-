import { computed, ref } from 'vue'
import { createClient, type Session } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLIC_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

const session = ref<Session | null>(null)
const user = computed(() => session.value?.user ?? null)
const isLoggedIn = computed(() => user.value !== null)
const loading = ref(true)

supabase.auth.onAuthStateChange((_event, currentSession) => {
  session.value = currentSession
  loading.value = false
})

export function useAuth() {
  function signInWithEmail(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  function signUpWithEmail(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }

  function signOut() {
    return supabase.auth.signOut()
  }

  return {
    session,
    user,
    isLoggedIn,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}
