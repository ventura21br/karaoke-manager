import React, { useState, useEffect } from 'react';

const Modal: React.FC<{
    isOpen: boolean;
    config: { type: 'confirm' | 'prompt'; title: string; message?: string; defaultValue?: string; onConfirm: (val?: string) => void };
    onClose: () => void;
}> = ({ isOpen, config, onClose }) => {
    const [val, setVal] = useState(config.defaultValue || '');

    useEffect(() => { setVal(config.defaultValue || ''); }, [config.defaultValue, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#1e1e24] w-full max-w-xs sm:max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/5 transform transition-all scale-100 animate-scaleIn">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{config.title}</h3>
                {config.message && <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">{config.message}</p>}

                {config.type === 'prompt' && (
                    <input
                        autoFocus
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none mb-6 font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && config.onConfirm(val)}
                        placeholder="Digite aqui..."
                    />
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => config.onConfirm(config.type === 'prompt' ? val : undefined)}
                        className="flex-1 h-12 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
