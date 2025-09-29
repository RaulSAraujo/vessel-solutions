export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser();

    // Se o usuário já estiver autenticado e tentar acessar a página de login/cadastro
    if (user.value?.aud !== 'authenticated') {
        return navigateTo('/') // Redireciona para a dashboard
    }
})