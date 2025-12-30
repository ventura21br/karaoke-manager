import React from 'react';
import { Song } from '../types';

const SongCard: React.FC<{
    song: Song;
    onSelect: () => void;
    onPlay: () => void;
    onToggleFavorite: (s: Song) => void;
}> = ({ song, onSelect, onPlay, onToggleFavorite }) => (
    <div
        className="group bg-card-light dark:bg-card-dark p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
    >
        <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(song); }}
            className="shrink-0 -ml-2 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors active:scale-90"
        >
            <span className={`material-symbols-outlined text-[26px] ${song.isFavorite ? 'filled text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>star</span>
        </button>
        <div className="flex-1 min-w-0 pr-4 pl-1" onClick={onSelect}>
            <h3 className="text-gray-900 dark:text-white font-bold text-[18px] leading-tight truncate">{song.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                <p className="text-gray-500 dark:text-gray-400 text-[14px] truncate font-medium">{song.artists.join(', ')}</p>
                <span className="h-1 w-1 shrink-0 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-primary/10 text-primary uppercase tracking-wider whitespace-nowrap">{song.styles[0]}</span>
            </div>
        </div>
        <button
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
            className="shrink-0 w-11 h-11 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transition-all active:scale-90"
        >
            <span className="material-symbols-outlined filled text-[24px]">play_arrow</span>
        </button>
    </div>
);

export default SongCard;
