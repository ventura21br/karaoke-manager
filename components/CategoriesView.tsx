import React from 'react';
import { Category } from '../types';

const CategoriesView: React.FC<{
    categories: Category[];
    onSelectCategory: (cat: string) => void;
    onEditCategory: (cat: Category) => void;
    onDeleteCategory: (cat: Category) => void;
}> = ({ categories, onSelectCategory, onEditCategory, onDeleteCategory }) => (
    <div className="grid grid-cols-2 gap-4 px-5 py-6">
        {/* Fixed Favorites Category Card */}
        <div
            className="relative group bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 shadow-sm overflow-hidden"
        >
            <div
                onClick={() => onSelectCategory('Favoritas')}
                className="w-full flex flex-col items-center justify-center p-6 cursor-pointer active:bg-yellow-100 dark:active:bg-yellow-900/20 transition-colors h-full"
            >
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center mb-4 transition-colors">
                    <span className="material-symbols-outlined text-yellow-500 text-[40px] filled">star</span>
                </div>
                <span className="text-gray-900 dark:text-white font-bold text-center truncate w-full px-2">Favoritas</span>
            </div>
        </div>

        {categories.sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
            <div
                key={cat.id}
                className="relative group bg-card-light dark:bg-card-dark rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
            >
                <div
                    onClick={() => onSelectCategory(cat.name)}
                    className="w-full flex flex-col items-center justify-center p-6 cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors"
                >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                        <span className="material-symbols-outlined text-primary text-[40px] filled">folder</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold text-center truncate w-full px-2">{cat.name}</span>
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-2 z-50 pointer-events-auto">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(cat);
                        }}
                        className="w-10 h-10 rounded-full bg-white dark:bg-[#2a223a] flex items-center justify-center text-primary shadow-lg border border-gray-100 dark:border-white/10 active:scale-90 transition-transform hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(cat);
                        }}
                        className="w-10 h-10 rounded-full bg-white dark:bg-[#2a223a] flex items-center justify-center text-red-500 shadow-lg border border-gray-100 dark:border-white/10 active:scale-90 transition-transform hover:scale-105"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </div>
        ))}
    </div>
);

export default CategoriesView;
