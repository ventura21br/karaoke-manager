import React, { useState } from 'react';
import { ASSETS } from '../constants';

const AuthScreen: React.FC<{
    onAuth: (e: string, p: string, isRegister: boolean) => Promise<void>;
    authError: string;
    clearError: () => void;
    isLoading: boolean;
}> = ({ onAuth, authError, clearError, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAuth(email, password, isRegister);
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <div className="relative w-full h-[320px] shrink-0">
                <div className="absolute inset-0 bg-cover bg-center rounded-b-3xl" style={{ backgroundImage: `url("${ASSETS.WAVE_BG}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-black/40 rounded-b-3xl"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-primary text-[32px]">mic_external_on</span>
                        <span className="text-white/90 font-bold tracking-wider text-sm uppercase">Karaoke Manager</span>
                    </div>
                    <h1 className="text-white text-3xl font-bold leading-tight tracking-tight drop-shadow-lg">
                        {isRegister ? 'Criar Conta' : 'Bem-vindo de volta'}
                    </h1>
                </div>
            </div>
            <div className="flex-1 flex flex-col px-6 py-8 w-full max-md mx-auto">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {authError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {authError}
                        </div>
                    )}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-[#a69db9]">Email</label>
                        <input
                            className={`w-full bg-white dark:bg-[#2e2839] text-gray-900 dark:text-white rounded-xl border ${authError ? 'border-red-500' : 'border-gray-200 dark:border-transparent'} focus:border-primary focus:ring-2 focus:ring-primary h-14 px-4 transition-all outline-none`}
                            placeholder="seu@email.com"
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearError(); }}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-[#a69db9]">Senha</label>
                        <input
                            className={`w-full bg-white dark:bg-[#2e2839] text-gray-900 dark:text-white rounded-xl border ${authError ? 'border-red-500' : 'border-gray-200 dark:border-transparent'} focus:border-primary focus:ring-2 focus:ring-primary h-14 px-4 transition-all outline-none`}
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearError(); }}
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            isRegister ? 'Cadastrar' : 'Entrar'
                        )}
                    </button>
                </form>
                <div className="mt-8 text-center p-4">
                    <button
                        type="button"
                        onClick={() => { setIsRegister(!isRegister); clearError(); }}
                        className="text-primary font-bold hover:underline text-sm"
                    >
                        {isRegister ? 'Já tem uma conta? Entre' : 'Não tem conta? Cadastre-se'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
