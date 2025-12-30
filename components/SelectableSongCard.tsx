import React from 'react';
import { Song } from '../types';

const SelectableSongCard: React.FC<{ song: Song; isSelected: boolean; onToggle: () => void }> = ({ song, isSelected, onToggle }) => (
    <div
        onClick={onToggle}
        className={`group p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${isSelected
                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                : 'bg-card-light dark:bg-card-dark border-gray-100 dark:border-white/5'
            }`}
    >
        <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-gray-900 dark:text-white font-bold text-[16px] truncate">{song.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{song.artists.join(', ')}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
            }`}>
            {isSelected && <span className="material-symbols-outlined text-white text-[18px] font-bold">check</span>}
        </div>
    </div>
);

export default SelectableSongCard;
