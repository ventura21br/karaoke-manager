import React from 'react';

interface FolderListProps {
    items: string[];
    onSelect: (item: string) => void;
    icon?: string;
}

const FolderList: React.FC<FolderListProps> = ({ items, onSelect, icon = 'folder' }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 py-6">
            {items.sort((a, b) => a.localeCompare(b)).map(item => (
                <div
                    key={item}
                    className="relative group bg-card-light dark:bg-card-dark rounded-2xl border border-black/5 dark:border-white/5 shadow-sm overflow-hidden"
                >
                    <div
                        onClick={() => onSelect(item)}
                        className="w-full h-full flex items-center p-4 cursor-pointer active:bg-black/5 dark:active:bg-white/5 transition-colors gap-4"
                    >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                            <span className="material-symbols-outlined text-primary text-[28px] filled">{icon}</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-lg truncate flex-1 text-left">{item}</span>
                        <span className="material-symbols-outlined text-gray-400">chevron_right</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FolderList;
