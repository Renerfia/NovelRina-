import { computed, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

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
