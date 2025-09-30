// stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        loading: false,
        error: null as string | null,
    }),
    actions: {
        setUser(user: User | null) {
            this.user = user;
        },
        async login(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                this.user = data.user;
                return true;
            } catch (e: any) {
                this.error = e.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(email: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const supabase = useSupabaseClient();
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                // Supabase pode exigir confirmação de e-mail, então o user pode não estar logado imediatamente
                // this.user = data.user;
                return true;
            } catch (e: any) {
                this.error = e.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            this.loading = true;
            this.error = null;
            try {
                const supabase = useSupabaseClient();
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                this.user = null;
                return true;
            } catch (e: any) {
                this.error = e.message;
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});