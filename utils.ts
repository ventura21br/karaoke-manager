export const translateAuthError = (error: string) => {
    const msg = error.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'Email não encontrado ou senha incorreta.';
    if (msg.includes('email not confirmed')) return 'Email não confirmado. Verifique sua caixa de entrada.';
    if (msg.includes('security purposes') || msg.includes('rate limit')) return 'Muitas tentativas. Aguarde um minuto e tente novamente.';
    if (msg.includes('user already registered')) return 'Email já cadastrado. Tente fazer login.';
    if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('anonymous')) return 'Erro de acesso anônimo.';
    return 'Ocorreu um erro ao conectar. Tente novamente.';
};

export const openYouTubeSearch = (term: string) => {
    const query = encodeURIComponent(`Karaokê ${term}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
};
