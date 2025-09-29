export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser();

    // Se o usuário já estiver autenticado e tentar acessar a página de login/cadastro
    if (user.value?.aud === 'authenticated' && (to.path === '/')) {
        return navigateTo('/dashboard') // Redireciona para a dashboard
    }
})
