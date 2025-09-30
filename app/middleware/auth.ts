export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser();

    // Rotas públicas que não exigem autenticação
    const publicRoutes = ['/', '/auth/login', '/auth/register'];

    // Se o usuário não estiver logado e a rota não for pública
    if (!user.value && !publicRoutes.includes(to.path)) {
        return navigateTo('/auth/login');
    }

    // Se o usuário estiver logado e tentar acessar uma rota de autenticação ou a landing page
    if (user.value && publicRoutes.includes(to.path)) {
        return navigateTo('/dashboard'); // Redireciona para o dashboard
    }
});