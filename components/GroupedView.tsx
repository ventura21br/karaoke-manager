import React from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import { openYouTubeSearch } from '../utils';

const GroupedView: React.FC<{
    grouped: Map<string, Song[]>;
    onSelectSong: (s: Song) => void;
    onPlaySong: (s: Song) => void;
    onToggleFavorite: (s: Song) => void;
}> = ({ grouped, onSelectSong, onPlaySong, onToggleFavorite }) => {
    const sortedKeys: string[] = (Array.from(grouped.keys()) as string[]).sort();

    return (
        <div className="px-5 py-4 space-y-8">
            {sortedKeys.map(key => (
                <div key={key} className="space-y-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => openYouTubeSearch(key)}
                            className="group flex items-center gap-2 text-left"
                        >
                            <h2 className="text-primary font-bold text-lg uppercase tracking-widest group-hover:underline">{key}</h2>
                            <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                        </button>
                        <div className="flex-1 h-px bg-primary/20"></div>
                    </div>
                    <div className="space-y-3">
                        {grouped.get(key)!.sort((a, b) => a.title.localeCompare(b.title)).map(song => (
                            <SongCard key={song.id} song={song} onSelect={() => onSelectSong(song)} onPlay={() => onPlaySong(song)} onToggleFavorite={onToggleFavorite} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupedView;
