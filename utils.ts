export const translateAuthError = (error: string) => {
    const msg = error.toLowerCase();
    if (msg.includes('invalid login credentials')) return 'Email não encontrado ou senha incorreta.';
    if (msg.includes('email not confirmed')) return 'Email não confirmado. Verifique sua caixa de entrada.';
    if (msg.includes('security purposes') || msg.includes('rate limit')) return 'Muitas tentativas. Aguarde um minuto e tente novamente.';
    if (msg.includes('user already registered')) return 'Email já cadastrado. Tente fazer login.';
    if (msg.includes('password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('anonymous')) return 'Erro de acesso anônimo.';
    return 'Ocorreu um erro ao conectar. Tente novamente.';
};

export const openYouTubeSearch = (term: string) => {
    const query = encodeURIComponent(`Karaokê ${term}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
};

// --- CSV Handlers ---

export const exportToCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const header = Object.keys(data[0]);
    const csvContent = [
        header.join(','),
        ...data.map(row => header.map(fieldName => {
            let val = row[fieldName];
            if (Array.isArray(val)) val = val.join('|'); // Array to pipe-separated string
            if (typeof val === 'string') {
                val = val.replace(/"/g, '""'); // Escape double quotes
                if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`; // Quote if needed
            }
            return val;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values: string[] = [];
        let currentVal = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    currentVal += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(currentVal);
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        values.push(currentVal);

        const obj: any = {};
        headers.forEach((h, index) => {
            let val = values[index]?.trim();
            // Try to infer arrays (simple heuristic: if header is plural or known array fields)
            if (['artists', 'styles', 'categories'].includes(h)) {
                obj[h] = val ? val.split('|').map(s => s.trim()) : [];
            } else if (h === 'isFavorite' || h === 'is_favorite') {
                obj[h] = val === 'true';
            } else {
                obj[h] = val;
            }
        });
        return obj;
    });
};
