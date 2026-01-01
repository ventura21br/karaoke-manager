
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Song, View, Category } from './types';
import { INITIAL_SONGS, ASSETS } from './constants';
import NavBar from './components/NavBar';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SongCard from './components/SongCard';
import SelectableSongCard from './components/SelectableSongCard';
import Modal from './components/Modal';
import TagInput from './components/TagInput';
import LoadingOverlay from './components/LoadingOverlay';
import AuthScreen from './components/AuthScreen';
import CategoriesView from './components/CategoriesView';
import GroupedView from './components/GroupedView';
import AddSongScreen from './components/AddSongScreen';
import FolderList from './components/FolderList';
import SettingsModal from './components/SettingsModal';
import { translateAuthError, openYouTubeSearch, exportToCSV, parseCSV } from './utils';

// --- Supabase Initialization ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [view, setView] = useState<View>('LIBRARY');
  const [songs, setSongs] = useState<Song[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null); // New State
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);   // New State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [pickerSelectedIds, setPickerSelectedIds] = useState<Set<string>>(new Set());

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ type: 'confirm' | 'prompt'; title: string; message?: string; defaultValue?: string; onConfirm: (val?: string) => void }>({
    type: 'confirm',
    title: '',
    onConfirm: () => { }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (!session) {
        setSongs([]);
        setCategories([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSongs = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.from('songs').select('*').eq('user_id', session.user.id).order('title', { ascending: true });
      if (error) throw error;
      if (data) {
        setSongs((data as any[]).map((d: any) => ({
          id: d.id,
          title: d.title,
          artists: (d.artists || []) as string[],
          duration: d.duration,
          styles: (d.styles || []) as string[],
          categories: (d.categories || []) as string[],
          thumbnail: d.thumbnail,
          isFavorite: d.is_favorite,
          addedDate: d.added_date,
          key: d.key,
          youtubeUrl: d.youtube_url
        })));
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      // Optional: keep INITIAL_SONGS if offline or empty? 
      // if (songs.length === 0) setSongs(INITIAL_SONGS);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.from('categories').select('*').eq('user_id', session.user.id).order('name', { ascending: true });
      if (error) throw error;
      if (data) setCategories(data as Category[]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  const initData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSongs(), fetchCategories()]);
    } catch (e) {
      console.error("Initialization error", e);
    } finally {
      setLoading(false);
    }
  }, [fetchSongs, fetchCategories]);

  useEffect(() => {
    if (isLoggedIn) initData();
  }, [isLoggedIn, initData]);

  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artists.some(a => a.toLowerCase().includes(q)) ||
      s.styles.some(st => st.toLowerCase().includes(q)) ||
      s.categories.some(t => t.toLowerCase().includes(q))
    ).sort((a, b) => a.title.localeCompare(b.title));
  }, [songs, searchQuery]);

  const existingArtists = useMemo(() => Array.from(new Set(songs.flatMap(s => s.artists))) as string[], [songs]);
  const existingStyles = useMemo(() => Array.from(new Set(songs.flatMap(s => s.styles))) as string[], [songs]);
  const existingCategoriesStrings = useMemo(() => categories.map(c => c.name), [categories]);

  const relatedSongs = useMemo(() => {
    if (!selectedSong) return [];
    return songs.filter(s =>
      s.id !== selectedSong.id && (
        s.styles.some(style => selectedSong.styles.includes(style)) ||
        s.categories.some(tag => selectedSong.categories.includes(tag))
      )
    ).slice(0, 5);
  }, [songs, selectedSong]);

  const songsInCategory = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory === 'Favoritas') {
      return filteredSongs.filter(s => s.isFavorite);
    }
    return filteredSongs.filter(s => s.categories.includes(selectedCategory as string));
  }, [filteredSongs, selectedCategory]);

  const songsInArtist = useMemo(() => {
    if (!selectedArtist) return [];
    return filteredSongs.filter(s => s.artists.includes(selectedArtist));
  }, [filteredSongs, selectedArtist]);

  const songsInStyle = useMemo(() => {
    if (!selectedStyle) return [];
    return filteredSongs.filter(s => s.styles.includes(selectedStyle));
  }, [filteredSongs, selectedStyle]);

  const handleToggleFavorite = async (song: Song) => {
    const newVal = !song.isFavorite;
    // Otimista
    setSongs(prev => prev.map(s => s.id === song.id ? { ...s, isFavorite: newVal } : s));
    if (selectedSong?.id === song.id) {
      setSelectedSong(prev => prev ? { ...prev, isFavorite: newVal } : null);
    }

    try {
      const { error } = await supabase.from('songs').update({ is_favorite: newVal }).eq('id', song.id);
      if (error) throw error;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert on error
      setSongs(prev => prev.map(s => s.id === song.id ? { ...s, isFavorite: !newVal } : s));
      if (selectedSong?.id === song.id) {
        setSelectedSong(prev => prev ? { ...prev, isFavorite: !newVal } : null);
      }
      alert('Erro ao atualizar favoritos.');
    }
  };

  const handleSaveSong = async (songData: Partial<Song>) => {
    setLoading(true);
    try {
      const songId = editingSong?.id || Math.random().toString(36).substr(2, 9);
      const dbSong = {
        id: songId,
        title: songData.title,
        artists: songData.artists,
        duration: songData.duration || '4:00',
        styles: songData.styles,
        categories: songData.categories || [],
        thumbnail: songData.thumbnail || `https://picsum.photos/400/400?sig=${songId}`,
        is_favorite: songData.isFavorite ?? false,
        added_date: songData.addedDate || new Date().toLocaleDateString('pt-BR'),
        youtube_url: songData.youtubeUrl,
        key: songData.key,
        user_id: (await supabase.auth.getUser()).data.user?.id
      };
      const { error } = await supabase.from('songs').upsert(dbSong);
      if (error) throw error;
      await fetchSongs();
      setEditingSong(null);
      // Return to appropriate view
      if (selectedSong) setView('SONG_DETAILS');
      else if (selectedCategory) setView('CATEGORIES');
      else if (selectedArtist) setView('ARTISTS');
      else if (selectedStyle) setView('STYLES');
      else setView('LIBRARY');
    } catch (err) {
      console.error('Error saving song:', err);
      alert('Erro ao salvar música.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = (song: Song) => {
    setModalConfig({
      type: 'confirm',
      title: 'Excluir Música',
      message: `Tem certeza que deseja excluir "${song.title}"?`,
      onConfirm: async () => {
        setModalOpen(false);
        setLoading(true);
        try {
          const { error } = await supabase.from('songs').delete().eq('id', song.id);
          if (error) throw error;
          setSongs(prev => prev.filter(s => s.id !== song.id));
          setSelectedSong(null);
          setView('LIBRARY');
        } catch (err) {
          console.error('Error deleting song:', err);
          alert('Erro ao excluir música.');
        } finally {
          setLoading(false);
        }
      }
    });
    setModalOpen(true);
  };

  const handleUpdateCategorySongs = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const updates = songs.map(async s => {
        const isPick = pickerSelectedIds.has(s.id);
        const hasCat = s.categories.includes(selectedCategory as string);
        let newCategories = [...s.categories];
        if (isPick && !hasCat) newCategories.push(selectedCategory as string);
        else if (!isPick && hasCat) newCategories = newCategories.filter(c => c !== (selectedCategory as string));
        else return null;
        return supabase.from('songs').update({ categories: newCategories }).eq('id', s.id);
      });
      await Promise.all(updates);
      await fetchSongs();
      setView('CATEGORIES');
    } catch (err) {
      console.error('Error batch updating categories:', err);
      alert('Erro ao atualizar músicas da categoria.');
    } finally {
      setLoading(false);
    }
  };

  // --- Category Handlers with Modal ---

  const handleAddCategory = () => {
    setModalConfig({
      type: 'prompt',
      title: 'Nova Categoria',
      message: 'Digite o nome da categoria:',
      onConfirm: async (name) => {
        if (!name || !name.trim()) return;
        setModalOpen(false);
        setLoading(true);
        try {

          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('Usuário não autenticado');
          const { error } = await supabase.from('categories').insert({ name: name.trim(), user_id: user.id });
          if (error) throw error;
          await fetchCategories();
        } catch (err: any) {
          console.error(err);
          alert(err.code === '23505' ? 'Categoria já existe.' : 'Erro ao criar categoria.');
        } finally {
          setLoading(false);
        }
      }
    });
    setModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setModalConfig({
      type: 'prompt',
      title: 'Editar Categoria',
      defaultValue: cat.name,
      message: `Renomear "${cat.name}" para:`,
      onConfirm: async (newName) => {
        if (!newName || !newName.trim() || newName.trim() === cat.name) {
          setModalOpen(false);
          return;
        }
        setModalOpen(false);
        setLoading(true);
        try {
          const cleanNewName = newName.trim();
          const { error } = await supabase.from('categories').update({ name: cleanNewName }).eq('id', cat.id);
          if (error) throw error;
          const affectedSongs = songs.filter(s => s.categories.includes(cat.name));
          await Promise.all(affectedSongs.map(s => {
            const newCats = s.categories.map(c => c === cat.name ? cleanNewName : c);
            return supabase.from('songs').update({ categories: newCats }).eq('id', s.id);
          }));
          await Promise.all([fetchCategories(), fetchSongs()]);
        } catch (err) {
          console.error(err);
          alert('Erro ao renomear categoria.');
        } finally {
          setLoading(false);
        }
      }
    });
    setModalOpen(true);
  };

  const handleDeleteCategory = (cat: Category) => {
    setModalConfig({
      type: 'confirm',
      title: 'Excluir Categoria',
      message: `Tem certeza que deseja excluir "${cat.name}"? As músicas não serão apagadas.`,
      onConfirm: async () => {
        setModalOpen(false);
        setLoading(true);
        try {
          const { error } = await supabase.from('categories').delete().eq('id', cat.id);
          if (error) throw error;
          const affectedSongs = songs.filter(s => s.categories.includes(cat.name));
          await Promise.all(affectedSongs.map(s => {
            const newCats = s.categories.filter(c => c !== cat.name);
            return supabase.from('songs').update({ categories: newCats }).eq('id', s.id);
          }));
          await Promise.all([fetchCategories(), fetchSongs()]);
        } catch (err) {
          console.error(err);
          alert('Erro ao excluir categoria.');
        } finally {
          setLoading(false);
        }
      }
    });
    setModalOpen(true);
  };

  const handlePlaySong = (song: Song) => song.youtubeUrl && window.open(song.youtubeUrl, '_blank');

  const openSongPicker = () => {
    if (!selectedCategory) return;
    setPickerSelectedIds(new Set(songs.filter(s => s.categories.includes(selectedCategory as string)).map(s => s.id)));
    setSearchQuery('');
    setView('SELECT_SONGS_FOR_CATEGORY');
  };

  const handleAuth = async (email: string, pass: string, isRegister: boolean) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;

        if (data.user && !data.session) {
          alert('Cadastro realizado! Um link de confirmação foi enviado para o seu email. Confirme antes de fazer login.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(translateAuthError(err.message || ''));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setModalConfig({
      type: 'confirm',
      title: 'Sair',
      message: 'Tem certeza que deseja sair do aplicativo?',
      onConfirm: async () => {
        setModalOpen(false);
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setAuthError('');
        setSelectedSong(null);
        setSelectedCategory(null);
        setSelectedArtist(null);
        setSelectedStyle(null);
        setView('LIBRARY');
        setSettingsOpen(false); // Close settings
      }
    });
    setModalOpen(true);
  };

  const handleExport = () => {
    if (!songs.length) return alert('Não há músicas para exportar.');
    exportToCSV(songs, `karaoke-backup-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleImport = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) throw new Error('Falha ao ler arquivo.');
        const data = parseCSV(text);
        if (!data.length) throw new Error('Nenhum dado encontrado no CSV.');

        // Validate minimum fields
        if (!data[0].id || !data[0].title) throw new Error('CSV inválido. Campos id e title são obrigatórios.');

        const formatted = data.map(d => ({
          id: d.id,
          title: d.title,
          artists: d.artists || [],
          styles: d.styles || [],
          categories: d.categories || [],
          duration: d.duration || '4:00',
          thumbnail: d.thumbnail || `https://picsum.photos/400/400?sig=${d.id}`,
          is_favorite: d.isFavorite || d.is_favorite || false,
          added_date: d.addedDate || d.added_date || new Date().toISOString(),
          youtube_url: d.youtubeUrl || d.youtube_url,
          key: d.key,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }));

        // Merging Strategy:
        // 1. Map existing DB songs by URL to find matches.
        // 2. Map current batch URLs to ensure consistency within the import file.
        // 3. If URL matches, force ID to match existing/seen ID.

        const existingUrlMap = new Map(songs.map(s => [s.youtubeUrl, s.id]));
        const batchUrlMap = new Map<string, string>();

        formatted.forEach(song => {
          const url = song.youtube_url;
          if (url) {
            // Check against DB
            if (existingUrlMap.has(url)) {
              song.id = existingUrlMap.get(url)!;
            }
            // Check against batch (dedup duplicates within CSV)
            else if (batchUrlMap.has(url)) {
              song.id = batchUrlMap.get(url)!;
            } else {
              batchUrlMap.set(url, song.id);
            }
          }
        });

        // Deduplicate by ID (final ensure for upsert)
        const uniqueSongsMap = new Map();
        formatted.forEach(song => {
          uniqueSongsMap.set(song.id, song);
        });
        const uniqueSongs = Array.from(uniqueSongsMap.values());

        // Upsert songs
        const { error } = await supabase.from('songs').upsert(uniqueSongs);
        if (error) throw error;

        alert(`${uniqueSongs.length} músicas processadas/importadas com sucesso!`);
        await fetchSongs();
        setSettingsOpen(false);
      } catch (err: any) {
        console.error(err);
        alert(`Erro na importação: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSetView = (v: View) => {
    // If clicking the current active view, reset its specific selection
    if (v === view) {
      if (v === 'CATEGORIES') setSelectedCategory(null);
      if (v === 'ARTISTS') setSelectedArtist(null);
      if (v === 'STYLES') setSelectedStyle(null);
    }

    setView(v);
    // Be explicit about clearing states depending on the target view
    if (v !== 'CATEGORIES') setSelectedCategory(null);
    if (v !== 'ARTISTS') setSelectedArtist(null);
    if (v !== 'STYLES') setSelectedStyle(null);
    if (v !== 'SONG_DETAILS') setSelectedSong(null);

    setIsSearching(false);
    setSearchQuery('');
    setEditingSong(null);
  }

  if (!isLoggedIn) return <AuthScreen onAuth={handleAuth} authError={authError} clearError={() => setAuthError('')} isLoading={authLoading} />;

  const renderContent = () => {
    if (songs.length === 0 && !loading && view !== 'ADD_SONG' && view !== 'CATEGORIES') {
      return (
        <main className="flex-1 flex flex-col items-center justify-center px-6 min-h-[80vh]">
          <span className="material-symbols-outlined text-primary text-[80px] animate-pulse mb-4">mic_external_on</span>
          <h2 className="text-2xl font-bold mb-2">Sua lista está vazia</h2>
          <button onClick={() => setView('ADD_SONG')} className="bg-primary text-white h-14 px-8 rounded-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">add_circle</span> Adicionar Música
          </button>
        </main>
      );
    }

    switch (view) {
      case 'LIBRARY':
        return (
          <div className="flex flex-col min-h-screen pb-32">
            <Header
              title="Músicas"
              subtitle={`${filteredSongs.length} disponíveis`}
              isSearching={isSearching}
              onToggleSearch={() => setIsSearching(!isSearching)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSettings={() => setSettingsOpen(true)}
              onLogout={handleLogout}
            />
            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSongs.map(song => (
                <SongCard key={song.id} song={song} onSelect={() => { setSelectedSong(song); setView('SONG_DETAILS'); }} onPlay={() => handlePlaySong(song)} onToggleFavorite={handleToggleFavorite} />
              ))}
            </div>
            <button onClick={() => { setEditingSong(null); setView('ADD_SONG'); }} className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-[70] transition-transform active:scale-95 hover:scale-105">
              <span className="material-symbols-outlined text-[36px]">add</span>
            </button>
          </div>
        );
      case 'ARTISTS':
        if (selectedArtist) {
          return (
            <div className="flex flex-col min-h-screen pb-32">
              <Header
                title={selectedArtist}
                isSearching={isSearching}
                onToggleSearch={() => setIsSearching(!isSearching)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSettings={() => setSettingsOpen(true)}
                onBack={() => setSelectedArtist(null)}
              />
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {songsInArtist.length > 0 ? (
                  songsInArtist.map(song => (
                    <SongCard key={song.id} song={song} onSelect={() => { setSelectedSong(song); setView('SONG_DETAILS'); }} onPlay={() => handlePlaySong(song)} onToggleFavorite={handleToggleFavorite} />
                  ))
                ) : (
                  <div className="py-20 text-center flex flex-col items-center col-span-full">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">folder_open</span>
                    <p className="text-gray-500 font-medium">Nenhuma música deste artista.</p>
                  </div>
                )}
              </div>
            </div>
          )
        }
        return (
          <div className="flex flex-col min-h-screen pb-32">
            <Header
              title="Artistas"
              subtitle={`${existingArtists.length} encontrados`}
              isSearching={isSearching}
              onToggleSearch={() => setIsSearching(!isSearching)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSettings={() => setSettingsOpen(true)}
              onLogout={handleLogout}
            />
            <FolderList
              items={existingArtists.filter(a => a.toLowerCase().includes(searchQuery.toLowerCase()))}
              onSelect={(artist) => setSelectedArtist(artist)}
              icon="mic"
            />
          </div>
        );
      case 'STYLES':
        if (selectedStyle) {
          return (
            <div className="flex flex-col min-h-screen pb-32">
              <Header
                title={selectedStyle}
                isSearching={isSearching}
                onToggleSearch={() => setIsSearching(!isSearching)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSettings={() => setSettingsOpen(true)}
                onBack={() => setSelectedStyle(null)}
              />
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {songsInStyle.length > 0 ? (
                  songsInStyle.map(song => (
                    <SongCard key={song.id} song={song} onSelect={() => { setSelectedSong(song); setView('SONG_DETAILS'); }} onPlay={() => handlePlaySong(song)} onToggleFavorite={handleToggleFavorite} />
                  ))
                ) : (
                  <div className="py-20 text-center flex flex-col items-center col-span-full">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">music_note</span>
                    <p className="text-gray-500 font-medium">Nenhuma música deste estilo.</p>
                  </div>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col min-h-screen pb-32">
            <Header
              title="Estilos"
              subtitle={`${existingStyles.length} encontrados`}
              isSearching={isSearching}
              onToggleSearch={() => setIsSearching(!isSearching)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSettings={() => setSettingsOpen(true)}
              onLogout={handleLogout}
            />
            <FolderList
              items={existingStyles.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))}
              onSelect={(style) => setSelectedStyle(style)}
              icon="music_note"
            />
          </div>
        );
      case 'CATEGORIES':
        if (selectedCategory) {
          return (
            <div className="flex flex-col min-h-screen pb-32">
              <Header title={selectedCategory} isSearching={isSearching} onToggleSearch={() => setIsSearching(!isSearching)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSettings={() => setSettingsOpen(true)} onBack={() => setSelectedCategory(null)} />
              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {songsInCategory.length > 0 ? (
                  songsInCategory.map(song => (
                    <SongCard key={song.id} song={song} onSelect={() => { setSelectedSong(song); setView('SONG_DETAILS'); }} onPlay={() => handlePlaySong(song)} onToggleFavorite={handleToggleFavorite} />
                  ))
                ) : (
                  <div className="py-20 text-center flex flex-col items-center col-span-full">
                    <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">folder_open</span>
                    <p className="text-gray-500 font-medium">Nenhuma música nesta categoria.</p>
                  </div>
                )}
              </div>
              {selectedCategory !== 'Favoritas' && (
                <button onClick={openSongPicker} className="fixed bottom-24 right-6 bg-primary text-white h-16 px-8 rounded-full shadow-2xl flex items-center gap-2 z-[70] transition-transform active:scale-95 hover:scale-105">
                  <span className="material-symbols-outlined text-[28px]">playlist_add</span>
                  <span className="font-bold">Gerenciar músicas</span>
                </button>
              )}
            </div>
          );
        }
        return (
          <div className="flex flex-col min-h-screen pb-32">
            <Header
              title="Categorias"
              subtitle={`${categories.length} criadas`}
              isSearching={isSearching}
              onToggleSearch={() => setIsSearching(!isSearching)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSettings={() => setSettingsOpen(true)}
              onLogout={handleLogout}
            />
            <div className="pb-10">
              <CategoriesView
                categories={categories}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-[70] transition-transform active:scale-95 hover:scale-105"
            >
              <span className="material-symbols-outlined text-[36px]">create_new_folder</span>
            </button>
          </div>
        );
      case 'SELECT_SONGS_FOR_CATEGORY':
        return (
          <div className="flex flex-col min-h-screen">
            <Header
              title="Gerenciar Músicas"
              subtitle={selectedCategory || ''}
              isSearching={isSearching}
              onToggleSearch={() => setIsSearching(!isSearching)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSettings={() => setSettingsOpen(true)}
              onBack={() => setView('CATEGORIES')}
              rightAction={
                <button onClick={handleUpdateCategorySongs} className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md">
                  Concluir
                </button>
              }
            />
            <div className="px-5 py-4 flex-1 overflow-y-auto no-scrollbar pb-32">
              <div className="space-y-3">
                {filteredSongs.map(song => (
                  <SelectableSongCard
                    key={song.id}
                    song={song}
                    isSelected={pickerSelectedIds.has(song.id)}
                    onToggle={() => {
                      const newSet = new Set(pickerSelectedIds);
                      if (newSet.has(song.id)) newSet.delete(song.id);
                      else newSet.add(song.id);
                      setPickerSelectedIds(newSet);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 'ADD_SONG':
        return <AddSongScreen
          onCancel={() => {
            setEditingSong(null);
            // Return to context-aware previous view
            if (selectedArtist) setView('ARTISTS');
            else if (selectedStyle) setView('STYLES');
            else setView(selectedCategory ? 'CATEGORIES' : 'LIBRARY');
          }}
          onSave={handleSaveSong}
          existingArtists={existingArtists}
          existingStyles={existingStyles}
          existingCategories={existingCategoriesStrings}
          defaultCategories={selectedCategory && selectedCategory !== 'Favoritas' ? [selectedCategory] : []}
          editingSong={editingSong}
        />;
      case 'SONG_DETAILS':
        return selectedSong ? (
          <div className="flex flex-col min-h-screen pb-32">
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
              <button
                onClick={() => {
                  // Logic to return to the correct parent view (Artist list, Style list, Category list, or Library)
                  if (selectedArtist) setView('ARTISTS');
                  else if (selectedStyle) setView('STYLES');
                  else if (selectedCategory) setView('CATEGORIES');
                  else setView('LIBRARY');
                }}
                className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back_ios_new</span>
              </button>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Detalhes</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFavorite(selectedSong)}
                  className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <span className={`material-symbols-outlined text-[26px] ${selectedSong.isFavorite ? 'filled text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}>star</span>
                </button>
                <button onClick={() => { setEditingSong(selectedSong); setView('ADD_SONG'); }} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-gray-900 dark:text-white">edit</span>
                </button>
                <button
                  onClick={() => handleDeleteSong(selectedSong)}
                  className="size-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-red-500"
                  title="Excluir música"
                >
                  <span className="material-symbols-outlined text-[24px]">delete</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-8 flex flex-col items-center">
              <div className="w-full text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white leading-tight">{selectedSong.title}</h1>
                <div className="flex flex-wrap justify-center gap-x-2 text-2xl text-primary font-bold">
                  {selectedSong.artists.map((artist, idx) => (
                    <React.Fragment key={artist}>
                      <button onClick={() => openYouTubeSearch(artist)} className="hover:underline transition-all active:scale-95">{artist}</button>
                      {idx < selectedSong.artists.length - 1 && <span className="text-gray-400">&</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="w-full mt-10">
                <button onClick={() => handlePlaySong(selectedSong)} className="w-full h-16 bg-primary text-white rounded-2xl shadow-glow font-bold text-xl flex items-center justify-center gap-3 transition-transform active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[32px] filled">play_circle</span> ABRIR NO YOUTUBE
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Estilos</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSong.styles.map(s => <span key={s} className="px-4 py-1.5 bg-surface-light dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold shadow-sm">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Categorias</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSong.categories.map(t => <span key={t} className="px-4 py-1.5 bg-surface-light dark:bg-surface-dark border border-black/5 dark:border-white/5 rounded-xl text-sm font-bold shadow-sm">{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-white transition-colors max-w-4xl mx-auto border-x border-gray-100 dark:border-white/5 shadow-2xl">
      {loading && <LoadingOverlay />}
      <Modal isOpen={modalOpen} config={modalConfig} onClose={() => setModalOpen(false)} />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={() => setIsDark(!isDark)}
        onLogout={handleLogout}
        onExport={handleExport}
        onImport={handleImport}
        isDark={isDark}
      />
      <div className="flex-1">{renderContent()}</div>
      {['LIBRARY', 'ARTISTS', 'STYLES', 'CATEGORIES', 'SONG_DETAILS'].includes(view) && (
        <NavBar currentView={view === 'SONG_DETAILS' ? 'LIBRARY' : view} onSetView={handleSetView} />
      )}
    </div>
  );
};

export default App;
