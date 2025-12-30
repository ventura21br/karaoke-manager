import React from 'react';

const SearchBar: React.FC<{ query: string; setQuery: (q: string) => void; onClose: () => void; placeholder?: string }> = ({ query, setQuery, onClose, placeholder }) => (
  <div className="flex items-center gap-2 w-full px-2">
    <div className="relative flex-1">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-white/10 rounded-full border-none focus:ring-2 focus:ring-primary text-sm outline-none text-gray-900 dark:text-white"
        placeholder={placeholder || "Buscar música, artista..."}
      />
    </div>
    <button onClick={onClose} className="text-sm font-bold text-primary px-2">Fechar</button>
  </div>
);

export default SearchBar;
