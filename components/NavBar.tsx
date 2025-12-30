
import React from 'react';
import { View } from '../types';

interface NavBarProps {
  currentView: View;
  onSetView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onSetView }) => {
  const tabs: { view: View; icon: string; label: string }[] = [
    { view: 'LIBRARY', icon: 'library_music', label: 'Músicas' },
    { view: 'ARTISTS', icon: 'person', label: 'Artistas' },
    { view: 'STYLES', icon: 'theater_comedy', label: 'Estilo' },
    { view: 'CATEGORIES', icon: 'folder', label: 'Categorias' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-light dark:bg-surface-dark border-t border-black/5 dark:border-white/5 pb-6 pt-2 px-4 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.view}
            onClick={() => onSetView(tab.view)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 p-2 transition-colors ${
              currentView === tab.view ? 'text-primary' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className={`material-symbols-outlined text-[26px] ${currentView === tab.view ? 'filled' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
