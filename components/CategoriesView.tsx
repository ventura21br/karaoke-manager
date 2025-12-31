import React from 'react';
import { Category } from '../types';

const CategoriesView: React.FC<{
    categories: Category[];
    onSelectCategory: (cat: string) => void;
    onEditCategory: (cat: Category) => void;
    onDeleteCategory: (cat: Category) => void;
}> = ({ categories, onSelectCategory, onEditCategory, onDeleteCategory }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 py-6">
        {/* Fixed Favorites Category Card */}
        <div
            className="relative group bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 shadow-sm overflow-hidden"
        >
            <div
                onClick={() => onSelectCategory('Favoritas')}
                className="w-full h-full flex items-center p-4 cursor-pointer active:bg-yellow-100 dark:active:bg-yellow-900/20 transition-colors gap-4"
            >
                <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center shrink-0 transition-colors">
                    <span className="material-symbols-outlined text-yellow-500 text-[28px] filled">star</span>
                </div>
                <span className="text-gray-900 dark:text-white font-bold text-lg truncate flex-1 px-2">Favoritas</span>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
            </div>
        </div>

        {categories.sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
            <div
                key={cat.id}
                className="relative group bg-card-light dark:bg-card-dark rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
            >
                <div
                    onClick={() => onSelectCategory(cat.name)}
                    className="w-full h-full flex items-center p-4 cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors gap-4"
                >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                        <span className="material-symbols-outlined text-primary text-[28px] filled">folder</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold text-lg truncate flex-1 px-2">{cat.name}</span>
                    <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-2 flex gap-2 z-50 pointer-events-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-background-light dark:bg-background-dark p-1 rounded-full shadow-md">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(cat);
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-black/5 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(cat);
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </div>
        ))}
    </div>
);

export default CategoriesView;
