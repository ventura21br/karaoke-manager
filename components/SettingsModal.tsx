import React from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onToggleTheme: () => void;
    onLogout?: () => void;
    onExport: () => void;
    onImport: (file: File) => void;
    isDark: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onToggleTheme, onLogout, onExport, onImport, isDark }) => {
    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImport(e.target.files[0]);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1e1e24] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/5 mx-auto transform transition-all scale-100 animate-scaleIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurações</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={onToggleTheme}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined filled">{isDark ? 'light_mode' : 'dark_mode'}</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">Tema Escuro</span>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors relative ${isDark ? 'bg-primary' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDark ? 'translate-x-[20px]' : ''}`} />
                        </div>
                    </button>

                    {/* Export */}
                    <button
                        onClick={onExport}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">download</span>
                        </div>
                        <div className="text-left">
                            <span className="block font-bold text-gray-900 dark:text-white leading-tight">Exportar Dados</span>
                            <span className="text-xs text-gray-500 font-medium">Salvar backup em CSV</span>
                        </div>
                    </button>

                    {/* Import */}
                    <div className="relative">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button
                            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                <span className="material-symbols-outlined">upload</span>
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-gray-900 dark:text-white leading-tight">Importar Dados</span>
                                <span className="text-xs text-gray-500 font-medium">Restaurar backup de CSV</span>
                            </div>
                        </button>
                    </div>

                    {/* Logout */}
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors mt-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined">logout</span>
                            </div>
                            <span className="font-bold text-red-600 dark:text-red-400">Sair da Conta</span>
                        </button>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">Versão 1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
