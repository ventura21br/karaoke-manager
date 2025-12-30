import React from 'react';
import SearchBar from './SearchBar';

const Header: React.FC<{
    title: string;
    subtitle?: string;
    isSearching: boolean;
    onToggleSearch: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    onToggleTheme: () => void;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    onLogout?: () => void;
}> = ({ title, subtitle, isSearching, onToggleSearch, searchQuery, setSearchQuery, onToggleTheme, onBack, rightAction, onLogout }) => (
    <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-5 py-4 flex items-center justify-between min-h-[72px]">
        {isSearching ? (
            <SearchBar query={searchQuery} setQuery={setSearchQuery} onClose={onToggleSearch} />
        ) : (
            <>
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                            <span className="material-symbols-outlined text-[20px] text-gray-900 dark:text-white">arrow_back_ios_new</span>
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{title}</h1>
                        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {rightAction}
                    {onLogout && (
                        <button onClick={onLogout} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" title="Sair">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                        </button>
                    )}
                    <button onClick={onToggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">brightness_4</span>
                    </button>
                    <button onClick={onToggleSearch} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-[24px]">search</span>
                    </button>
                </div>
            </>
        )}
    </header>
);

export default Header;
