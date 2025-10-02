import type { FetchError } from 'ofetch'

export function useAuthApi() {
    const loading = ref(false);
    const errorMessage = ref<string | null>(null);

    async function login(email: string, password: string) {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) throw error;

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;

            errorMessage.value = err.message;

            return false;
        } finally {
            loading.value = false;
        }
    }

    async function loginWithGoogle() {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

            if (error) throw error;

            console.log(data)

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;

            errorMessage.value = err.message;

            return false;
        } finally {
            loading.value = false;
        }
    }

    async function register(email: string, password: string) {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            const { error } = await supabase.auth.signUp({ email, password });

            if (error) throw error;

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;

            errorMessage.value = err.message;

            return false;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        try {
            loading.value = true;
            errorMessage.value = null;

            const supabase = useSupabaseClient();

            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;

            errorMessage.value = err.message;

            return false;
        } finally {
            loading.value = false;
        }
    }

    return {
        loading,
        errorMessage,
        login,
        loginWithGoogle,
        register,
        logout
    }
}