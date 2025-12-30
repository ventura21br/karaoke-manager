import React, { useState } from 'react';
import { Song } from '../types';
import TagInput from './TagInput';

const AddSongScreen: React.FC<{
    onCancel: () => void;
    onSave: (song: Partial<Song>) => void;
    existingArtists: string[];
    existingStyles: string[];
    existingCategories: string[];
    defaultCategories?: string[];
    editingSong?: Song | null;
}> = ({ onCancel, onSave, existingArtists, existingStyles, existingCategories, defaultCategories = [], editingSong }) => {
    const [formData, setFormData] = useState({
        title: editingSong?.title || '',
        artists: editingSong?.artists || [] as string[],
        styles: editingSong?.styles || [] as string[],
        categories: editingSong?.categories || defaultCategories as string[],
        youtubeUrl: editingSong?.youtubeUrl || '',
        isFavorite: editingSong?.isFavorite || false
    });

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col w-full max-w-lg mx-auto">
            <header className="sticky top-0 z-20 bg-background-light dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center justify-between">
                <button onClick={onCancel} className="text-primary text-base font-medium px-2 py-1">Cancelar</button>
                <h1 className="text-lg font-bold flex-1 text-center text-gray-900 dark:text-white">
                    {editingSong ? 'Editar Música' : 'Nova Música'}
                </h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors active:scale-95"
                    >
                        <span className={`material-symbols-outlined text-[28px] ${formData.isFavorite ? 'filled text-yellow-400' : 'text-gray-400'}`}>star</span>
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={!formData.title || formData.artists.length === 0}
                        className="text-base font-bold px-2 py-1 text-primary disabled:opacity-50"
                    >
                        Salvar
                    </button>
                </div>
            </header>
            <main className="flex-1 p-4 pb-32 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">Link do YouTube</label>
                    <div className="relative">
                        <input
                            value={formData.youtubeUrl}
                            onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            className="w-full h-14 pl-4 pr-12 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                            placeholder="URL do vídeo..."
                        />
                        <button
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    setFormData(prev => ({ ...prev, youtubeUrl: text }));
                                } catch (e) {
                                    console.error('Clipboard error', e);
                                    alert('Não foi possível colar automaticamente. Verifique as permissões ou cole manualmente.');
                                }
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Colar da área de transferência"
                        >
                            <span className="material-symbols-outlined">content_paste</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">Título da Música</label>
                    <input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full h-14 px-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-transparent outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
                        placeholder="ex: Evidências"
                    />
                </div>
                <TagInput
                    label="Artistas"
                    values={formData.artists}
                    suggestions={existingArtists}
                    onChange={(vals) => setFormData({ ...formData, artists: vals })}
                />
                <TagInput
                    label="Estilos"
                    values={formData.styles}
                    suggestions={existingStyles}
                    onChange={(vals) => setFormData({ ...formData, styles: vals })}
                />
                <TagInput
                    label="Categorias"
                    values={formData.categories}
                    suggestions={existingCategories}
                    onChange={(vals) => setFormData({ ...formData, categories: vals })}
                    allowNew={false}
                />
            </main>
        </div>
    );
};

export default AddSongScreen;
