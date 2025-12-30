import React, { useState } from 'react';

const TagInput: React.FC<{
    label: string;
    values: string[];
    suggestions: string[];
    onChange: (vals: string[]) => void;
    allowNew?: boolean;
}> = ({ label, values, suggestions, onChange, allowNew = true }) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(s =>
        s.toLowerCase().includes(inputValue.toLowerCase()) && !values.includes(s)
    );

    const addValue = (val: string) => {
        const trimmedVal = val.trim();
        if (!trimmedVal) return;

        let valToAdd = trimmedVal;

        if (!allowNew) {
            const match = suggestions.find(s => s.toLowerCase() === trimmedVal.toLowerCase());
            if (match) {
                valToAdd = match;
            } else {
                return;
            }
        }

        if (!values.includes(valToAdd)) {
            onChange([...values, valToAdd]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">{label}</label>
            <div className="flex flex-wrap gap-2 p-2 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-transparent rounded-xl focus-within:ring-2 focus-within:ring-primary min-h-[56px] relative">
                {values.map(v => (
                    <span key={v} className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                        {v}
                        <button onClick={() => onChange(values.filter(x => x !== v))} className="material-symbols-outlined text-[14px]">close</button>
                    </span>
                ))}
                <div className="relative flex-1 min-w-[120px]">
                    <input
                        value={inputValue}
                        onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addValue(inputValue); } }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full bg-transparent border-none focus:ring-0 p-1 text-sm outline-none text-gray-900 dark:text-white"
                        placeholder={allowNew ? "Digite e pressione Enter..." : "Selecione na lista..."}
                    />
                    {showSuggestions && (inputValue || filteredSuggestions.length > 0) && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto no-scrollbar">
                            {filteredSuggestions.map(s => (
                                <button key={s} onClick={() => addValue(s)} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm text-gray-900 dark:text-white">{s}</button>
                            ))}
                            {allowNew && inputValue && !suggestions.some(s => s.toLowerCase() === inputValue.toLowerCase()) && (
                                <button onClick={() => addValue(inputValue)} className="w-full text-left px-4 py-2 hover:bg-primary/10 text-sm italic text-gray-900 dark:text-white">Adicionar "{inputValue}"</button>
                            )}
                            {!allowNew && filteredSuggestions.length === 0 && inputValue && (
                                <div className="px-4 py-2 text-sm text-gray-500 italic">Nenhuma categoria encontrada</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagInput;
